import React, { useEffect, useState } from 'react';

const TextEditor = ( {setValue, value, setHtml, html, quill, quillRef} ) => {

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

    return (
        <div id='editor-container'>
            <div ref={quillRef} />
        </div>
    )
}

export default TextEditor
