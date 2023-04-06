import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import ForgotUser from "./ForgotUser";
import Login from "./Login";
import Signup from "./Signup";

const Modal = ( {modalIsTrue, setModalIsTrue, createUserWithEmailAndPassword, signInWithEmailAndPassword } ) => {
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
    }

    if (modalIsTrue)
        return (
            <div className="modal">
                <div className="modal-text">
                    <div onClick={closeModal} id="modal-close-button">
                        X
                    </div>
                    <Login 
                    signInWithEmailAndPassword={signInWithEmailAndPassword}
                    setSignUp={setSignUp} setLogin={setLogin} login={login}
                    setForgotUser={setForgotUser} setForgotPassword={setForgotPassword}
                    />
                    <Signup 
                    createUserWithEmailAndPassword={createUserWithEmailAndPassword} 
                    setLogin={setLogin} signUp={signUp} setSignUp={setSignUp} 
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
            </div>
        )
}

export default Modal