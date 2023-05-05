import React, { useState } from "react";
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
import { arrayUnion, doc, query, updateDoc, where } from "firebase/firestore";

Quill.register('modules/magicUrl', MagicUrl)

const PostDetailsCard = () => {
    const [ drop, setDrop ] = useState(false)
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
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
            if (params.id !== undefined ) {
                const docRef = doc(db, "communities", params.id)
                console.log(params.id)
                
                await updateDoc(docRef, {posts: arrayUnion({ content: { html: newHtml, delta: value }, votes: 1, date: myDate }) })
                
                const userRef = doc(db, "users", user.displayName)
                await updateDoc(userRef, {comments:  arrayUnion({ poster: false, content: { html: newHtml, delta: value },  votes: 1, date: myDate })})
            } else {
                console.log('PLEASE SELECT A COMMUNITY')
            }
        }
        console.log(params.id)
    }

    return (
        <div className="post-detail">
            <div className="post-detail-upper">
                <div className="post-detail-left">
                    <div className="post-detail-votes">
                        <img src={Up} alt="Up arrow"></img>
                            1
                        <img src={Down} alt="Down arrow"></img>
                    </div>
                </div>
                <div className="post-detail-right">
                    <div className="post-detail-pinned-author">Posted by 
                        <Link to=""><span> u/AUTHOR</span></Link>
                    </div>
                    <h3>
                        TITLE
                    </h3>
                    <div className="post-detail-media-true">
                        CONTENT
                    </div>
                    <ul>
                        <div><img src={CommentIcon} alt="Comment bubble"/> # Comments</div>
                        <li><img src={Share} alt="Share button" /> Share</li>
                        <li><img src={Save} alt="Save button" /> Save</li>
                        <li>...</li>
                    </ul>
                </div>
            </div>
            <div className="post-detail-lower">
                <div>
                    <TextEditor 
                    quillRef={quillRef} quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} 
                    handleSubmit={handleSubmit}
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
                <Comment/>
            </div>
        </div>
    )
}

export default PostDetailsCard