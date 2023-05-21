import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";

const DeletePopup = ( {popup, setPopup} ) => {
    const params = useParams()
    const user = auth.currentUser
    const location = useLocation()

    const handleModal = () => {
        setPopup(false)
    }

    const handleDelete = async (e) => {
        const docRef = doc(db, "communities", location.pathname.split('/comments')[0].split('f/')[1])
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()

        const userRef = doc(db, "users", user.displayName)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()

        let newArray;
        const deletePost = () => {
            const updatePost = userData.posts.map(item => {
                if (item.id !== params.id) {
                    return item
                } else {
                    item.author = '[deleted]'
                    item.content.delta = '{"ops":[{"insert":"Sorry, this post was deleted by the person who originally posted it.\n"}]}'
                    item.content.html = '<p>Sorry, this post was deleted by the person who originally posted it.</p>'
                    return item
                }
            })
            newArray = updatePost
        }
        let filteredArray;
        const deleteFromFirebase = () => {
            const updateComment = data.posts.map(item => {
                if (item.id !== params.id) {
                    return item
                } else {
                    item.author = '[deleted]'
                    item.content.delta = '{"ops":[{"insert":"Sorry, this post was deleted by the person who originally posted it.\n"}]}'
                    item.content.html = '<p>Sorry, this post was deleted by the person who originally posted it.</p>'
                    return item
                }
            })
            filteredArray = updateComment
        }

        deletePost()
        deleteFromFirebase()
        
        await updateDoc(docRef, { posts: filteredArray })
        await updateDoc(userRef, { posts: newArray })
    }


    if (popup) {
    return (
        <div className="modal-community">
        <div>
            <div className="delete-popup">
                <div>
                    <div className="modal-close-community-div">
                        <div className="delete-header">
                           Delete post?
                        </div>
                        <div id="delete-close-button">
                            <div onClick={handleModal}>X</div>
                        </div>
                    </div>
                    <span className="modal-divider-text-community"></span>
                </div>
                <div className="delete-name">
                Are you sure you want to delete your post? You can't undo this.
                </div>
                <div className="popup-buttons">
                        <button className="community-cancel-button" onClick={handleModal}>
                            Cancel
                        </button>
                        <button className="community-create-button" onClick={handleDelete}>
                            Delete post
                        </button>
                </div>
            </div>
        </div>
    </div>
    )
    }
}

export default DeletePopup