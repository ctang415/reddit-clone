import React, { useEffect, useState } from "react";
import CommentIcon from "../Assets/comment.png"
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
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

Quill.register('modules/magicUrl', MagicUrl)

const Comment = ( {detail, edit, id, setEdit, isLoggedIn } ) => {
    const [ update, setUpdate ] = useState(false)
    const [ newPost, setNewPost ] = useState([])
    const [ isEmpty, setIsEmpty ] = useState(false)
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ empty, setEmpty ] = useState(true)
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
        let parsedValue = JSON.parse(value)
        console.log(parsedValue.ops)
        let cfg = {};
        let converter = new QuillDeltaToHtmlConverter(parsedValue.ops, cfg);
        let info = converter.convert(); 
        console.log(info)
        let newHtml = sanitizeHtml(info, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]), 
            allowedAttributes: {'img': ['src']},
            allowedSchemes: [ 'data', 'http', 'https']
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
        }
        editPost()

        let array;
        const editComment = () => {
            const update = userData.comments.map( item => {
                if (item.commentid === id) {
                    item.content.delta = value
                    item.content.html = newHtml
                    return item
                }
                return item
            })
            array = update
        }
        editComment()
        await updateDoc(docRef, {posts: newArray })
        await updateDoc(userRef, {comments: array} )
    }
    updateComment()
    setEdit(true)
    setUpdate(true)
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
        if (!edit) {
            const getComment = async () => {
                const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                const docSnap = await getDoc(docRef)
                const data = docSnap.data()
                let myPost = data.posts.find( item => item.id === params.id )
                let myComment = myPost.comments.find(item => item.commentid === id)
                console.log(myComment)
                const delta = quill.clipboard.convert(myComment.content.html)
                quill.setContents(delta, 'silent')
            }
            getComment()
        }
        console.log(edit)
    }, [quill])

    useEffect(() => {
        const getComment = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            let myPost = data.posts.find( item => item.id === params.id )
            let myComment = myPost.comments.find(item => item.commentid === id)
            setNewPost([myComment])
        }
            getComment()
    }, [handleSubmit])

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
                                <div>{parse(comment.content.html)}</div>
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
                                    <li>
                                        <div>
                                            ...
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
                <CommentEditor quillRef={quillRef} quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} 
                    handleSubmit={handleSubmit} empty={empty} setEmpty={setEmpty}/>
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
                                <div>{parse(comment.content.html)}</div>
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
                                    <li>
                                        <div>
                                            ...
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
}

export default Comment