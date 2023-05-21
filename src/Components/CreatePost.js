import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import TextEditor from "./TextEditor";
import MagicUrl from 'quill-magic-url'
import { Quill } from "react-quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as sanitizeHtml from 'sanitize-html';
import { nanoid } from 'nanoid'
import ImageCompress from 'quill-image-compress';

Quill.register('modules/magicUrl', MagicUrl)
Quill.register('modules/imageCompress', ImageCompress);


const CreatePost = ( {communityModal, setCommunityModal, setDrop, drop }) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ isUndefined, setIsUndefined ] = useState(false)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ postSelect, setPostSelect ] = useState(true)
    const [ imageSelect, setImageSelect ] = useState(false)
    const [ linkSelect, setLinkSelect ] = useState(false)
    const [ pollSelect, setPollSelect ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        console.log(location.pathname)
        console.log(params.id)
    }, [])

    const user = auth.currentUser;
    const modules = {
        toolbar: [
            ['bold', 'italic', 'link', 'strike', { 'script': 'super' }],
            [ {header: 2},  { 'list': 'bullet'}, { 'list': 'ordered' }, 'blockquote', 'code' ],
            [ 'image', 'video']
            ],
            magicUrl: true,
            imageCompress: {
                quality: 0.7, // default
                maxWidth: 1000, // default
                maxHeight: 1000, // default
                imageType: 'image/jpeg', // default
                debug: true, // default
                suppressErrorLogging: false, // default
                insertIntoEditor: undefined, // default
            }
    }
    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'image', 'video', 'script', 'blockquote', 'code']
    const placeholder = 'Text (Optional)'
    const theme =  'snow'
    const { quill, quillRef } = useQuill({theme, modules, formats, placeholder});

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
        const uploadPost = async () => {
            if (params.id !== undefined ) {
                const docRef = doc(db, "communities", params.id)
                let id = nanoid(8)
                await updateDoc(docRef, {posts: arrayUnion({title: title, content: { html: newHtml, delta: value }, author: user.displayName, community: params.id, id: id, votes: 1, date: myDate, comments: []}) })
                const userRef = doc(db, "users", user.displayName)
                await updateDoc(userRef, {posts:  arrayUnion({community: params.id, poster: true, title: title, content: { html: newHtml, delta: value }, author: user.displayName, id: id, votes: 1, date: myDate, comments: []})})
                navigate(`../f/${params.id}/comments/${id}`)
            } else {
                console.log('PLEASE SELECT A COMMUNITY')
            }
            console.log(params.id)
        }
        uploadPost()
    }
    
    const handlePost = () => {
        setPostSelect(true)
        setImageSelect(false)
        setLinkSelect(false)
        setPollSelect(false)
    }

    const handleImage = () => {
        setPostSelect(false)
        setImageSelect(true)
        setLinkSelect(false)
        setPollSelect(false)
    }

    const handleLink = () => {
        setPostSelect(false)
        setImageSelect(false)
        setLinkSelect(true)
        setPollSelect(false)
    }

    const handlePoll = () => {
        setPostSelect(false)
        setImageSelect(false)
        setLinkSelect(false)
        setPollSelect(true)
    }

    useEffect (() => {
        if (params.id !== undefined) {
            const getCommunity = async () => {
            const docRef = doc(db, "communities", params.id)
            const docSnap = await getDoc(docRef);
            const data = docSnap.data()
            setFirebaseCommunityData([data])
            }
        getCommunity()
        } else {
            setIsUndefined(true)
        }
    }, [])

    useEffect(() => {
        if (!user) {
            navigate('/')
        } 
    }, [user])

    if (user) {
        return (
        <div className="community-page">
        <div className="community-body-submit">
            <div className="community-body-left">
                <div className="community-post-header">
                    <div>
                        Create a post
                    </div>
                    <div id="community-draft">
                        DRAFTS 
                        <div>0</div>
                    </div>
                </div>
                <div className="community-header-divider"></div>
                <div className="community-search">
                    <input type="text" defaultValue={`f/${params.id}`}></input>
                </div>
                <div className="community-post">
                    <form onSubmit={handleSubmit}>
                    <div className="community-post-options">
                        <ul>
                            <li onClick={handlePost}>
                                Post
                            </li>
                            <li onClick={handleImage}>
                                Image & Video
                            </li>
                            <li onClick={handleLink}>
                                Link
                            </li>
                            <li onClick={handlePoll}>
                                Poll
                            </li>
                        </ul>
                    </div>
                    <div className="community-post-section">
                    <div className="community-post-title">
                        <input type="text" id="community-post-inputs" maxLength="300" placeholder="Title" onChange={ (e) => setTitle(e.target.value)} required></input>
                        <div className={ imageSelect ? "editor-container-image" : "input-empty"}>
                            <label htmlFor="files" className="btn">Upload</label>
                            <input id="files" type="file"/>
                            <div>*Please use Post option*</div>
                        </div>
                        <div className={ linkSelect ? "editor-container-link" : "input-empty"}>
                            <input type="url" placeholder="Url" name="url"></input>
                            <div>*Please use Post option*</div>
                        </div>
                        <div className={ postSelect || pollSelect ? "editor-container" : "input-empty"}>
                        <TextEditor 
                        quillRef={quillRef}
                        quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} />
                            <div className={ pollSelect ? "inputs-poll-section" : 'input-empty'}>
                                <div className="inputs-poll">
                                    <input type="text" placeholder="Option 1"></input>
                                    <input type="text" placeholder="Option 2"></input>
                                </div>
                                <div className="inputs-poll-tips">
                                    <ol>
                                        <h6>Tips on Better Polls</h6>
                                        <li>
                                            <p>Suggest short clear options</p>
                                        </li>
                                        <li>
                                            <p>The more options, the better</p>
                                        </li>
                                        <li>
                                            <p>Choose the poll duration</p>
                                        </li>
                                        <li>
                                            <p>Options can't be edited after post creation</p>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div className="community-post-button-section">
                    <div className="community-post-divider"></div>
                        <div className="community-post-buttons">
                        <button id="community-save-button">Save Draft</button>
                        <button id={ isUndefined || !postSelect ? "community-post-button-black" : "community-post-button"}>Post</button>
                        </div>
                    </div>
                    </div>
                    <div className="community-post-bottom">
                    </div>
                    </form>
                </div>
            </div>
            <div className="community-body-right">
            <CommunityInformation 
            firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} 
            communityModal={communityModal} setCommunityModal={setCommunityModal} setDrop={setDrop} drop={drop}
            />
            </div>
        </div>
    </div>
    )
    }
}

export default CreatePost