import React, { useState } from "react";
import { REQUEST, sendData } from "./server";

export default function RegistrationForm() {
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const form = document.forms[0]
        if (form.password.value !== form.passwordConfirm.value) {
            setError('Password and Confirm Password fields do not match.')
            return
        }
        sendData(REQUEST.USER, {
            email: form.email.value,
            username: form.username.value,
            password: form.password.value,
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            hobby: form.hobby.value
        }).then(returnValue => {
            console.log(returnValue)
            if (returnValue === 0) {
                setError('A user with the same email or username already exists.')
            } else {
                setError('Successfully registered!')
            }
        })
    }

    return (
        <div>
            <form className="Form" onSubmit={handleSubmit}>
                <label for="email">Email</label>
                <input type="email" id="email"/>
                <label for="username">Username</label>
                <input type="text" id="username"/>
                <label for="password">Password</label>
                <input type="password" id="password"/>
                <label for="passwordConfirm">Confirm Password</label>
                <input type="password" id="passwordConfirm"/>
                <label for="firstName">First Name</label>
                <input type="text" id="firstName"/>
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName"/>
                <label for="hobby">Choose Hobby:</label>
                <select id="hobby" name="hobby">
                    <option value="Hiking">Hiking</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Calligraphy">Calligraphy</option>
                    <option value="Bowling">Bowling</option>
                    <option value="Movie">Movie</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Dancing">Dancing</option>
                </select>
                <input type="submit" value="Submit"/>
            </form>
            <p>{error}</p>
        </div>
    )
}