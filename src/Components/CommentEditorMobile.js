import React, { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { useLocation, useParams } from 'react-router-dom';
import { Quill } from "react-quill";
import MagicUrl from 'quill-magic-url'
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';
Quill.register('modules/magicUrl', MagicUrl)

const CommentEditorMobile = ( {setValue, value, setHtml, html, handleSubmit, empty, setEmpty, edit, setEdit, id, 
    currentComment, commentId, setUpdate, update } ) => {
    const location = useLocation()
    const params = useParams()

    const modules = {
        toolbar: '#editor-container-three',
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

    const handleClose = () => {
        setEdit(true)
        setValue('')
        quill.setContents('')
    }

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

    useEffect(() => {
        if (!edit) {
            if (id !== null) {
            const getComment = async () => {
                const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
                const docSnap = await getDoc(docRef)
                const data = docSnap.data()
                let myPost = data.posts.find( item => item.id === params.id )
                let myComment = myPost.comments.find(item => item.commentid === id)
                const delta = quill.clipboard.convert((myComment.content.html))
                quill.setContents(delta, 'silent')
            }
            getComment()
        } else {
            const getComment = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            let myPost = data.posts.find( item => item.id === params.id )
            let myComment = myPost.comments.find(item => item.commentid === commentId)
            const delta = quill.clipboard.convert((myComment.content.html))
            quill.setContents(delta)
            }
            getComment()
    }
}
    }, [quill])

    return (
        <div id='editor-container-three' style={{display: "flex", flexDirection: "column-reverse"}}>
            <div style={{display: "flex", justifyContent: "flex-end", padding: "0.5em"}}>
                <button id={"custom-button"} style={ {backgroundColor: "white", color: "grey", border: "none"}} onClick={handleClose}>Cancel</button>
                <button id={ empty ? "custom-button-black" : "custom-button"} onClick={handleSubmit}>Update</button>
            </div>
            <div ref={quillRef} />
        </div>
    )
}

export default CommentEditorMobile