import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const TextEditor = ( {setValue, value, setHtml, html, quill, quillRef, handleSubmit, empty, setEmpty } ) => {
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
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-link"></button>
                    <button className="ql-strike"></button>
                    <button className="ql-script" value="super"></button>
                    <button className="ql-header" value="2"></button>
                    <button className="ql-list" value="bullet"></button>
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-blockquote"></button>
                    <button className="ql-code"></button>
                    <button id={ empty ? "custom-button-black" : "custom-button"} onClick={handleSubmit}>Comment</button>
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
