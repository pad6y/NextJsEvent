import classes from './comment-list.module.css';

function CommentList({ comments }) {
  if (!comments) return <p>Loading...</p>;
  return (
    <ul className={classes.comments}>
      {comments.map((comment) => {
        return (
          <li key={comment._id}>
            <p>{comment.text}</p>
            <div>
              By <address>{comment.email}</address>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default CommentList;
