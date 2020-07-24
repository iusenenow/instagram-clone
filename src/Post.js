import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import { db } from './firebase'
import firebase from 'firebase'

const Post = ({ postId, user, post: { username, caption, imageURL } }) => {

  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          setComments(snapshot.docs.map(
            doc => doc.data()
          ))
        })
    }

    return () => {
      unsubscribe()
    }
  }, [postId])

  const handleSubmit = e => {
    e.preventDefault()

    db.collection('posts').doc(postId).collection('comments').add(
      {
        text: comment,
        username: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }
    )

    setComment('')
  }

  return (
    <div className='post'>

      <div className="post-header">
        <Avatar className='post-avatar'
          alt='Iusenenow'
          src='https://images.unsplash.com/profile-1495427732560-fe5248ad6638?dpr=2&auto=format&fit=crop&w=32&h=32&q=60&crop=faces&bg=fff' />
        <h3>{username}</h3>
      </div>

      <img className="post-image" src={imageURL} alt="" />

      <h4 className='post-text'><strong>{username}</strong> {caption}</h4>

      <div className="post-comments">
        {comments.map(comment => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            className="post-input"
            placeholder="Add a comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <button
            className="post-button"
            disabled={!comment}
            type="submit"
          >
            Post
        </button>
        </form>
      )}
    </div>
  )
}

export default Post
