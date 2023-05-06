import React, { useEffect, useState } from "react";
import Up from "../Assets/up.png"
import Down from "../Assets/down.png"
import CommentIcon from "../Assets/comment.png"
import Share from "../Assets/share.png"
import Save from "../Assets/save.png"
import TextEditor from "./TextEditor";
import MagicUrl from 'quill-magic-url'
import Comment from "./Comment";
import { Quill } from "react-quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import { useQuill } from "react-quilljs";
import { Link, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import parse from 'html-react-parser';

Quill.register('modules/magicUrl', MagicUrl)

const PostDetailsCard = ( {firebaseCommunityData}  ) => {
    const [ drop, setDrop ] = useState(false)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ value, setValue ] = useState('')
    const [ detail, setDetail ] = useState([ { content: {html: '' }, votes: 'unknown',  comments: []  } ])
    const [ html, setHtml ] = useState('')
    const [ empty, setEmpty ] = useState(true)
    const [ newPosts, setNewPosts ] = useState([])
    const params = useParams()
    const user = auth.currentUser

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
                const docRef = doc(db, "communities", firebaseCommunityData[0].name)

                const userRef = doc(db, "users", user.displayName)
                let newArray;
                const createComment = () => {
                    const updatePost = firebaseCommunityData[0].posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    newArray = updatePost
                }
                createComment()
                await updateDoc(docRef, {posts: newArray })
                await updateDoc(userRef, {comments:  arrayUnion({ poster: false, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, id: params.id, votes: 1, date: myDate })})
            }
        uploadComment()
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
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user])

    useEffect(() => {
        if (firebaseCommunityData[0] !== undefined) { 
            setDetail([firebaseCommunityData[0].posts.find( item => item.id === params.id)])
        }
        console.log(detail[0].comments)
    }, [firebaseCommunityData])

    useEffect(() => {

    }, [handleSubmit])

    if (detail !== undefined) {
    return (
        detail.map( data => {
            return (
        <div className="post-detail">
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
                        <Link to={`../user/${data.author}`}><span> u/{data.author}</span></Link>
                    </div>
                    <h3>
                        {data.title}
                    </h3>
                    <div className="post-detail-media-true">
                        {parse(data.content.html)} 
                    </div> 
                    <ul>
                        <div>
                            <img src={CommentIcon} alt="Comment bubble"/> { data.comments.length } Comments
                        </div>
                        <li><img src={Share} alt="Share button" /> Share</li>
                        <li><img src={Save} alt="Save button" /> Save</li>
                        <li>...</li>
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
                <Comment detail={detail} />
            </div>
        </div>
            )
        })
    )
}
}

export default PostDetailsCard