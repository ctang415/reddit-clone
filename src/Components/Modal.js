import React from "react";

const Modal = ( {modalIsTrue, createUserWithEmailAndPassword, signInWithEmailAndPassword } ) => {
    if (modalIsTrue)
        return (
            <div className="modal">
                <div className="modal-text">
                    <form>
                        <input type="text"></input>
                        <input type="password"></input>
                        <span>Forget your username or password?</span>
             
          
                                <button type="submit" onSubmit={ () => signInWithEmailAndPassword} className="login-button">Log In</button>
                                <span>New to Reddit? <span>Sign up.</span></span>
                    </form>
                </div>
            </div>
        )
}

export default Modal