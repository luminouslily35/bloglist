import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(async () => {
    const initialBlogs = await blogService.getAll()
    const sortedBlogs = [...initialBlogs]
    sortedBlogs.sort((a, b) => (b.likes - a.likes))
    setBlogs(sortedBlogs)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logout = () => {
    window.localStorage.clear()
    blogService.setToken(null)
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
  }

  const likeBlog = async (blogObject) => {
    const id = blogObject.id
    const returnedBlog = await blogService.update(id, blogObject)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title}, by ${blog.author}`)) {
      const id = blog.id
      await blogService.deleteRequest(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable> :
        <div>
          <p>{user.name} logged in <button onClick={logout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Togglable>
        </div>
      }

      <div>

      </div>
      <div>
        {blogs.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={likeBlog}
            deleteBlog={deleteBlog}
          />
        )}
      </div>

    </div>
  )
}

export default App