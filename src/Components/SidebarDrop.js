import React from "react";

const SidebarDrop = ( {item, x} ) => {

    if (item.drop === true) {
        return (
            <div className="side-bar-dropbox-true-home">
                <div className="side-bar-dropbox-list">
                    {x}
                </div>
            </div>
        )
    }
}

export default SidebarDrop