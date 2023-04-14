import React from "react";
import { doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import CommunityPage from "./CommunityPage";

const Home = () => {
    const getCommunities = async () => {
        const docRef = doc(db, "communities")
        const docSnap = await getDoc(docRef)
        const data = docSnap.data()
    }

    return (
        <div className="body">
            <CommunityPage/>
        </div>
    )
}

export default Home