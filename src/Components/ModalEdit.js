import React from "react";
import Delete from "../Assets/delete.png"
import Edit from "../Assets/edit.png"

const ModalEdit = ( {dropbar, setDropbar, comment, handleEdit, currentUser, setPopup, popup} ) => {
    const handleModal = () => {
        setDropbar(false)
    }

    const handleDeletePopUp = () => {
        setDropbar(false)
        setPopup(true)
    }
    
    if (dropbar) {
        return (
            <div className="modal-community">
                <div>
                    <div className="delete-popup" style={{ width: "80%", borderRadius: "0em", height: "7em"}}>
                        <div>
                            <div className="modal-close-community-div" style={{justifyContent: "flex-end"}}>
                                <div id="delete-close-button" onClick={handleModal}>
                                    X
                                </div>
                            </div>
                            <ul style={{display: "flex", flexDirection: "column", gap: "0.5em"}}> 
                                <li className={ comment.username  === currentUser ? "user-left" : 'input-empty'} 
                                onClick={handleEdit} style={ {alignItems: "center", gap: "0.5em"}}>
                                    <img style={{height: "1.5em"}} src={Edit} alt="Edit icon"/>
                                    <span>
                                        Edit Comment
                                    </span>
                                </li>
                                <li className={ comment.username  === currentUser ? "user-left" : 'input-empty'}
                                onClick={handleDeletePopUp} style={ {alignItems: "center", gap: "0.5em"}}>
                                    <img style={{height: "1.5em"}} src={Delete} alt="Delete icon"/>
                                    <span>
                                        Delete Comment
                                    </span>
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