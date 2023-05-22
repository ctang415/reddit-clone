import React, { useEffect, useState } from "react";
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
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
import { Link, useLocation, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import parse from 'html-react-parser';
import { nanoid } from 'nanoid'
import Delete from "../Assets/delete.png"
import Edit from "../Assets/edit.png"
import ImageCompress from 'quill-image-compress';
import DeletePopup from "./DeletePopup";
Quill.register('modules/imageCompress', ImageCompress);
Quill.register('modules/magicUrl', MagicUrl)

const PostDetailsCard = ( {firebaseCommunityData, setFirebaseCommunityData, detail, setDetail}  ) => {
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
    const [ deleted, setDeleted ] = useState('[deleted]') 
    const location = useLocation()
    const params = useParams()
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
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]), 
            allowedAttributes: {'img': ['src']},
            allowedSchemes: [ 'data', 'http', 'https']
        })
        const uploadComment = async () => {
            let newid = nanoid(5)
                const docRef = doc(db, "communities", firebaseCommunityData[0].name)
                const userRef = doc(db, "users", user.displayName)
                let newArray;
                const createComment = () => {
                    const updatePost = firebaseCommunityData[0].posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { commentid: newid, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    newArray = updatePost
                }
                createComment()
                await updateDoc(docRef, {posts: newArray })
                await updateDoc(userRef, {comments:  arrayUnion({ commentid: newid, poster: false, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, id: params.id, votes: 1, date: myDate })})
            }
        uploadComment()
        setDetail([firebaseCommunityData[0].posts.find( item => item.id === params.id)])
        quill.setContents([])
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
        console.log(id)
    }, [])


    return (
        detail.map( data => {
            return (
        <div className="post-detail" key={data.id}>
            <DeletePopup popup={popup} setPopup={setPopup}/>
            <div className="post-detail-upper">
                <div className="post-detail-left">
                    <div className="post-detail-votes">
                        <img src={Up} alt="Up arrow"></img>
                            {data.votes}
                        <img src={Down} alt="Down arrow"></img>
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
                                    <img src={Delete} alt="Delete icon"></img>Delete
                                </li>
                            </ul>
                        </div>
                    </ul>
                </div>
            </div>
            <div className="post-detail-lower">
                <div className={ isLoggedIn ? "user-left" : "input-empty" }>
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

export default PostDetailsCard