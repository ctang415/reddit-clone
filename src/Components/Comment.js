import React, { useEffect, useState } from "react";
import CommentIcon from "../Assets/comment.png"
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import WhiteUp from "../Assets/upwhite.png"
import WhiteDown from "../Assets/downwhite.png"
import WhiteComment from "../Assets/whitechat.png"
import Avatar from "../Assets/avatar.png"
import { Link, useLocation, useParams } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';
import { useQuill } from "react-quilljs";
import CommentEditor from "./CommentEditor";
import MagicUrl from 'quill-magic-url'
import { Quill } from "react-quill";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import ModalEdit from "./ModalEdit";
import DeletePopupComment from "./DeletePopupComment";
import CommentEditorMobile from "./CommentEditorMobile";
Quill.register('modules/magicUrl', MagicUrl)

const Comment = ( {detail, edit, id, setEdit, isLoggedIn, isEmpty, setIsEmpty, setDetail, 
    setFirebaseCommunityData, firebaseCommunityData, currentUser, isMobile, postAuthor, setPostAuthor} ) => {
    const [ update, setUpdate ] = useState(false)
    const [ newPost, setNewPost ] = useState([])
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ empty, setEmpty ] = useState(true)
    const [ currentComment, setCurrentComment ] = useState('')
    const [ dropbar, setDropbar ] = useState(false)
    const [ popup, setPopup ] = useState(false)
    const [ commentId, setCommentId ] = useState('')
    const location = useLocation()
    const params = useParams()
    const user = auth.currentUser

    const modules = {
        toolbar: '#editor-container-comment-edit',
        magicUrl: true, 
    } 
    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'script', 'blockquote', 'code']
    const placeholder = 'What are your thoughts?'
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats, placeholder});

    const handleSubmit = () => {
        if (!isMobile) {
        let parsedValue = JSON.parse(value)
        let cfg = {};
        let converter = new QuillDeltaToHtmlConverter(parsedValue.ops, cfg);
        let info = converter.convert(); 
        let newHtml = sanitizeHtml(info, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'link', 'a' ]), 
            allowedAttributes: {'img': ['src'], 'a' : ['href', 'name', 'target'], 'link': [ 'href','rel','type' ]},
            allowedSchemes: [ 'data', 'http', 'https', 'ftp', 'mailto', 'tel'],
            allowedSchemesByTag: {},
            allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
        })

        const updateComment = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const userRef = doc(db, "users", user.displayName)
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data()
            let newArray;
            
            const editPost = () => {
                if (id !== null) {
                const updatePost = data.posts.map(item => {
                    return {...item, comments: item.comments.map((x) => {
                        if (x.commentid === id) {
                            x.content.delta = value
                            x.content.html = newHtml
                            return x
                        } 
                        return x
                    })}
                })
            newArray = updatePost
        } else {
            const updatePost = data.posts.map(item => {
                return {...item, comments: item.comments.map((x) => {
                    if (x.commentid === currentComment) {
                        x.content.delta = value
                        x.content.html = newHtml
                        return x
                    } 
                    return x
                })}
            })
            newArray = updatePost
        }
    }
        editPost()

        let array;
        const editComment = () => {
            if (id !== null) {
            const update = userData.comments.map( item => {
                if (item.commentid === id) {
                    item.content.delta = value
                    item.content.html = newHtml
                    return item
                }
                return item
            })
            array = update
        } else {
            const update = userData.comments.map( item => {
                if (item.commentid === currentComment) {
                    item.content.delta = value
                    item.content.html = newHtml
                    return item
                }
                return item
            })
            array = update
        }
    }
        editComment()
        await updateDoc(docRef, {posts: newArray })
        await updateDoc(userRef, {comments: array} )
        setUpdate(true)
        setEdit(true)
        setIsEmpty(false)
    }

    const updateAuthor = async () => {
        let authorArray;
        const authorRef = doc(db, "users", postAuthor)
        const authorSnap = await getDoc(authorRef)
        const data = authorSnap.data()
        if (id !== null) {
        const updatePost = data.posts.map(item => {
            return {...item, comments: item.comments.map((x) => {
                if (x.commentid === id) {
                    x.content.delta = value
                    x.content.html = newHtml
                    return x
                } 
                return x
            })}
        })
        authorArray = updatePost
    } else {
        const updatePost = data.posts.map(item => {
            return {...item, comments: item.comments.map((x) => {
                if (x.commentid === currentComment) {
                    x.content.delta = value
                    x.content.html = newHtml
                    return x
                } 
                return x
            })}
        })
        authorArray = updatePost
    }
        await updateDoc(authorRef, {posts: authorArray})
    }
    updateAuthor()

    const getFirebaseComment = async () => {
        if (id !== null) {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            let myPost = data.posts.find( item => item.id === params.id )
            let myComment = myPost.comments.find(item => item.commentid === id)
            setNewPost([myComment])
        } else {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            let myPost = data.posts.find( item => item.id === params.id )
            let myComment = myPost.comments.find(item => item.commentid === currentComment)
            setNewPost([myComment])
        }
    }
    updateComment().then(() => {
        getFirebaseComment()
    })
} else {
    let parsedValue = JSON.parse(value)
    let cfg = {};
    let converter = new QuillDeltaToHtmlConverter(parsedValue.ops, cfg);
    let info = converter.convert(); 
    let newHtml = sanitizeHtml(info, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'link', 'a' ]), 
        allowedAttributes: {'img': ['src'], 'a' : ['href', 'name', 'target'], 'link': [ 'href','rel','type' ]},
        allowedSchemes: [ 'data', 'http', 'https', 'ftp', 'mailto', 'tel'],
        allowedSchemesByTag: {},
        allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
    })

    const updateComment = async () => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const userRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        let newArray;
        
        const editPost = () => {
            if (id !== null) {
            const updatePost = data.posts.map(item => {
                return {...item, comments: item.comments.map((x) => {
                    if (x.commentid === id) {
                        x.content.delta = value
                        x.content.html = newHtml
                        return x
                    } 
                    return x
                })}
            })
        newArray = updatePost
    } else {
        const updatePost = data.posts.map(item => {
            return {...item, comments: item.comments.map((x) => {
                if (x.commentid === commentId) {
                    x.content.delta = value
                    x.content.html = newHtml
                    return x
                } 
                return x
            })}
        })
        newArray = updatePost
    }
}
    editPost()

    let array;
    const editComment = () => {
        if (id !== null) {
        const update = userData.comments.map( item => {
            if (item.commentid === id) {
                item.content.delta = value
                item.content.html = newHtml
                return item
            }
            return item
        })
        array = update
    } else {
        const update = userData.comments.map( item => {
            if (item.commentid === commentId) {
                item.content.delta = value
                item.content.html = newHtml
                return item
            }
            return item
        })
        array = update
    }
}
    editComment()
    await updateDoc(docRef, {posts: newArray })
    await updateDoc(userRef, {comments: array} )
    setUpdate(true)
    setEdit(true)
    setIsEmpty(false)
}

    const updateAuthor = async () => {
        let authorArray;
        const authorRef = doc(db, "users", postAuthor)
        const authorSnap = await getDoc(authorRef)
        const data = authorSnap.data()
        if (id !== null) {
            const updatePost = data.posts.map(item => {
                return {...item, comments: item.comments.map((x) => {
                    if (x.commentid === id) {
                        x.content.delta = value
                        x.content.html = newHtml
                        return x
                    } 
                    return x
                })}
            })
            authorArray = updatePost
        } else {
        const updatePost = data.posts.map(item => {
            return {...item, comments: item.comments.map((x) => {
                if (x.commentid === commentId) {
                    x.content.delta = value
                    x.content.html = newHtml
                    return x
                } 
                return x
            })}
        })
        authorArray = updatePost
    }
        await updateDoc(authorRef, {posts: authorArray})
    }
    updateAuthor()

    const getFirebaseComment = async () => {
    if (id !== null) {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setFirebaseCommunityData([data])
        let myPost = data.posts.find( item => item.id === params.id )
        let myComment = myPost.comments.find(item => item.commentid === id)
        setNewPost([myComment])
    } else {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setFirebaseCommunityData([data])
        let myPost = data.posts.find( item => item.id === params.id )
        let myComment = myPost.comments.find(item => item.commentid === commentId)
        setNewPost([myComment])
    }
}
    updateComment().then(() => {
        getFirebaseComment()
    })
    }
}

    const handleDelete = async (e) => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
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

        const updateAuthor = async () => {
            const authorRef = doc(db, "users", postAuthor)
            const userSnap = await getDoc(authorRef)
            const data = userSnap.data()
            let authorArray;
            const deleteComment = () => {
                const updateAuthor = data.posts.map(item => {
                    return {...item, comments: item.comments.filter((x => x.commentid !== e.target.id))}
                })
                authorArray = updateAuthor
            }
            deleteComment()
            await updateDoc(authorRef, {posts: authorArray})
        }

        const getPost = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            let myPost = data.posts.find( item => item.id === params.id )
            setNewPost(myPost.comments)
        }
        updateAuthor().then(() => {
            getPost()
        })
    }

    const handleMobileDelete = async () => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()

        const userRef = doc(db, "users", user.displayName)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        let newArray;
        const deleteComment = () => {
            const updatePost = userData.comments.filter(item => {
                if (item.commentid !== commentId) {
                    return item
                }
            })
            newArray = updatePost
        }
        let filteredArray;
        const deleteFromFirebase = () => {
            const updateComment = data.posts.map(item => {
                return {...item, comments: item.comments.filter((x) => x.commentid !== commentId)}
            })
            filteredArray = updateComment
        }
        deleteComment()
        deleteFromFirebase()
        await updateDoc(docRef, { posts: filteredArray })
        await updateDoc(userRef, { comments: newArray })

        const updateAuthor = async () => {
            const authorRef = doc(db, "users", postAuthor)
            const userSnap = await getDoc(authorRef)
            const data = userSnap.data()
            let authorArray;
            const deleteComment = () => {
                const updateAuthor = data.posts.map(item => {
                    return {...item, comments: item.comments.filter((x => x.commentid !== commentId))}
                })
                authorArray = updateAuthor
            }
            deleteComment()
            await updateDoc(authorRef, {posts: authorArray})
        }
        
        const getPost = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            let myPost = data.posts.find( item => item.id === params.id )
            setNewPost(myPost.comments)
        }
        updateAuthor().then(() => {
            getPost()
        })
        setPopup(false)
    }

    const handleEdit = async (e) => {
        setUpdate(false)
        setEdit(false)
        setDropbar(false)
        setCurrentComment(e.target.id)
        console.log(e.target.id)
    }

    const handleDrop = (e) => {
        if (dropbar) {
            setDropbar(false)
        } else {
            setDropbar(true)
            setCommentId(e.target.id)
        }
    }

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
        if (detail[0].comments.length === 0 ) {
            setIsEmpty(true)
        } else {
            setIsEmpty(false)
        }
    }, [detail])

    useEffect(() => {
        if (!isMobile) {
            if (!edit) {
                if (id !== null) {
                const getComment = async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let myPost = data.posts.find( item => item.id === params.id )
                    let myComment = myPost.comments.find(item => item.commentid === id)
                    const delta = quill.clipboard.convert((myComment.content.html))
                    quill.setContents(delta, 'silent')
                }
                getComment()
            } else {
                const getComment = async () => {
                    const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                    const docSnap = await getDoc(docRef)
                    const data = docSnap.data()
                    let myPost = data.posts.find( item => item.id === params.id )
                    let myComment = myPost.comments.find(item => item.commentid === currentComment)
                    const delta = quill.clipboard.convert((myComment.content.html))
                    quill.setContents(delta, 'silent')
                }
                getComment()
            }
            }
        }
    }, [quill])

    useEffect(() => {
        console.log(isEmpty)
    }, [])

    if (isMobile) {
        if (isEmpty) {
            return (
                <div className="empty-comment">
                     <h3>No Comments Yet</h3>
                     <div>Be the first to share what you think!</div>
                </div>
            )
        } else if (!isEmpty && edit && update) {
            return (
                newPost.map(comment => {
                    return (
                            <div className="comment" key={comment.id}>
                                <div className="comment-left">
                                    <Link to={`../user/${comment.username}`}>
                                        <img src={Avatar} alt="Avatar" />
                                    </Link>
                                    <hr className="vertical"></hr>
                                </div>
                                <div className="comment-right">
                                    <div className="comment-left-username">
                                        <Link to={`../user/${comment.username}`} style={ isLoggedIn ? {color: "black"} : {color: "white"}}>{comment.username}</Link>
                                    </div>
                                    <div className="comment-right-text">{parse(comment.content.html)}</div>
                                    <ul>
                                        <div className="comment-votes">
                                            <img src={isLoggedIn ? Up : WhiteUp} alt="Up arrow"></img>
                                                {comment.votes}
                                            <img src={isLoggedIn ? Down : WhiteDown} alt="Down arrow"></img>
                                        </div>
                                        <li>
                                            <div style={isLoggedIn ? {color: "grey"} : {color: "rgb(204, 202, 202)"}}>
                                                <img src={isLoggedIn ? CommentIcon : WhiteComment} alt="Comment bubble"/> 
                                                    Reply
                                            </div>
                                        </li>
                                        <li>
                                            <div style={isLoggedIn ? {color: "grey"} : {color: "rgb(204, 202, 202)"}}>
                                                Share
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                    )
                }
            )
        )
        } else if (!isEmpty && !edit && !update && isLoggedIn ) {
            return (
                <div className="comment">
                    <CommentEditorMobile html={html} setHtml={setHtml} value={value} setValue={setValue} id={id}
                        handleSubmit={handleSubmit} empty={empty} setEmpty={setEmpty} edit={edit} setEdit={setEdit} 
                        currentComment={currentComment} setUpdate={setUpdate} commentId={commentId} update={update}
                        />
                </div>
            ) 
        } else {
        return (
            detail.map(data => {
                return (
                    data.comments.map(comment => {
                        return (
                            <div className="comment" style={ isLoggedIn ? { paddingTop: "0em"} : {}} key={comment.id}>
                                <DeletePopupComment popup={popup} setPopup={setPopup} isMobile={isMobile} handleMobileDelete={handleMobileDelete} 
                                />
                                <div className="comment-left">
                                    <Link to={`../user/${comment.username}`}>
                                        <img src={Avatar} alt="Avatar" />
                                    </Link>
                                    <hr className="vertical"></hr>
                                </div>
                                <div className="comment-right" style={{width: "80%"}}>
                                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                    <div className="comment-left-username">
                                        <Link to={`../user/${comment.username}`} style={ isLoggedIn ? {color: "black"} : {color: "white"}}>{comment.username}</Link>
                                    </div>
                                    <div className={ comment.username === currentUser  ? "user-left" : "input-empty"} id={comment.commentid} 
                                    onClick={handleDrop}>
                                        ...
                                </div>
                                <ModalEdit dropbar={dropbar} setDropbar={setDropbar} comment={comment} data={data} commentId={commentId} 
                                        setCommentId={setCommentId} handleEdit={handleEdit} currentUser={currentUser} 
                                        setPopup={setPopup} popup={popup} />
                                </div>
                                    <div>
                                        {parse(comment.content.html)}
                                    </div>
                                    <ul>
                                        <div className="comment-votes" style={ isLoggedIn ? {color: "grey"} : {color: "white"}}>
                                            <img src={isLoggedIn ? Up : WhiteUp} alt="Up arrow"></img>
                                                {comment.votes}
                                            <img src={ isLoggedIn ? Down : WhiteDown} alt="Down arrow"></img>
                                        </div>
                                        <li>
                                            <div style={ isLoggedIn ? {color: "grey"} : {color: "rgb(204, 202, 202)"} }>
                                                <img src={ isLoggedIn ? CommentIcon : WhiteComment} alt="Comment bubble"/> 
                                                    Reply
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )
                    })
                )
            })
        )
        }
    } else {
    if (isEmpty) {
        return (
            <div className="empty-comment">
                 <h3>No Comments Yet</h3>
                 <div>Be the first to share what you think!</div>
            </div>
        )
    } else if (!isEmpty && edit && update) {
        return (
            newPost.map(comment => {
                return (
                        <div className="comment" key={comment.id}>
                            <div className="comment-left">
                                <Link to={`../user/${comment.username}`}>
                                    <img src={Avatar} alt="Avatar" />
                                </Link>
                                <hr className="vertical"></hr>
                            </div>
                            <div className="comment-right">
                                <div className="comment-left-username">
                                    <Link to={`../user/${comment.username}`}>{comment.username}</Link>
                                </div>
                                <div className="comment-right-text">{parse(comment.content.html)}</div>
                                <ul>
                                    <div className="comment-votes">
                                        <img src={Up} alt="Up arrow"></img>
                                            {comment.votes}
                                        <img src={Down} alt="Down arrow"></img>
                                    </div>
                                    <li>
                                        <div>
                                            <img src={CommentIcon} alt="Comment bubble"/> 
                                                Reply
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            Share
                                        </div>
                                    </li>
                                    <div className={ comment.username === currentUser ? "post-detail-dropbar-comment" : "input-empty"}>
                                        <ul> 
                                        <li>Save</li>
                                        <li id={comment.commentid} onClick={handleDelete}>Delete</li>
                                    </ul>
                                </div>
                                </ul>
                            </div>
                        </div>
                )
            }
        )
    )
    } else if (!isEmpty && !edit && !update && isLoggedIn ) {
        return (
            <div className="comment">
                <CommentEditor quillRef={quillRef} quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} 
                    handleSubmit={handleSubmit} empty={empty} setEmpty={setEmpty} edit={edit} setEdit={setEdit} />
            </div>
        ) 
    } else {
    return (
        detail.map(data => {
            return (
                data.comments.map(comment => {
                    return (
                        <div className="comment" key={comment.id}>
                            <div className="comment-left">
                                <Link to={`../user/${comment.username}`}>
                                    <img src={Avatar} alt="Avatar" />
                                </Link>
                                <hr className="vertical"></hr>
                            </div>
                            <div className="comment-right">
                                <div className="comment-left-username">
                                    <Link to={`../user/${comment.username}`}>{comment.username}</Link>
                                </div>
                                <div>
                                    {parse(comment.content.html)}
                                </div>
                                <ul>
                                    <div className="comment-votes">
                                        <img src={Up} alt="Up arrow"></img>
                                            {comment.votes}
                                        <img src={Down} alt="Down arrow"></img>
                                    </div>
                                    <li>
                                        <div>
                                            <img src={CommentIcon} alt="Comment bubble"/> 
                                                Reply
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            Share
                                        </div>
                                    </li>
                                        <div className={ comment.username === currentUser ? "post-detail-dropbar-comment" : "input-empty"}>
                                        <ul> 
                                        <li>Save</li>
                                        <li id={comment.commentid} onClick={handleEdit}>
                                            Edit
                                        </li>
                                        <li id={comment.commentid} onClick={handleDelete}>Delete</li>
                                        </ul>
                                        </div>
                                </ul>
                            </div>
                        </div>
                    )
                })
            )
        })
    )
}
}
}

export default Comment