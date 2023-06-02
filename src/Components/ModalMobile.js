import React, { useEffect, useState } from "react";
import ForgotPassword from "./ForgotPassword";
import ForgotUser from "./ForgotUser";
import Login from "./Login";
import Signup from "./Signup";

const ModalMobile = ( {modalIsTrue, setModalIsTrue, setLoggedIn, loggedIn, join, setJoin } ) => {
    const [ login, setLogin ] = useState(true)
    const [ signUp, setSignUp ] = useState(false)
    const [ forgotUser, setForgotUser ] = useState(false)
    const [ forgotPassword, setForgotPassword ] = useState(false)

    const closeModal = (e) => {
        setModalIsTrue(false)
        setLogin(true)
        setSignUp(false)
        setForgotUser(false)
        setForgotUser(false)
        setJoin(false)
    }

    useEffect( () => {
        if (join === true) {
            setLogin(false)
            setSignUp(true)
        }
    }, [join])

        return (
            <div className="community-page-mobile">
                    <Login 
                    setSignUp={setSignUp} setLogin={setLogin} login={login}
                    setForgotUser={setForgotUser} setForgotPassword={setForgotPassword}
                    setModalIsTrue={setModalIsTrue} loggedIn={loggedIn} setLoggedIn={setLoggedIn}
                    />
                    <Signup
                    setLogin={setLogin} signUp={signUp} setSignUp={setSignUp} 
                    setModalIsTrue={setModalIsTrue}loggedIn={loggedIn} setLoggedIn={setLoggedIn}
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