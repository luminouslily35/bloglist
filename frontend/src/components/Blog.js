import { useState } from 'react'
const Blog = ({ blog, likeBlog, deleteBlog, currentUser }) => {
  const [showAll, setShowAll] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleClick = (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    likeBlog(updatedBlog)
  }

  const handleRemove = (event) => {
    event.preventDefault()
    deleteBlog({ ...blog })
  }

  const renderDeleteButton = () => {
    if (currentUser.username === blog.user.username) {
      return <button onClick={handleRemove}>delete</button>
    } else {
      return <></>
    }
  }

  return (
    <div style={blogStyle}>
      {showAll ?
        <div>
          <p>title: {blog.title} <button onClick={() => setShowAll(false)}>hide</button> </p>
          <p>author: {blog.author} </p>
          <p>url: {blog.url} </p>
          <p>likes: {blog.likes} <button onClick={handleClick}>like</button></p>
          <p>created by {blog.user.username}
            {currentUser !== null && renderDeleteButton()}
          </p>
        </div>
        :
        <div>
          {blog.title} {blog.author} <button onClick={() => setShowAll(true)}>show</button>
        </div >
      }
    </div>
  )
}

export default Blog