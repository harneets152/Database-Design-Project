import React, {useCallback, useEffect, useState} from 'react';
import { REQUEST, sendData, getData } from "./server";
import './Main.css';

export default function QueryList() {
    const [query, setQuery] = useState(0) 
    const [data, setData] = useState([])
    const [request, setRequest] = useState({type: null, id: null})
    const [showResult, setShowResult] = useState(false)

    function displayUsers(users) {
        return (
            <div>
                {users.map(user => (
                    <p>{user.username}</p>
                ))}
            </div>
        )
    }

    function displayBlogs(blogs) {
        return (
            <div>
                {blogs.map(blog => (
                    <p>{blog.subject}</p>
                ))}
            </div>
        )
    }

    function positiveBlogsForm() {
        function handleSubmit(e) {
            e.preventDefault()
            const form = document.forms[0]
            setRequest({type: REQUEST.BLOG, id: form.username.value})
            setShowResult(true)
        }
        return (
            <form onSubmit={handleSubmit}>
                <label for="username">Username</label>
                <input type="text" id="username"/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }

    function hobbyForm() {
        function handleSubmit(e) {
            e.preventDefault()
            const form = document.forms[0]
            setRequest({type: REQUEST.HOBBY, id: form.hobby.value})
            setShowResult(true)
        }
        return (
            <form onSubmit={handleSubmit}>
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
        )
    }

    function tagsForm() {
        function handleSubmit(e) {
            e.preventDefault()
            const form = document.forms[0]
            setRequest({type: REQUEST.TAG, id: [form.tagOne.value, form.tagTwo.value]})
            setShowResult(true)
        }
        return (
            <form onSubmit={handleSubmit}>
                <label for="tagOne">Tag</label>
                <input type="text" id="tagOne"/>
                <label for="tagTwo">Tag</label>
                <input type="text" id="tagTwo"/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }

    function usersFollowedByForm() {
        function handleSubmit(e) {
            e.preventDefault()
            const form = document.forms[0]
            setRequest({type: REQUEST.FOLLOWEES, id: [form.userOne.value, form.userTwo.value]})
            setShowResult(true)
        }
        return (
            <form onSubmit={handleSubmit}>
                <label for="userOne">User</label>
                <input type="text" id="userOne"/>
                <label for="userTwo">User</label>
                <input type="text" id="userTwo"/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }

    function dateForm() {
        function handleSubmit(e) {
            e.preventDefault()
            const form = document.forms[0]
            setRequest({type: REQUEST.USER, id: form.date.value})
            setShowResult(true)
        }
        return (
            <form onSubmit={handleSubmit}>
                <label for="date">Date</label>
                <input type="text" id="date"/>
                <input type="submit" value="Submit"/>
            </form>
        )
    }

    useEffect(() => {
        if (request.id != null) {
            getData(request.type, request.id).then(data => setData(data))
        }
    }, [request])

    let requestToSend, toBeRendered
    switch (query) {
        case 1:
            if (!showResult) {
                toBeRendered = tagsForm()
            } else {
                toBeRendered = displayUsers(data)
            }
            break
        case 2:
            if (!showResult) {
                toBeRendered = positiveBlogsForm()
            } else {
                toBeRendered = displayBlogs(data)
            }
            break
        case 3:
            if (!showResult) {
                toBeRendered = dateForm()
            } else {
                toBeRendered = displayUsers(data)
            }
            break
        case 4:
            if (!showResult) {
                toBeRendered = usersFollowedByForm()
            } else {
                toBeRendered = displayUsers(data)
            }
            break
        case 5:
            if (!showResult) {
                toBeRendered = hobbyForm()
            } else {
                toBeRendered = displayUsers(data)
            }
            break
        case 6:
            requestToSend = {type: REQUEST.USER, id: 'no_blogs'}
            toBeRendered = displayUsers(data)
            break
        case 7:
            requestToSend = {type: REQUEST.USER, id: 'no_comments'}
            toBeRendered = displayUsers(data)
            break
        case 8:
            requestToSend = {type: REQUEST.USER, id: 'posted_only_negative'}
            toBeRendered = displayUsers(data)
            break
        case 9:
            requestToSend = {type: REQUEST.USER, id: 'no_negative'}
            toBeRendered = displayUsers(data)
            break
        default:
            return (
                <div className='QShow'>
                    <button onClick={() => setQuery(1)} className='QButton'> Show Users via tag input </button>
                    <button onClick={() => setQuery(2)} className='QButton'> Show Blog Titles consisting of positive comments </button>
                    <button onClick={() => setQuery(3)} className='QButton'> Show users who posted most blogs on a specific date </button>
                    <button onClick={() => setQuery(4)} className='QButton'> Show User who is followed by 2 other users  </button>
                    <button onClick={() => setQuery(5)} className='QButton'> Show list of Users with a common hobby </button>
                    <button onClick={() => setQuery(6)} className='QButton'> Show Users who have never posted a blog </button>
                    <button onClick={() => setQuery(7)} className='QButton'> Show Users who have never commented </button>
                    <button onClick={() => setQuery(8)} className='QButton'> Show Users with only negative comments </button>
                    <button onClick={() => setQuery(9)} className='QButton'> Show Users with no negative comments on blogs</button>
                </div>
            )
    }
    if (requestToSend != null && request.id !== requestToSend.id) setRequest(requestToSend)
    return (
        <div>
            {toBeRendered}
            <button onClick={() => {setQuery(0); setShowResult(false)}}>Return to queries</button>
        </div>
    )
}