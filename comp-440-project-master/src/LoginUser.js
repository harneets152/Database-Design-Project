import React, { useState } from "react";
import CreatePost from "./CreatePost";
import MainPage from "./Main";
import { REQUEST, sendData } from "./server";

export default function LoginUser() {
    const [mainmenu, setMenu] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState({})
    const [error, setError] = useState('')    

    function handleSubmit(e) {
        e.preventDefault()
        const form = document.forms[0]
        sendData(REQUEST.LOGIN, {
            username: form.username.value,
            password: form.password.value,
        }).then(returnValue => {
            console.log(returnValue)
            if (returnValue === 0) {
                setError('This username and password combination does not exist.')
            } else {
                setLoggedIn(true)
                setUserInfo(returnValue)
            }
        })
    }

    function render() {
        if (loggedIn) {
            return (
                <div>
                    <p>Welcome {userInfo.firstName} {userInfo.lastName}!</p>
                    <p>Username: {userInfo.username}, Email: {userInfo.email}</p>
                    {!mainmenu ? <MainPage userInfo={userInfo}/>:<CreatePost userInfo={userInfo}/>}
                    <button onClick={() => setMenu(!mainmenu)}>
                         {!mainmenu ? 'Create Post' : 'Return to Menu'}
                     </button>
                </div>
            )
        } else {
            return (
                <div>
                    <form className="Form" onSubmit={handleSubmit}>
                        <label for="username">Username</label>
                        <input type="text" id="username"/>
                        <label for="password">Password</label>
                        <input type="password" id="password"/>
                        <input type="submit" value="Log In"/>
                    </form>
                    <p>{error}</p>
                </div>
            )
        }
    }

    return render()
}