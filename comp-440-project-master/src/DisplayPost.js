/////////////////////////////////////////////////////////
/// Goal here is to display a new page of the post
/// with full details of the post as well as the 
/// comments and positive or negative comments
/////////////////////////////////////////////////////////

import React, {useEffect, useState} from "react";
import './Main.css';
import { REQUEST, getData, sendData } from "./server";

export default function DisplayPost({blog, userInfo, onReturnMainMenu}) {
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const [followers, setFollowers] = useState([])

    useEffect(() => {
        getData(REQUEST.COMMENT, blog.blogid).then(comments => setComments(comments)).finally(() => {
            getData(REQUEST.FOLLOWERS, blog.author).then(followers => setFollowers(followers))
        })
    }, [blog.blogid, message])
    
    function handleSubmit(e) {
        e.preventDefault()
        const form = document.forms[0]
        sendData(REQUEST.COMMENT, {
            blogid: blog.blogid,
            author: userInfo.username,
            sentiment: form.sentiment.value,
            description: form.description.value
        }).then(returnValue => {
            console.log(returnValue)
            if (returnValue === 0) {
                setMessage("Error: Reached your daily limit of 3 comments.")
            } else if ( returnValue === 1) {
                setMessage("Successfully posted comment.")
            } else if (returnValue === 2) {
                setMessage("Error: Cannot comment more than once on the same post.")
            } else if (returnValue === 3) {
                setMessage("Error: Cannot comment on your own post.")
            }
        })
    }

    function followButton() {
        if (userInfo.username === blog.author) return
        if (followers.some((user) => {return user.username === userInfo.username})) {
            return (
                <button onClick={() => {
                    sendData(REQUEST.UNFOLLOW, {follower: userInfo.username, followee: blog.author})
                    setMessage("Successfully unfollowed!")
                }}>Unfollow</button>
            )
        } else {
            return (
                <button onClick={() => {
                    sendData(REQUEST.FOLLOW, {follower: userInfo.username, followee: blog.author})
                    setMessage("Successfully followed!")
                }}>Follow</button>
            )
        }
    }

    return (
        <div className="Post">
            <h2>{blog.subject}</h2>
            <p>Written by: {blog.author}</p>
            {followButton()}
            <p>{blog.description}</p>
            <p>Tags: {blog.tags.join()}</p>

            <h2>Comments</h2>
            {comments.map((comment) => (
                <div>
                <h4>{comment.description}</h4>
                <p>Written By: {comment.author}</p>
                <p>Sentiment: {comment.sentiment}</p>
                </div>
            ))}

            <h2>Write your own comment!</h2>
            <form className='Form' onSubmit={handleSubmit}>
                <label for="description">Enter Description</label>
                <textarea type="text" id="description" className='PostContainer'/>
                <label for="sentiment">Choose sentiment:</label>
                <select id="sentiment" name="sentiment">
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                </select>
                <input type="submit" value="Submit Comment"/>
            </form>
            <p>{message}</p>

            <button onClick={() => onReturnMainMenu()}>Return to Main</button>
        </div>
    )
}