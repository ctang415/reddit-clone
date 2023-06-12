import React, { useEffect, useState } from "react";
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import WhiteUp from "../Assets/upwhite.png"
import WhiteDown from "../Assets/downwhite.png"
import Upvoted from "../Assets/upvoted.png"
import Downvoted from "../Assets/downvoted.png"
import WhiteComment from "../Assets/whitechat.png"
import CommunityIcon from "../Assets/communityicon.png"
import CommentIcon from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import TextEditor from "./TextEditor";
import PostEditor from "./PostEditor"
import MagicUrl from 'quill-magic-url'
import Comment from "./Comment";
import { Quill } from "react-quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import { useQuill } from "react-quilljs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import parse from 'html-react-parser';
import { nanoid } from 'nanoid'
import Delete from "../Assets/delete.png"
import Edit from "../Assets/edit.png"
import ImageCompress from 'quill-image-compress';
import DeletePopup from "./DeletePopup"; 
import Avatar from "../Assets/avatar.png"
import MobileEditor from "./MobileEditor";
Quill.register('modules/imageCompress', ImageCompress);
Quill.register('modules/magicUrl', MagicUrl)

const PostDetailsCard = ( {firebaseCommunityData, setFirebaseCommunityData, detail, setDetail, setUserData, isMobile,
    createNewPost}  ) => {
    const [ drop, setDrop ] = useState(false)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ postValue, setPostValue ] = useState('')
    const [ postHtml, setPostHtml ] = useState('')
    const [ postEmpty, setPostEmpty ] = useState(true)
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ empty, setEmpty ] = useState(true)
    const [ isEmpty, setIsEmpty ] = useState(false)
    const [ edit, setEdit ] = useState(true)
    const [ postEdit, setPostEdit ] = useState(false)
    const [ popup, setPopup ] = useState(false)
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ editId, setEditId ] = useState('')
    const [ postAuthor, setPostAuthor ] = useState('')
    const [ deleted, setDeleted ] = useState('[deleted]') 
    const [ textDrop, setTextDrop ] = useState(false)
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser
    const id = location.state

    const modules = {
        toolbar: '#editor-container-comment',
            magicUrl: true, 
    }
    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'script', 'blockquote', 'code']
    const placeholder = 'What are your thoughts?'
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats, placeholder});

    const handleDrop = () => {
        if (drop) {
            setDrop(false)
        } else {
            setDrop(true)
        }
    }

    const handleEdit = (e) => {
        setEditId(e.target.id)
        setPostEdit(true)
    }

    const handleDelete = () => {
        setPopup(true)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        const myDate = today.toLocaleDateString("en-US", options)
        let parsedValue = JSON.parse(value)
        console.log(parsedValue.ops)
        let cfg = {};
        let converter = new QuillDeltaToHtmlConverter(parsedValue.ops, cfg);
        let info = converter.convert(); 
        console.log(info)
        let newHtml = sanitizeHtml(info, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'link', 'a' ]), 
            allowedAttributes: {'img': ['src'], 'a' : ['href', 'name', 'target'], 'link': [ 'href','rel','type' ]},
            allowedSchemes: [ 'data', 'http', 'https', 'ftp', 'mailto', 'tel'],
            allowedSchemesByTag: {},
            allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
        })
        let newid = nanoid(5)
        const uploadComment = async () => {
                const docRef = doc(db, "communities", firebaseCommunityData[0].name)
                const authorRef = doc(db, "users", postAuthor)
                const userSnap = await getDoc(authorRef)
                const data = userSnap.data()
                let newArray;
                let authorArray;
                const createComment = () => {
                    const updatePost = firebaseCommunityData[0].posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { commentid: newid, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    newArray = updatePost
                    const updateAuthor = data.posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { commentid: newid, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    authorArray = updateAuthor
                }
                createComment()
                await updateDoc(docRef, {posts: newArray })
                await updateDoc(authorRef, {posts: authorArray})
            }
        uploadComment()
        const updateComment = async () => {
            const userRef = doc(db, "users", user.displayName)
            await updateDoc(userRef, {comments: arrayUnion({ commentid: newid, poster: false, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, id: params.id, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate })})
        }
        updateComment().then(() => {
        setDetail([firebaseCommunityData[0].posts.find( item => item.id === params.id)])
    })
        quill.setContents([])
    }

    const handleVote = (e) => {
        if (isLoggedIn) {
            if (e.target.alt === "Up arrow") {
                const updateVote = async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = async () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true ) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "downvote") {
                                            y.vote = 'upvote'
                                            x.votes += 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                poster = x.author
                                x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                x.votes += 1
                                return x
                                }
                            }
                            return x
                        }
                        )
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, { posts: array } )
     
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                        poster = x.author
                                        const updatedVoter = x.voters.map(y => {
                                            if (y.username === currentUser && y.vote === "downvote") {
                                                y.vote = 'upvote'
                                                x.votes += 1
                                                const updateKarma = async () => {
                                                    const userRef = doc(db, "users", poster)
                                                    const userSnap = await getDoc(userRef)
                                                    const userData = userSnap.data()
                                                    await updateDoc(userRef, {karma: userData.karma + 1 } )
                                                    if (poster === currentUser) {
                                                        const updateUser = async () => {
                                                        const docRef = doc(db, "users", user.displayName)
                                                        const docSnap = await getDoc(docRef)
                                                        const data = docSnap.data()
                                                        console.log(data) 
                                                        setUserData([data]) 
                                                        }
                                                        updateUser()
                                                    }
                                                }
                                                updateKarma()
                                                return y
                                            } else {
                                                return y
                                            }
                                        })
                                        return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'upvote' } ]
                                    x.votes += 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma + 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                        }
                                    }
                                    updateKarma()
                                    return x
                                }
                            }
                            return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then( async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setFirebaseCommunityData([data])
                })
            } else if (e.target.alt === "Down arrow") {
                console.log('down')
                const updateVote = async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let array;
                    let poster;
                    const getPost = () => {
                        const post = data.posts.map(x => {
                            if ( x.id === e.target.id ) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            return y
                                        } else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    return x
                                }
                        }
                        return x
                        })
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, {posts: array } )
                    console.log(array)
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const userData = userSnap.data()
                        const myPost = userData.posts.map( x => {
                            if (x.id === e.target.id) {
                                if (x.voters.map(y => y.username).includes(currentUser) === true) {
                                    poster = x.author
                                    const updatedVoter = x.voters.map(y => {
                                        if (y.username === currentUser && y.vote === "upvote") {
                                            y.vote = 'downvote'
                                            x.votes -= 1
                                            const updateKarma = async () => {
                                                const userRef = doc(db, "users", poster)
                                                const userSnap = await getDoc(userRef)
                                                const userData = userSnap.data()
                                                await updateDoc(userRef, {karma: userData.karma - 1 } )
                                                if (poster === currentUser) {
                                                    const updateUser = async () => {
                                                    const docRef = doc(db, "users", user.displayName)
                                                    const docSnap = await getDoc(docRef)
                                                    const data = docSnap.data()
                                                    setUserData([data]) 
                                                    console.log(data)
                                                    }
                                                    updateUser()
                                                }
                                            }
                                            updateKarma()
                                            return y
                                        } 
                                        else {
                                            return y
                                        }
                                    })
                                    return x
                                } else {
                                    poster = x.author
                                    x.voters = [...x.voters, { username: user.displayName, vote: 'downvote' } ]
                                    x.votes -= 1
                                    const updateKarma = async () => {
                                        const userRef = doc(db, "users", poster)
                                        const userSnap = await getDoc(userRef)
                                        const userData = userSnap.data()
                                        await updateDoc(userRef, {karma: userData.karma - 1 } )
                                        if (poster === currentUser) {
                                            const updateUser = async () => {
                                            const docRef = doc(db, "users", user.displayName)
                                            const docSnap = await getDoc(docRef)
                                            const data = docSnap.data()
                                            setUserData([data]) 
                                            }
                                            updateUser()
                                        }
                                    }
                                    updateKarma()
                                return x
                            }
                        }
                        return x
                        })
                        await updateDoc(userRef, { posts: myPost })
                    }
                    updateAuthor()
                }
                updateVote().then( async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    setFirebaseCommunityData([data])
                })
            }
        }
    }

    useEffect(() => {
        if (detail[0] !== undefined) {
            setPostAuthor(detail[0].author)
        }
    }, [detail])
  
    useEffect(() => {
        if (value.length === 25) {
            setValue([])
        } else if (value.length === 0) {
            setEmpty(true)
        } else {
            setEmpty(false)
        }
    }, [value])

    useEffect(() => {
        if (postValue.length === 25) {
            setPostValue([])
        } else if (postValue.length === 0) {
            setPostEmpty(true)
        } else {
            setPostEmpty(false)
        }
    }, [postValue])

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
            setCurrentUser(user.displayName)
        } else {
            setIsLoggedIn(false)
            setCurrentUser('')
        }
    }, [user])

    useEffect(() => {
        document.title = location.pathname.split('/comments')[0].split('f/')[1]
        window.scrollTo({ top:0, behavior:'auto'})
    }, [location.pathname])

    useEffect(() => {
        if (id !== null) {
            setEdit(false)
        } else {
            setEdit(true)
        }
    }, []) 

    if (isMobile) {
        return (
        detail.map( data => {
            return (
        <div className="post-detail" style={ isLoggedIn ? { gap: "1em", paddingTop: "2em"} : {gap: "0em"}} key={data.id}>
            <div className={isLoggedIn ? "post-detail-icon" : "input-empty"}>
                <img src={CommunityIcon} alt={"Community Icon"} onClick={() => navigate(`../../f/${data.community}`)}></img>
            </div>
            <div className="post-detail-mobile-logged" onClick={() => navigate(`../../f/${data.community}`)}>
                        f/{data.community}
                    </div>
            <div className="post-detail-upper" style=
            { isLoggedIn ? { backgroundColor: "white", color: "black" } : { backgroundColor: "black", color: "white" }}>
                <div className="post-detail-right">
                <div style={ isLoggedIn ? 
                    { display: "flex", flexDirection: "row", alignSelf: "flex-end", borderRadius: "2em", backgroundColor: "gainsboro", paddingTop: "0.1em", paddingBottom: "0.1em", paddingLeft: "0.4em", paddingRight: "0.4em"} 
                    : {}} onClick={() => navigate(-1)}>
                    {isLoggedIn ? "X" : null}
                </div>
                    <div className="post-detail-right-header" style={ isLoggedIn ? { alignItems: "center", gap: "0em", paddingTop: "1.5em" } : { alignItems: "none" }}>
                        <img src={ isLoggedIn ? Avatar : CommunityIcon} alt="Community icon"></img>
                        <div>
                        <div className={ isLoggedIn ? "input-empty" : "post-detail-right-community"}>
                            f/{data.community}
                        </div>
                        <div className="post-detail-pinned-author"> 
                            by
                            <Link to={ deleted === data.author ? null : `../user/${data.author}`} style={isLoggedIn ? {color: "black" } : {color: "rgb(204, 202, 202)"}}> 
                                u/{data.author} 
                            </Link>
                        </div>
                        </div>
                    </div>
                    <h3>
                        {data.title}
                    </h3>
                    <div className="post-detail-media-true" style={isLoggedIn ? {color: "black"} : {color: "rgb(204, 202, 202)"}}>
                        { postEdit ? null : parse(data.content.html)}
                        <div className={ postEdit ? "user-left" : "input-empty"}>
                        <PostEditor postHtml={postHtml} setPostHtml={setPostHtml} setDetail={setDetail} setPostEdit={setPostEdit}
                        postValue={postValue} setPostValue={setPostValue} postEdit={postEdit} editId={editId}
                        postEmpty={postEmpty} setPostEmpty={setPostEmpty} setFirebaseCommunityData={setFirebaseCommunityData}
                        />
                        </div>
                    </div> 
                    <div className={ ( isLoggedIn &&  (data.voters[data.voters.findIndex(data => data.username === currentUser)]) ) ? "input-empty" : "post-detail-votes-logged"}>
                        <ul>
                        <li style={isLoggedIn ? { backgroundColor: "white", color: "grey"} : { backgroundColor: "rgb(89, 91, 96)", color: "white", paddingTop: "0.5em", paddingBottom: "0.5em"}}>
                            <img src={ isLoggedIn ? Up : WhiteUp} id={data.id} alt="Up arrow" onClick={handleVote}></img>
                                {data.votes}
                            <img src={ isLoggedIn ? Down : WhiteDown} id={data.id} alt="Down arrow" onClick={handleVote}></img>
                        </li>
                        <li style={isLoggedIn ? { backgroundColor: "white", color: "grey"} : { backgroundColor: "rgb(89, 91, 96)", color: "white", paddingTop: "0.5em", paddingBottom: "0.5em"}}>
                            <img src={ isLoggedIn ? CommentIcon : WhiteComment} alt="Comment bubble"/> { data.comments.length }
                        </li>
                        </ul>
                    </div>
                    <div className={ ( isLoggedIn &&  (data.voters[data.voters.findIndex(data => data.username === currentUser)] ) ) ? "post-detail-votes-logged" : "input-empty"}>
                    <ul>
                        <li style={isLoggedIn ? { backgroundColor: "white", color: "grey"} : { backgroundColor: "rgb(89, 91, 96)", color: "white"}}>
                            <img src={ ( isLoggedIn &&  (data.voters[data.voters.findIndex(data => data.username === currentUser)] ) && data.voters[data.voters.findIndex(data => data.username === currentUser)].vote === ("upvote")) ? Upvoted : Up } id={data.id} alt="Up arrow" onClick={handleVote}></img>
                                {data.votes}
                            <img src={ ( isLoggedIn &&  (data.voters[data.voters.findIndex(data => data.username === currentUser)] ) && data.voters[data.voters.findIndex(data => data.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} id={data.id} alt="Down arrow" onClick={handleVote}></img>
                        </li>
                        <li style={isLoggedIn ? { backgroundColor: "white", color: "grey"} : { backgroundColor: "rgb(89, 91, 96)", color: "white"}}>
                            <img src={ isLoggedIn ? CommentIcon : WhiteComment} alt="Comment bubble"/> { data.comments.length }
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
            <div className="post-detail-lower" style={isLoggedIn ? { color: "black", backgroundColor: "white" } : { color: "white", backgroundColor: "black"}}>
            <div>
                        <div className="post-drop-left" onClick={handleDrop}> Sort By: Top (Suggested) ⌄</div>
                        <ul className={ drop ? "post-detail-drop": "input-empty"} onClick={handleDrop} style={isLoggedIn ? {backgroundColor: "white", color:"black"} : {backgroundColor: "black", color: "grey"}}>
                            <li>Best</li>
                            <li id="post-detail-selected" style={isLoggedIn ? {color: "rgb(0, 123, 255)"} : {}} >Top</li>
                            <li>New</li>
                            <li>Controversial</li>
                            <li>Old</li>
                            <li>Q&a</li>
                        </ul>
                    </div>
                <div className={ isLoggedIn ? "comment-user" : "input-empty" }>
                    <div className={ isLoggedIn && !textDrop ? "community-post-true" : "community-post-false"}>
                            <img id="community-input-img" src={ user ? user.photoURL : null} alt="User Icon"></img>
                                <input type="text" style={ { borderRadius: "2em" }} placeholder="Leave a comment" onClick={() => setTextDrop(true)}></input>
                    </div>
                    <div className={ textDrop ? "mobile-editor" : "input-empty"} >
                    <MobileEditor 
                    html={html} setHtml={setHtml} value={value} setValue={setValue} 
                    empty={empty} setEmpty={setEmpty} setTextDrop={setTextDrop} postAuthor={postAuthor}
                    firebaseCommunityData={firebaseCommunityData} detail={detail} setDetail={setDetail}
                    />
                    </div>
                </div>
                <Comment 
                setEdit={setEdit} isLoggedIn={isLoggedIn} setDetail={setDetail} firebaseCommunityData={firebaseCommunityData}
                setFirebaseCommunityData={setFirebaseCommunityData} detail={detail} edit={edit} id={id} isEmpty={isEmpty} 
                setIsEmpty={setIsEmpty} currentUser={currentUser} isMobile={isMobile} postAuthor={postAuthor} 
                setPostAuthor={setPostAuthor}
                />
            </div>
        </div>
            )
        
        })
        )
    } else {
    return (
        detail.map( data => {
            return (
        <div className="post-detail" key={data.id}>
            <DeletePopup popup={popup} setPopup={setPopup}/>
            <div className="post-detail-upper">
                <div className="post-detail-left">
                    <div className="post-detail-votes">
                        <img src={Up} id={data.id} alt="Up arrow" onClick={handleVote}></img>
                            {data.votes}
                        <img src={Down} id={data.id} alt="Down arrow" onClick={handleVote}></img>
                    </div>
                </div>
                <div className="post-detail-right">
                    <div className="post-detail-pinned-author">Posted by 
                        <Link to={ deleted === data.author ? null : `../user/${data.author}`}> u/{data.author} </Link>
                    </div>
                    <h3>
                        {data.title}
                    </h3>
                    <div className="post-detail-media-true">
                        { postEdit ? null : parse(data.content.html)}
                        <div className={ postEdit ? "user-left" : "input-empty"}>
                        <PostEditor postHtml={postHtml} setPostHtml={setPostHtml} setDetail={setDetail} setPostEdit={setPostEdit}
                        postValue={postValue} setPostValue={setPostValue} postEdit={postEdit} editId={editId}
                        postEmpty={postEmpty} setPostEmpty={setPostEmpty} setFirebaseCommunityData={setFirebaseCommunityData}
                        />
                        </div>
                    </div> 
                    <ul>
                        <div>
                            <img src={CommentIcon} alt="Comment bubble"/> { data.comments.length } Comments
                        </div>
                        <li><img src={Share} alt="Share button" /> Share</li>
                        <li><img src={Save} alt="Save button" /> Save</li>
                        <div className="post-detail-dropbar-user">
                            <ul> 
                                <li id={data.id} className={ data.author === currentUser ? "user-left" : 'input-empty'} 
                                onClick={handleEdit}
                                >
                                    <img src={Edit} alt="Edit icon" ></img>Edit Post
                                </li>
                                <li id={data.id} className={ data.author === currentUser ? "user-left" : 'input-empty'}
                                onClick={handleDelete}>
                                    <img src={Delete} alt="Delete icon"></img>
                                    Delete
                                </li>
                            </ul>
                        </div>
                    </ul>
                </div>
            </div>
            <div className="post-detail-lower">
                <div className={ isLoggedIn ? "comment-user" : "input-empty" }>
                    <div className="comment-as-user">
                        Comment as <Link to={user ? `../user/${user.displayName}` : null }>{ user ? user.displayName : null }</Link>
                    </div>
                    <TextEditor 
                    quillRef={quillRef} quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} 
                    handleSubmit={handleSubmit} empty={empty} setEmpty={setEmpty}
                    />
                </div>
                <div className="post-divider-text">
                    <div>
                        <div className="post-drop-left" onClick={handleDrop}> Sort By: Top (Suggested) ⌄</div>
                        <ul className={ drop ? "post-detail-drop": "input-empty"} onClick={handleDrop}>
                            <li>Best</li>
                            <li id="post-detail-selected" >Top</li>
                            <li>New</li>
                            <li>Controversial</li>
                            <li>Old</li>
                            <li>Q&a</li>
                        </ul>
                    </div>
                </div>
                <Comment 
                setEdit={setEdit} isLoggedIn={isLoggedIn} setDetail={setDetail} firebaseCommunityData={firebaseCommunityData}
                setFirebaseCommunityData={setFirebaseCommunityData} detail={detail} edit={edit} id={id} isEmpty={isEmpty} 
                setIsEmpty={setIsEmpty} currentUser={currentUser} />
            </div>
        </div>
            )
        })
    )
    }
}

export default PostDetailsCard