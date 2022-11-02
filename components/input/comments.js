import { useState, useEffect, useContext } from 'react';
import NotificationContext from '../../store/notification-context';
import CommentList from './comment-list';
import NewComment from './new-comment';
import classes from './comments.module.css';

function Comments(props) {
  const { eventId } = props;
  const [comments, setComments] = useState();
  const [showComments, setShowComments] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState(false);
  const noticationCtx = useContext(NotificationContext);
  const { showNotification } = noticationCtx;

  useEffect(() => {
    if (showComments) {
      setFetchingStatus(true);
      fetch(`/api/comments/${eventId}`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setFetchingStatus(false);
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    showNotification({
      title: 'Adding Comment',
      message: 'Adding Comment to event',
      status: 'pending',
    });

    // send data to API
    fetch(`/api/comments/${eventId}`, {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        return response.json().then((data) => {
          throw new Error(data.message || 'something went wrong');
        });
      })
      .then((data) => {
        toggleCommentsHandler();
        showNotification({
          title: 'Successfully added comment',
          message: 'Comment added successfully',
          status: 'success',
        });
      })
      .catch((err) => {
        showNotification({
          title: 'Failed to add comment',
          message: err.message || 'something went wrong',
          status: 'error',
        });
      });

    toggleCommentsHandler();
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? 'Hide' : 'Show'} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && fetchingStatus && <p>Loading...</p>}
      {showComments && !fetchingStatus && <CommentList comments={comments} />}
    </section>
  );
}

export default Comments;
