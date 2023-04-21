import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import CommunityInformation from "./CommunityInformation";

const CreatePost = () => {
    const [ firebaseCommunityData, setFirebaseCommunityData] = useState([])
    const [ isLoggedIn, setIsLoggedIn ] = useState(false)
    const params = useParams()
    const user = auth.currentUser;

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
    if (user) {
    return (
        <div className="community-page">
        <div className="community-body">
            <div className="community-body-left">
                hello
            </div>
            <div className="community-body-right">
                <CommunityInformation firebaseCommunityData={firebaseCommunityData} setFirebaseCommunityData={setFirebaseCommunityData} />
            </div>
        </div>
    </div>
    )
    } else {
        <div>
            PLEASE LOG IN
        </div>
    }
}

export default CreatePost