import React from "react";
import { auth } from "../firebase-config";

const Policy = () => {
    const user = auth.currentUser

        return (
            <div className={ user ? "policy-section-true" : "policy-section"}>
                <div className="policy-top">
                    <div className="policy-left">
                        <ul>
                            <li>
                                User Agreement
                            </li>
                            <li>
                                Privacy Policy
                            </li>
                        </ul>
                    </div>
                    <div className="policy-right">
                        <ul>
                            <li>
                                Content Policy
                            </li>
                            <li>
                                Moderator Code of Conduct
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={ user ? "policy-bar-divider-true" : "policy-bar-divider"}></div>
                    <div className="policy-bottom">
                    <p>Freddit Inc 2023. All rights reserved </p>
                </div>
            </div>
        )
}

export default Policy