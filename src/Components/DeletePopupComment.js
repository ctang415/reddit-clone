import React from "react";

const DeletePopupComment = ( {popup, setPopup, isMobile, handleMobileDelete} ) => {

    const handleModal = () => {
        setPopup(false)
    }

    if (popup) {
    return (
        <div className="modal-community">
        <div>
            <div className="delete-popup" style={ isMobile ? {height: "5em", width: "80%", margin: "50% auto"} : {width: "30.5em"}}>
                <div className="delete-name">
                Are you sure you want to delete your comment?
                </div>
                <div className="popup-buttons">
                        <button className="community-cancel-button" onClick={handleModal}>
                            Cancel
                        </button>
                        <button className="community-create-button" onClick={handleMobileDelete}>
                            Ok
                        </button>
                </div>
            </div>
        </div>
    </div>
    )
    }
}

export default DeletePopupComment