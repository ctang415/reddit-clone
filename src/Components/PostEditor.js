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

const PostEditor = ( {postEdit, setPostValue, postValue, setPostHtml, postHtml, postEmpty, setDetail,
    setPostEmpty, editId, setFirebaseCommunityData, setPostEdit} ) => {
    const location = useLocation()
    const user = auth.currentUser

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
    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'image', 'video', 'script', 'blockquote', 'code']
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats});

    const handleSubmit = () => {
        let parsedValue = JSON.parse(postValue)
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
        const updatePost = async () => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const userRef = doc(db, "users", user.displayName)
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        let newArray;

        const editPost = () => {
            const updatePost = data.posts.map(item => {
                if (item.id === editId) {
                    item.content.delta = postValue
                    item.content.html = newHtml
                    return item
                } 
                    return item
                })
            newArray = updatePost
        }
        editPost()

        let array;
        const editComment = () => {
            const update = userData.posts.map( item => {
                if (item.id === editId) {
                    item.content.delta = postValue
                    item.content.html = newHtml
                    return item
                }
                return item
            })
            array = update
        }
        editComment()

    await updateDoc(docRef, {posts: newArray })
    await updateDoc(userRef, {posts: array} )
    }

    const getFirebasePost = async () => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
        setFirebaseCommunityData([data])
    }
    updatePost().then(()=> {
        getFirebasePost()
    })
    setPostEdit(false)
 }
 
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
            console.log(quill.getText()); // Get text only
            setPostValue(JSON.stringify(quill.getContents()))
            console.log(quill.getContents()); // Get delta contents
            console.log(quill.root.innerHTML); // Get innerHTML using quill
            console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
            });
        }
    }, [quill]);

    useEffect(() => {
        if (postEdit) {
        const getPost = async () => {
            const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            let myPost = data.posts.find( item => item.id === editId )
            const delta = quill.clipboard.convert((myPost.content.html))
            quill.setContents(delta, 'silent')
        }
        getPost()
    }
    }, [postEdit])

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
                    <button className='ql-image'></button>
                </div> 
            <div ref={quillRef} />
            <div className='editor-container-two-button'>
            <button id={ postEmpty ? "custom-button-black" : "custom-button"} onClick={handleSubmit}>Save</button>
            </div>
        </div>
        )
    }

export default PostEditor
