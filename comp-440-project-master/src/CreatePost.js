import { REQUEST, sendData } from "./server";
import './CreatePost.css';
import { useState } from "react";

export default function CreatePost({ userInfo }) {
    const [message, setMessage] = useState("")

    function handleSubmit(e) {
        e.preventDefault()
        const form = document.forms[0]
        sendData(REQUEST.BLOG, {
            subject: form.subject.value,
            description: form.description.value,
            tags: form.tags.value.split(' '),
            author: userInfo.username
        }).then(returnValue => {
            console.log(returnValue)
            if (returnValue === 0) {
                setMessage("Error: Reached your daily limit of 2 posts.")
            } else if (returnValue === 1) {
                setMessage("Successfully created post.")
            }
        })
    }

    return (
        <div className='CreatePost'>
            <h1>CreatePost</h1>
            <form className='Form' onSubmit={handleSubmit}>
                <label for="subject">Insert Subject</label>
                <input type="text" id="subject"/>
                <label for="description">Enter Description</label>
                <textarea type="text" id="description" className='PostContainer'/>
                <label for="tags">Tags</label>
                <input type="tags" id="tags"/>
                <input type="submit" value="Submit Post"/>
            </form>
            <p>{message}</p>
        </div>
)}