import React, { useEffect, useState } from "react";
import DeletePopup from "./DeletePopup";
import Delete from "../Assets/delete.png"
import Edit from "../Assets/edit.png"

const ModalEdit = ( {dropbar, setDropbar, data, comment, handleEdit, currentUser, setPopup, popup }) => {
    const handleModal = () => {
        setDropbar(false)
    }

    const handleDeletePopUp = () => {
        setPopup(true)
    }
    
    if (dropbar) {
        return (
            <div className="modal-community">
            <div>
                <div className="delete-popup" style={{ width: "80%", borderRadius: "0em"}}>
                    <div>
                        <div className="modal-close-community-div">
                            <div id="delete-close-button">
                                <div onClick={handleModal}>X</div>
                            </div>
                        </div>
                        <ul> 
                        <li className={ comment.username  === currentUser ? "user-left" : 'input-empty'} 
                                onClick={handleEdit}>
                                    <img src={Edit} alt="Edit icon" ></img>Edit Post
                                </li>
                                <li className={ comment.username  === currentUser ? "user-left" : 'input-empty'}
                                onClick={handleDeletePopUp}>
                                    <img src={Delete} alt="Delete icon"></img>
                                    Delete
                                </li>
                            </ul>
                    </div>
                </div>
            </div>
        </div>
        )
        }
}
export default ModalEdit