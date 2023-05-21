import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PostEditor = ( {setPostValue, postValue, setPostHtml, postHtml, quillTwo, quillRefTwo, handleSubmit, postEmpty, setPostEmpty} ) => {
    const location = useLocation()
 
    useEffect(() => {
        if (quillTwo) {
            quillTwo.on('text-change', (delta, oldDelta, source) => {
            console.log(quillTwo.getText()); // Get text only
            setPostValue(JSON.stringify(quillTwo.getContents()))
            console.log(quillTwo.getContents()); // Get delta contents
            console.log(quillTwo.root.innerHTML); // Get innerHTML using quill
            console.log(quillRefTwo.current.firstChild.innerHTML); // Get innerHTML using quillRef
            });
        }
    }, [quillTwo]);

        return (
            <div id='editor-container-two'>
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
                    <button id={ postEmpty ? "custom-button-black" : "custom-button"} onClick={handleSubmit}>Save Edits</button>
                </div> 
            <div ref={quillRefTwo} />
        </div>
        )
    }

export default PostEditor
