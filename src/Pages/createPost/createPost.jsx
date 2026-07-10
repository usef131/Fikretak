import { useState } from 'react'
import { useAuth } from '../../../Context/AuthContext'
import { postService } from '../../../Services/postServices'
import { Spinner } from 'react-bootstrap'
import '../../assets/styles/CreatePost.css'

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const initials = user?.name?.slice(0, 2).toUpperCase() || 'U'
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const { post } = await postService.createPost(text)
      if (onPostCreated) {
        onPostCreated(post)
      }
      setText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fk-card p-4 mb-4">
      <div className="d-flex gap-3">
        {/* Avatar */}
        <div className="create-post-avatar">
         
            {initials}
          
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="create-post-form">
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your thoughts..." rows={3} className="create-post-textarea" />
          {error && <p className="create-post-error">{error}</p>}
          <div className="create-post-footer">
            <span className={`create-post-char-count ${text.length > 900 ? 'over-limit' : ''}`}>
              {text.length}/1000
            </span>
            <button type="submit" disabled={loading || !text.trim()} className="create-post-submit-btn">
              {loading ? <Spinner size="sm" /> : 'Post'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}

