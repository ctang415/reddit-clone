import React, { useEffect, useState } from "react";
import CommentIcon from "../Assets/comment.png"
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import Avatar from "../Assets/avatar.png"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';
import { useQuill } from "react-quilljs";
import CommentEditor from "./CommentEditor";
import MagicUrl from 'quill-magic-url'
import { Quill } from "react-quill";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

Quill.register('modules/magicUrl', MagicUrl)

const Comment = ( {detail, edit, id, setEdit, isLoggedIn, isEmpty, setIsEmpty, setDetail, 
    setFirebaseCommunityData, firebaseCommunityData, currentUser } ) => {
    const [ update, setUpdate ] = useState(false)
    const [ newPost, setNewPost ] = useState([])
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ empty, setEmpty ] = useState(true)
    const [ currentComment, setCurrentComment ] = useState('')
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
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
            allowProtocolRelative: true,
            enforceHtmlBoundary: false,
            parseStyleAttributes: true
        })
        console.log(newHtml)

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

        const getPost = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            let myPost = data.posts.find( item => item.id === params.id )
            setNewPost(myPost.comments)
        }
        getPost()
    }

    const handleEdit = async (e) => {
        setUpdate(false)
        setEdit(false)
        setCurrentComment(e.target.id)
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
        if (!edit) {
            if (id !== null) {
            const getComment = async () => {
                const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                const docSnap = await getDoc(docRef)
                const data = docSnap.data()
                let myPost = data.posts.find( item => item.id === params.id )
                let myComment = myPost.comments.find(item => item.commentid === id)
                console.log(myComment)
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
    }, [quill])


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

export default Comment