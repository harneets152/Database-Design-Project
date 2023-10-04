import React, {useState, useEffect} from 'react';
import BlogList from './BlogList';
import DisplayPost from './DisplayPost';
import './Main.css';
import QueryList from './QueryList';
import { REQUEST, getData } from "./server";


export default function MainPage({ userInfo }){
/////////////////////////////////////////////////////////////
// Gets Information of 1 Blog within dataset
// Goal Now is to use this and modify it to get 
// information form sql databas and map contents
/////////////////////////////////////////////////////////////
    const [blogs, setBlogs] = useState([]);
    const [currentBlog, setCurrentBlog] = useState({})
    const [listBlogs, setListBlogs] = useState(true)
    const [showQuery, setShowing] = useState(false)

    useEffect(() => {
        getData(REQUEST.BLOG).then((blogs) => setBlogs(blogs))
    }, [])

    function onBlogChosen(blog) {
        console.log(blog)
        setCurrentBlog(blog)
        setListBlogs(false)
    }

    if (showQuery) {
        return(
            <div className='QShow'>
            <h1>Query List</h1>
            <QueryList></QueryList>
            <button onClick={() => setShowing(false)}>Back to Menu</button>
            </div>
        )
    } else {
        return (
            <div className='MainPage'>
                <h1>Main Menu</h1>
                {/* <BlogList blogs={blogs} handlePost={handlePost}/> */}
            {listBlogs ? <BlogList blogs={blogs} onBlogChosen={onBlogChosen}/> : <DisplayPost blog={currentBlog} userInfo={userInfo} onReturnMainMenu={() => setListBlogs(true)}/>}
            <button onClick={() => setShowing(true)}>Go to Queries</button>
            </div>
        );
    }
}