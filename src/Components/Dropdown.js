import React from "react";

const Dropdown = ( {item, x} ) => {

    if (item.drop === true) {
        return (
            <div className="dropbox-true-home">
                <div className="dropbox-true-home-list">
                    {x}
                </div>
            </div>
        )
    }
}

export default Dropdown