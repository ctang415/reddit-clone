import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ post, setPost ] = useState([ {title: '', post: '', author: '', votes: 1, date: '', comments: [] }])
    const [ value, setValue ] = useState('');
    const [ image, setImage ] = useState(null)
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
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
        ]
    }

    const createNewPost = () => {
        
    }
/*
    const uploadImage = (e) => {
        getBase64(e.target.files[0]).then(file => setImage({ image: file })) 
    }
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
    })

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
                <div>
                    <input type="text"></input>
                </div>
                <div className="community-post">
                    <form>
                    <div className="community-post-options">
                        <ul>
                            <li onClick={handlePost}>
                                Post
                            </li>
                            <li onClick={handleImage}>
                                Images
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
                        <input type="text" id="community-post-inputs" maxLength="300" placeholder="Title"></input>
                        <div className={ postSelect ? "editor-container": "input-empty" }>
                            <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} >
                            </ReactQuill>
                        </div>
                        <div className={ imageSelect ? "editor-container-image" : "input-empty"}>
                            <label for="files" class="btn">Upload</label>
                            <input id="files" type="file"/>
                        </div>
                        <div className={ linkSelect ? "editor-container-link" : "input-empty"}>
                            <input type="url" placeholder="Url"></input>
                        </div>
                        <div className={ pollSelect ? "editor-container" : "input-empty"}>
                            <ReactQuill theme="snow" modules={modules} value={value} onChange={setValue} >
                            </ReactQuill>
                            <div className="inputs-poll-section">
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
                    <div className="community-post-divider"></div>
         
                    <div className="community-post-buttons">
                        <button id="community-save-button">Save Draft</button>
                        <button id="community-post-button">Post</button>
                    </div>
                    </div>
                    <div className="community-post-bottom">
                    </div>
                    </form>
                </div>
            </div>
            <div className="community-body-right">
            <CommunityInformation firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
            </div>
        </div>
    </div>
    )
    } else {
        return (
            <div>NOTHING</div>
        )
    }
}

export default CreatePost