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
Quill.register('modules/magicUrl', MagicUrl)


const PostDetailsCard = () => {
    const modules = {
        toolbar: [
            ['bold', 'italic', 'link', 'strike', { 'script': 'super' }],
            [ {header: 2},  { 'list': 'bullet'}, { 'list': 'ordered' }, 'blockquote', 'code' ],
            ],
            magicUrl: true, 
    }
    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'script', 'blockquote', 'code']
    const placeholder = 'Text (Optional)'
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats, placeholder});

    return (
        <div className="post-detail">
            <div>
            <div className="post-detail-left">
                <div className="post-detail-votes">
                    <img src={Up} alt="Up arrow"></img>
                        1
                    <img src={Down} alt="Down arrow"></img>
                </div>
            </div>
            <div className="post-detail-right">
                <p className="post-pinned-author">Posted by u/AUTHOR</p>
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
                <TextEditor quillRef={quillRef} quill={quill} />
            </div>
            </div>
            <Comment/>
    </div>
    )
}

export default PostDetailsCard