import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ImageCompress from 'quill-image-compress';
import { Quill } from "react-quill";
import MagicUrl from 'quill-magic-url'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import { useQuill } from "react-quilljs";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
Quill.register('modules/imageCompress', ImageCompress);
Quill.register('modules/magicUrl', MagicUrl)

const MobileEditor = ( {setValue, value, setHtml, html, handleSubmit, empty, setEmpty, setTextDrop} ) => {

    const modules = {
        toolbar: '#editor-container-two',
            magicUrl: true,
            imageCompress: {
                quality: 0.7, // default
                maxWidth: 550, // default
                maxHeight: 700, // default
                imageType: 'image/jpeg', // default
                debug: true, // default
                suppressErrorLogging: false, // default
                insertIntoEditor: undefined, // default
            }
    }
    const formats = []
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats});

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
            <div id='editor-container-two'>
            <div ref={quillRef} />
            <div className='editor-container-two-button' style={ {justifyContent: "center"}}>
            <button id={"custom-button"} style={ {backgroundColor: "white", color: "grey", border: "none"}} onClick={() => setTextDrop(false)}>X</button>
            <button id={ empty ? "custom-button-black" : "custom-button"} style={ {width: "100%" }} onClick={handleSubmit}> Add Comment</button>
            </div>
        </div>
        )
    }

export default MobileEditor
