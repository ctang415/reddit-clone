import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ImageCompress from 'quill-image-compress';
import { Quill } from "react-quill";
import MagicUrl from 'quill-magic-url'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import { useQuill } from "react-quilljs";
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';
import { nanoid } from 'nanoid'
Quill.register('modules/imageCompress', ImageCompress);
Quill.register('modules/magicUrl', MagicUrl)

const MobileEditor = ( {setValue, value, setHtml, html, empty, setEmpty, setTextDrop, firebaseCommunityData, 
    detail, setDetail, postAuthor } ) => {
    const [ isSubmit, setIsSubmit ] = useState(false)
    const location = useLocation()
    const params = useParams()
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
    const formats = []
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats});

    const handleClose = () => {
        setTextDrop(false) 
        setValue('')
        quill.setContents('')
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
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'link', 'a' ]), 
            allowedAttributes: {'img': ['src'], 'a' : ['href', 'name', 'target'], 'link': [ 'href','rel','type' ]},
            allowedSchemes: [ 'data', 'http', 'https', 'ftp', 'mailto', 'tel'],
            allowedSchemesByTag: {},
            allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
        })
        let newid = nanoid(5)
        const uploadComment = async () => {
                const docRef = doc(db, "communities", firebaseCommunityData[0].name)
                const authorRef = doc(db, "users", postAuthor)
                const userSnap = await getDoc(authorRef)
                const data = userSnap.data()
                let newArray;
                let authorArray;
                const createComment = () => {
                    const updatePost = firebaseCommunityData[0].posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { commentid: newid, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    newArray = updatePost
                    const updateAuthor = data.posts.map(item => {
                        if (item.id === params.id) {
                            item.comments = [...item.comments, { commentid: newid, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate }]
                            return item
                        }
                        return item
                    })
                    authorArray = updateAuthor
                }
                createComment()
                await updateDoc(docRef, {posts: newArray })
                await updateDoc(authorRef, {posts: authorArray})
            }
        uploadComment()
        const updateComment = async () => {
            const userRef = doc(db, "users", user.displayName)
            await updateDoc(userRef, {comments: arrayUnion({ commentid: newid, poster: false, content: { html: newHtml, delta: value }, title: detail[0].title, community: firebaseCommunityData[0].name, author: detail[0].author, username: user.displayName, id: params.id, voters:[ {username: user.displayName, vote: "upvote" } ], votes: 1, date: myDate })})
        }
        updateComment().then(() => {
        setDetail([firebaseCommunityData[0].posts.find( item => item.id === params.id)])
    })
        quill.setContents([])
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
        if (location.pathname === "/submit") {
            setIsSubmit(true)
        }
    }, [isSubmit]) 

        return (
            <div id='editor-container-two'>
            <div ref={quillRef} />
            <div className={'editor-container-two-button'} style={ {justifyContent: "center"}}>
                <div className={ isSubmit ? "input-empty" : 'user-left' }>
            <button id={"custom-button"} style={ {backgroundColor: "white", color: "grey", border: "none"}} onClick={handleClose}>X</button>
            <button id={ empty ? "custom-button-black" : "custom-button"} style={ {width: "100%"}} onClick={handleSubmit}> Add Comment</button>
            </div>
            </div>
        </div>
        )
    }

export default MobileEditor
