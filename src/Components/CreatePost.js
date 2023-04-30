import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import TextDisplay from "./TextDisplay";
import TextEditor from "./TextEditor";
import MagicUrl from 'quill-magic-url'
import { Quill } from "react-quill";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import parse from 'html-react-parser';

Quill.register('modules/magicUrl', MagicUrl)

const CreatePost = ( {communityModal, setCommunityModal, setDrop, drop }) => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ post, setPost ] = useState([])
    const [ value, setValue ] = useState('')
    const [ html, setHtml ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ media, setMedia ] = useState(false)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const [ editor, setEditor ] = useState(false)
    const [ postSelect, setPostSelect ] = useState(true)
    const [ imageSelect, setImageSelect ] = useState(false)
    const [ linkSelect, setLinkSelect ] = useState(false)
    const [ pollSelect, setPollSelect ] = useState(false)
    const params = useParams()
    const navigate = useNavigate()
    const user = auth.currentUser;

    const modules = {
        toolbar: [
            ['bold', 'italic', 'link', 'strike', { 'script': 'super' }],
            [ {header: 2},  { 'list': 'bullet'}, { 'list': 'ordered' }, 'blockquote', 'code' ],
            [ 'image', 'video']
            ],
            magicUrl: true,
    }

    const formats = ['bold', 'italic', 'strike', 'list', 'header', 'link', 'image', 'video', 'script', 'blockquote', 'code']
    const placeholder = 'Text (Optional)'
    const theme =  'snow'

    const module = {
        toolbar: [
            ['bold', 'italic', 'link', 'strike', { 'script': 'super' }],
            [ {header: 2},  { 'list': 'bullet'}, { 'list': 'ordered' }, 'blockquote', 'code' ],
            [ 'image', 'video']
            ], 
        readOnly: true,
    }

    const { quill, quillRef } = useQuill({theme, modules, formats, placeholder});
    
    const { quillRead } = useQuill({theme, module, formats, placeholder});




    const handleSubmit = (e) => {
        e.preventDefault()
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const today  = new Date();
        const myDate = today.toLocaleDateString("en-US", options)
        setPost( [ {title: title, content: { html: html, delta: value }, media: { image: '', uploaded: false}, author: user.displayName, votes: 1, date: myDate, comments: []} ] )
        console.log(post)

        let parse = JSON.parse(post[0].content.delta)
        console.log(parse.ops)

        var deltaOps =  [
            {insert: "Hello\n"},
            {insert: "This is colorful", attributes: {color: '#f00'}}
        ];
        
        var cfg = {};
        
        var converter = new QuillDeltaToHtmlConverter(parse.ops, cfg);
        
        var html = converter.convert(); 
        setMedia(html)
        console.log(html)
    }
/* 
    const uploadImage = (e) => {
        getBase64(e.target.files[0]).then(file => setImage({ image: file })) 
    }
         <div className={ postSelect ? "editor-container": "input-empty" }>
                            <ReactQuill 
                            theme="snow" modules={modules} value={value} placeholder={'Text (Optional)'} onChange={ onChange} >
                            </ReactQuill>
                        </div>
*/

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
        }
    }, [])

    useEffect(() => {
        if (!user) {
            navigate('/')
        } 
    }, [user])

    useEffect(() => {
        setTimeout(() => {
            setEditor(true)
        }, 1000);
    }, [])

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
                        </div>
                        <div className={ linkSelect ? "editor-container-link" : "input-empty"}>
                            <input type="url" placeholder="Url" name="url"></input>
                        </div>
                        <div className={ postSelect || pollSelect ? "editor-container" : "input-empty"}>
                        {editor ? <TextEditor 
                        quillRef={quillRef}
                        quill={quill} html={html} setHtml={setHtml} value={value} setValue={setValue} />  : null }
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
                        <button id="community-post-button">Post</button>
                        </div>
                    </div>
                    </div>
                    <div className="community-post-bottom">
                    </div>
                    </form>
                </div>
            </div>

            {post.map(item => {
                return (
                    <div className="ql-editor" >
                        {item.title}
                        {item.content.delta}
                    </div>
                )
            })}

        {parse(`${media}`)}
   
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