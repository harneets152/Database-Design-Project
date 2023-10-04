import './Main.css';

export default function BlogList({blogs, onBlogChosen}) {
  return (
      <div className="blog_list">
          {blogs.map((blog) => (
            <div className="blog-preview" key={blog.id}>
              <h2>{blog.subject}</h2>
              <p>Written By: {blog.author}</p>
              <p>Tags: {blog.tags.join()}</p>
              <button onClick={() => onBlogChosen(blog)}>Access Post</button>
            </div>
          ))}
      </div>
  )
}