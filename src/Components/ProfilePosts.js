import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import parse from 'html-react-parser';
import Up from "../Assets/up.png"
import Upvoted from "../Assets/upvoted.png"
import Downvoted from "../Assets/downvoted.png"
import Down from "../Assets/down.png"
import WhiteUp from "../Assets/upwhite.png"
import WhiteDown from "../Assets/downwhite.png"
import WhiteComment from "../Assets/whitechat.png"
import Comment from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import CommunityIcon from "../Assets/communityicon.png"
import { onAuthStateChanged } from "firebase/auth";

const ProfilePosts = ( { overview, commentsOnly, postsOnly, matchingUser, setOverview, setCommentsOnly, setPostsOnly, 
    setUserData,  profileData, isMobile } ) => {
    const [ userInfo, setUserInfo ] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ posts, setPosts ] = useState([])
    const [ comments, setComments ] = useState([])
    const [ emptyComments, setEmptyComments] = useState(false)
    const [ emptyPosts, setEmptyPosts] = useState(false)
    const [ currentUser, setCurrentUser ] = useState('')
    const [ empty, setEmpty ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser
    const location = useLocation()
    
    const getUserInfo = async () => {
        const docRef = doc(db, "users", params.id)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        if (data !== undefined) { 
            if (data.posts && data.comments) {
                setComments(data.comments)
                setPosts(data.posts) 
                setUserInfo(data.posts.concat(data.comments)) 
                setOverview(true) 
                setPostsOnly(false) 
                setCommentsOnly(false)
            } else if (data.posts && !data.comments) {
                setPosts(data.posts)
                setPostsOnly(true)
                setOverview(false)
                setCommentsOnly(false)
            } else {
                setComments(data.comments)
                setCommentsOnly(true)
                setOverview(false)
                setPostsOnly(false)
            }
        }
    }

    const handleVote = (e) => {
        if (isLoggedIn) {
            if (e.target.alt === "Up arrow") {
                const updateVote = async () => {
                    const docRef = doc(db, "communities", e.target.className)
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
                        })
                        array = post
                    }
                    getPost()
                    await updateDoc(docRef, { posts: array } )
                    
                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const data = userSnap.data()

                        const myPost = data.posts.map( x => {
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
                                                const data = userSnap.data()
                                                await updateDoc(userRef, {karma: data.karma + 1 } )
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
                                        const data = userSnap.data()
                                        await updateDoc(userRef, {karma: data.karma + 1 } )
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
                    updateAuthor().then(() => {
                        getUserInfo()
                    })
                }
                updateVote()
            } else if (e.target.alt === "Down arrow") {
                console.log('down')
                const updateVote = async () => {
                    const docRef = doc(db, "communities", e.target.className)
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

                    const updateAuthor = async () => {
                        const userRef = doc(db, "users", poster)
                        const userSnap = await getDoc(userRef)
                        const data = userSnap.data()
                        const myPost = data.posts.map( x => {
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
                                                const data = userSnap.data()
                                                await updateDoc(userRef, {karma: data.karma - 1 } )
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
                                        const data = userSnap.data()
                                        await updateDoc(userRef, {karma: data.karma - 1 } )
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
                    updateAuthor().then(() => {
                        getUserInfo()
                    })
                }
                updateVote()
            }
        }
    }

    const handleDelete = async (e) => {
        const docRef = doc(db, "communities", e.target.parentNode.className)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()

        const userRef = doc(db, "users", user.displayName)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        let newArray;
        const deleteComment = () => {
            const updatePost = userData.comments.filter(item => {
                if (item.commentid !== e.target.id) {
                    return item
                }
            })
            newArray = updatePost
        }
        let filteredArray;
        const deleteFromFirebase = () => {
            const updateComment = data.posts.map(item => {
                return {...item, comments: item.comments.filter((x) => x.commentid !== e.target.id)}
            })
            filteredArray = updateComment
        }
        deleteComment()
        deleteFromFirebase()
        await updateDoc(docRef, { posts: filteredArray })
        await updateDoc(userRef, { comments: newArray })
        getUserInfo()
    }

    useEffect(() => {
    onAuthStateChanged(auth, user => {
        if (user) {
        setUserInfo([])
        setPosts([])
        setComments([])
        getUserInfo()
        }
    })
    }, [location.pathname, user])

    useEffect(() => {
        if (user && !user.isAnonymous) {
            setIsLoggedIn(true)
            setCurrentUser(user.displayName)
        } else {
            setIsLoggedIn(false)
            setCurrentUser('')
        }
    }, [user])

    useEffect(() => {
        if (comments.length === 0 && posts.length === 0) {
            setEmpty(true) 
        } else {
            setEmpty(false)
        }
    }, [comments, posts])

    useEffect(() => {
        if (comments.length === 0) {
            setEmptyComments(true)
        } else {
            setEmptyComments(false)
        }
    }, [comments])

    useEffect(() => {
        if (posts.length === 0) {
            setEmptyPosts(true)
        } else {
            setEmptyPosts(false)
        }
    }, [posts])

    if (isMobile) {
        if (empty && overview) {
            return (
                <div className="post-width" >
                    <div className="post-width-empty" style={isLoggedIn ? {height: "60vh", backgroundColor: "white"} : {height: "60vh"}}>
                        <div className={ isLoggedIn ? "input-empty" : "user-left"} style={{fontSize: "1em"}}>
                            hmm... u/{params.id} hasn't posted yet
                        </div>
                    </div>
                </div>
            )
        } else if (commentsOnly && emptyComments) {
            return (
                <div className="post-width">
                    <div className="post-width-empty" style={isLoggedIn ? {height: "60vh", backgroundColor: "white"} : {height: "60vh"}}>
                        <div className={ isLoggedIn ? "input-empty" : "user-left"} style={{fontSize: "1em"}}>
                            hmm... u/{params.id} hasn't commented yet
                        </div>
                    </div>
                </div>
            )
        } else if (postsOnly && emptyPosts) {
            return (
                <div className="post-width">
                    <div className="post-width-empty" style={isLoggedIn ? {height: "60vh", backgroundColor: "white"} : {height: "60vh"}}>
                        <div className={ isLoggedIn ? "input-empty" : "user-left"} style={{fontSize: "1em"}}>
                            hmm... u/{params.id} hasn't posted yet
                        </div>
                    </div>
                </div>
            )
        } else if (overview && userInfo[0] !== undefined) {
            return (
                userInfo.map(data => {
                    return (
                        <div className={ data.author !== "[deleted]" ? "post-width" : "input-empty"}>
                            <div className={ !isLoggedIn ? data.poster ? "profile-post-mobile" : "input-empty" : data.poster ? "profile-post-mobile-logged" : "input-empty" }>
                                <div className="post-right-mobile">
                                        <div className={ isLoggedIn ? "post-pinned-community-mobile-logged" : "post-pinned-community-mobile" }>
                                            <img src={CommunityIcon} alt="Community icon"></img>
                                            <Link to={`../f/${data.community}`}>f/{data.community}</Link>
                                            {data.date}
                                        </div>
                                        <div className={ isLoggedIn ? "post-pinned-header-mobile-title-logged" : "post-pinned-header-mobile-title"}> 
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {data.title}
                                            </Link>
                                        </div>
                                        <div className="post-media-true-mobile">
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {parse(`${data.content.html}`)}
                                            </Link>
                                        </div>
                                    <ul>
                                        <li style={ isLoggedIn ? { color: "grey" } : {color: "white"}}>
                                            <img src={ isLoggedIn ? ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up :
                                            ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : WhiteUp} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                                {data.votes}
                                            <img src={ isLoggedIn ? 
                                            ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down :
                                                ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : WhiteDown } alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                        </li>
                                        <li>
                                            <Link to={`../f/${data.community}/comments/${data.id}`} style={ isLoggedIn ? { color: "grey" } : {color: "white"}}>
                                            <img src={isLoggedIn ? Comment : WhiteComment} alt="Comment bubble"/> 
                                            { data.poster ? data.comments.length : null }
                                            </Link>
                                        </li> 
                                    </ul>
                                </div>
                            </div>
                            <div className={ isLoggedIn ?
                                data.poster ? "input-empty" : "profile-post-logged-mobile" :
                                data.poster ? "input-empty" : "profile-post-logged-mobile-logged"}>
                                <div className={ isLoggedIn ? "profile-post-community-name-logged" : "profile-post-community-name"}>
                                    <img src={CommunityIcon} alt="Community icon"/>
                                    <Link to={`../f/${data.community}`}>
                                        f/{data.community}
                                    </Link>
                                    {data.date}
                                </div> 
                            <div className={ isLoggedIn ? "profile-post-bottom-logged" : "profile-post-bottom"}>
                                    <div>
                                        <div className={isLoggedIn ? "profile-post-title-logged" : "profile-post-title"}>
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {data.title}
                                            </Link>
                                        </div> 
                                        <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                <div className={isLoggedIn ? "profile-post-text-logged" : "profile-post-text" }>
                                                    {parse(`${data.content.html}`)}
                                                </div>
                                        </Link>
                                        <div className={isLoggedIn ? "post-right" : "post-right-mobile"} style={{ paddingLeft: "0em"}}>
                                        <ul>
                                            <li>
                                            <img src={isLoggedIn ? Up : WhiteUp} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                                {data.votes}
                                            <img src={ isLoggedIn ? Down : WhiteDown} alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                            </li>
                                            </ul>
                                            </div>
                                    </div>
                            </div>
                        </div>
                    </div>   
                    )
                })
            )
        } else if (comments !== undefined && commentsOnly) {
            return (
                comments.map((data) => {
                    return (
                        <div className="post-width">
                            <div style={ isLoggedIn ? { backgroundColor: "white", flexDirection: "column", borderTop: "0.5px solid gainsboro", borderBottom: "0.5px solid gainsboro"} : 
                            {backgroundColor: "black", border: "none", gap: "0.3em", padding: "1em"}} 
                            className={ isLoggedIn ? data.poster ? "input-empty" : "profile-post-mobile" : data.poster ? "input-empty" : "profile-post-mobile-logged" }>
                                <div className={ isLoggedIn ? "profile-post-community-name-logged" : "profile-post-community-name"}>
                                    <img src={CommunityIcon} alt="Community icon"/>
                                    <Link to={`../f/${data.community}`}>
                                        f/{data.community}
                                    </Link>
                                    {data.date}
                                </div> 
            
                            <div className={ isLoggedIn ? "profile-post-bottom-logged" : "profile-post-bottom"}>
                                    <div>
                                        <div className={isLoggedIn ? "profile-post-title-logged" : "profile-post-title"}>
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {data.title}
                                            </Link>
                                        </div> 
                                        <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                <div style={ isLoggedIn ? {} : {paddingTop: "1em", paddingBottom: "1em"}}
                                                className={isLoggedIn ? "profile-post-text-logged" : "profile-post-text"}>
                                                    {parse(`${data.content.html}`)}
                                                </div>
                                        </Link>
                                        <div className={isLoggedIn ? "post-right" : "post-right-mobile"} style={{ paddingLeft: "0em"}}>
                                        <ul>
                                            <li style={ isLoggedIn ? { color: "grey" } : {color: "white"}}>
                                            <img src={ isLoggedIn ? Up : WhiteUp} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                                {data.votes}
                                            <img src={ isLoggedIn ? Down : WhiteDown} alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                            </li>
                                            </ul>
                                            </div>
                                    </div>
                            </div>
                        </div>
                    </div>
                )
            })
            )
        } else if (posts !== undefined && postsOnly) {
            return (
                posts.map((data) => {
                    return (
                        <div className="post-width">
                        <div style={ isLoggedIn ? { backgroundColor: "white"} : {backgroundColor: "black", border: "none", flexDirection: "row"}} className={ data.poster && data.author === params.id ? "profile-post-mobile-logged" : "input-empty"}>
                                <div className="post-right-mobile">
                                        <div className={ isLoggedIn ? "post-pinned-community-mobile-logged" : "post-pinned-community-mobile"}>
                                            <img src={CommunityIcon} alt="Community icon"></img>
                                            <Link to={`../f/${data.community}`}>f/{data.community}</Link>
                                            {data.date}
                                        </div>
                                  
                                        <div className={ isLoggedIn ? "post-pinned-header-mobile-title-logged": "post-pinned-header-mobile-title"}> 
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {data.title}
                                            </Link>
                                        </div>
                                        <div className="post-media-true-mobile">
                                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                                {parse(`${data.content.html}`)}
                                            </Link>
                                        </div>
                                    <ul>
                                        <li style={ isLoggedIn ? { color: "grey" } : {color: "white"}}>
                                            <img src={ isLoggedIn ? ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up
                                               : ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : WhiteUp} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                                {data.votes}
                                            <img src={ isLoggedIn ?    ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down :
                                                ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : WhiteDown} alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                        </li>
                                        <li >
                                        <Link to={`../f/${data.community}/comments/${data.id}`} style={ isLoggedIn ? { color: "grey" } : {color: "white"}}>
                                            <img src={ isLoggedIn ? Comment : WhiteComment} alt="Comment bubble" /> 
                                            { data.poster ? data.comments.length : null }
                                            </Link>
                                        </li> 
                                    </ul>
                                </div>
                            </div>
                    </div>
                )
            })
            )
        }
    } else {
        if (empty && overview) {
            return (
                <div className="post-width">
                    <div className="post-width-empty">
                        <div>hmm... u/{params.id} hasn't posted yet</div>
                    </div>
                </div>
            )
        } else if (commentsOnly && emptyComments) {
            return (
                <div className="post-width">
                    <div className="post-width-empty">
                        <div>hmm... u/{params.id} hasn't commented yet</div>
                    </div>
                </div>
            )
        } else if (postsOnly && emptyPosts) {
            return (
                <div className="post-width">
                    <div className="post-width-empty">
                        <div>hmm... u/{params.id} hasn't posted yet</div>
                    </div>
                </div>
            )
    } else if (overview && userInfo[0] !== undefined) {
        return (
        userInfo.map(data => {
            return (
                <div className="post-width">
                    <div className={ data.poster ? "post" : "input-empty"}>
                        <div className="post-left">
                        <div className={"post-votes-user"}>
                                <img src={ ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                    {data.votes}
                                <img src={ ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-right-profile">
                                <div className="post-pinned-community">
                                    <Link to={`../f/${data.community}`}>f/{data.community}</Link>
                                </div>
                                <div className="post-pinned-author">Posted by 
                                    <Link to={`../user/${params.id}`}>u/{params.id}
                                    </Link>
                                </div>
                            </div>
                                <div className="post-pinned-header"> 
                                    <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        {data.title}
                                    </Link>
                                </div>
                                <div className="post-media-true">
                                    <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        {parse(`${data.content.html}`)}
                                    </Link>
                                </div>
                            <ul>
                                <li>
                                    <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <img src={Comment} alt="Comment bubble"/> { data.poster ? data.comments.length : null } Comments
                                    </Link>
                                </li> 
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
                    <div className={data.poster ? "input-empty" : "profile-post" }>
                        <div className="profile-post-top">
                            <Link to={`../user/${data.username}`}>
                                <div className="profile-post-username">{data.username}</div> 
                            </Link> commented on 
                        <div className="profile-post-title">
                            <Link to={`../f/${data.community}/comments/${data.id}`}>
                                {data.title}
                            </Link>
                        </div> 
                            in *
                        <div className="profile-post-community-name">
                            <Link to={`../f/${data.community}`}>
                                f/{data.community}
                            </Link>
                            </div> 
                                * Posted by 
                        <div className="profile-post-poster">
                        <Link to={`../user/${data.author}`}>
                            u/{data.author}
                        </Link>
                        </div>
                    </div>
                    <div className="profile-post-bottom">
                            <div>
                                <div className="profile-post-poster-information">
                                       <div>
                                            <Link to={`../user/${data.username}`}>{data.username}</Link>
                                        </div> 
                                        {data.votes} points * {data.date}
                                </div>
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <div className="profile-post-text">
                                            {parse(`${data.content.html}`)}
                                        </div>
                                </Link>
                                <ul>
                                    <li>Reply</li>
                                    <li>Share</li>
                                    <div className={ !matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul>
                                        <li>Report</li>
                                        <li>Save</li>
                                    </ul>
                                </div>
                                <div className={ isLoggedIn && matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul className={data.community}>
                                        <li>Save</li>
                                        <li className={data.id} id={data.commentid} 
                                        onClick={() => navigate(`../f/${data.community}/comments/${data.id}`, { state: data.commentid})}>
                                            Edit
                                        </li>
                                        <li className={data.id} id={data.commentid} onClick={handleDelete}>Delete</li>
                                    </ul>
                                </div>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>   
            )
        })
    )
} else if (comments !== undefined && commentsOnly) {
    return (
        comments.map((data) => {
            return (
                <div className="post-width">
                    <div className={data.poster ? "input-empty" : "profile-post" }>
                        <div className="profile-post-top">
                        <Link to={`../user/${data.username}`}>
                            <div className="profile-post-username">{data.username}</div> 
                        </Link> commented on 
                        <div className="profile-post-title">
                            <Link to={`../f/${data.community}/comments/${data.id}`}>{data.title}</Link>
                        </div> 
                            in *
                        <div className="profile-post-community-name">
                            <Link to={`../f/${data.community}`}>
                                f/{data.community}
                            </Link>
                            </div> 
                                * Posted by 
                        <div className="profile-post-poster">
                        <Link to={`../user/${data.author}`}>
                            u/{data.author}
                        </Link>
                        </div>
                    </div>
                    <div className="profile-post-bottom">
                            <div>
                                <div className="profile-post-poster-information">
                                       <div>
                                            <Link to={`../user/${data.username}`}>{data.username}</Link>
                                        </div> 
                                        {data.votes} points * {data.date}
                                </div>
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <div className="profile-post-text">{parse(`${data.content.html}`)}</div>
                                </Link>
                                <ul>
                                    <li>Reply</li>
                                    <li>Share</li>
                                    <div className={ !matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                    <ul>
                                        <li>Report</li>
                                        <li>Save</li>
                                    </ul>
                                </div>
                                    <div className={ isLoggedIn && matchingUser ? "post-detail-dropbar" : "input-empty"}>
                                        <ul>
                                            <li>Save</li>
                                            <li className={data.id} id={data.commentid}>Edit</li>
                                            <li className={data.id} id={data.commentid} onClick={handleDelete}>Delete</li>
                                        </ul>
                                </div>
                                </ul>
                            </div>
                    </div>
                </div>
            </div>
        )
    })
    )
} else if (posts !== undefined && postsOnly) {
    return (
        posts.map((data) => {
            return (
                <div className="post-width">
                    <div className={ data.poster ? "post" : "input-empty"}>
                        <div className="post-left">
                        <div className="post-votes-only">
                                <img src={ ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("upvote")) ? Upvoted : Up} alt="Up arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                                    {data.votes}
                                <img src={ ( (data.voters[data.voters.findIndex(x=> x.username === currentUser)] ) && data.voters[data.voters.findIndex(voter => voter.username === currentUser)].vote === ("downvote")) ? Downvoted : Down} alt="Down arrow" className={data.community} id={data.id} onClick={handleVote}></img>
                            </div>
                        </div>
                        <div className="post-right">
                            <div className="post-right-profile">
                                <div className="post-pinned-community"><Link to={`../f/${data.community}`}>f/{data.community}</Link></div>
                                <div className="post-pinned-author">Posted by <Link to={`../user/${params.id}`}>u/{params.id}</Link></div>
                            </div>
                                <div className="post-pinned-header"> 
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                    {data.title}
                                    </Link>
                                </div>
                                <div className="post-media-true">
                                <Link to={`../f/${data.community}/comments/${data.id}`}>
                                    {parse(`${data.content.html}`)}
                                    </Link>
                                </div>
                            <ul>
                                <li>
                                    <Link to={`../f/${data.community}/comments/${data.id}`}>
                                        <img src={Comment} alt="Comment bubble"/> { data.poster ? data.comments.length : null } Comments
                                    </Link>
                                    </li> 
                                <li><img src={Share} alt="Share button" /> Share</li>
                                <li><img src={Save} alt="Save button" /> Save</li>
                                <li>...</li>
                            </ul>
                        </div>
                    </div>
            </div>
        )
    })
    )
}
}
}

export default ProfilePosts