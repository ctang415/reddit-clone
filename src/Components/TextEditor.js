import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TextEditor = ( {setValue, value, setHtml, html, quill, quillRef, handleSubmit} ) => {
    const location = useLocation()

    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
            console.log(quill.getText()); // Get text only
            setValue(JSON.stringify(quill.getContents()))
            console.log(quill.getContents()); // Get delta contents
            console.log(quill.root.innerHTML); // Get innerHTML using quill
            console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
            });
        }
    }, [quill]);

    if (location.pathname.indexOf('/comments/') !== -1 ) {
        return (
            <div id='editor-container-comment'>
                <div>
                    <button class="ql-bold"></button>
                    <button class="ql-italic"></button>
                    <button class="ql-link"></button>
                    <button class="ql-strike"></button>
                    <button class="ql-script" value="super"></button>
                    <button class="ql-header" value="2"></button>
                    <button class="ql-list" value="bullet"></button>
                    <button class="ql-list" value="ordered"></button>
                    <button class="ql-blockquote"></button>
                    <button class="ql-code"></button>
                    <button id="custom-button" onClick={handleSubmit}>Comment</button>
                </div>
                <div ref={quillRef} />
            </div>
        )
    } else {
        return (
            <div id='editor-container'>
            <div ref={quillRef} />
        </div>
        )
    }
}

export default TextEditor
