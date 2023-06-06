import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import ForgotUser from "./ForgotUser";
import Login from "./Login";
import Signup from "./Signup";

const ModalMobile = ( {modalIsTrue, setModalIsTrue, setLoggedIn, loggedIn, join, setJoin, isMobile, click, setClick } ) => {
    const [ login, setLogin ] = useState(true)
    const [ signUp, setSignUp ] = useState(false)
    const [ forgotUser, setForgotUser ] = useState(false)
    const [ forgotPassword, setForgotPassword ] = useState(false)
    const location = useLocation()

    useEffect(() => {
        document.title = 'Freddit - Jump into Anything'
        window.scrollTo({ top:0, behavior:'auto'})
    }, [])

    useEffect( () => {
        if (join === true) {
            setLogin(false)
            setSignUp(true)
        }
    }, [join])


        return (
            <div className="community-page-mobile" style={ location.pathname === "/register" ? {backgroundColor: "white"} : {}}>
                    <Login 
                    setSignUp={setSignUp} setLogin={setLogin} login={login}
                    setForgotUser={setForgotUser} setForgotPassword={setForgotPassword}
                    setModalIsTrue={setModalIsTrue} loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                    isMobile={isMobile} click={click} setClick={setClick}
                    />
                    <Signup
                    setLogin={setLogin} signUp={signUp} setSignUp={setSignUp} 
                    setModalIsTrue={setModalIsTrue}loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                    isMobile={isMobile} click={click} setClick={setClick}
                    />
                    <ForgotUser 
                    setLogin={setLogin} setSignUp={setSignUp}
                    forgotUser={forgotUser} setForgotUser={setForgotUser} 
                    />
                    <ForgotPassword 
                    setLogin={setLogin} setSignUp={setSignUp} setForgotUser={setForgotUser}
                    setForgotPassword={setForgotPassword} forgotPassword={forgotPassword}
                    />
            </div>
        )
}

export default ModalMobile