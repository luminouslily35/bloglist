import { useState } from 'react'

const NoteForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')


  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      author,
      title,
      url,
      likes: 0
    })

    setAuthor('')
    setUrl('')
    setTitle('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit}>
        <label>author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <br />
        <label>title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <br />
        <label>url:
          <input
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
        <br />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm