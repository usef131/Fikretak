import { useAuth } from "../../../Context/AuthContext";
import usePost from "../Hooks/usePost";

import heartIcon from "../../assets/images/heart.png";
import redHeartIcon from "../../assets/images/redHeart.png";
import commentIcon from "../../assets/images/chat.png";

import "../../assets/styles/postCard.css";

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();

  const {
  initials,
  likes,
  liked,
  comments,
  showComments,
  commentText,
  commenting,
  setCommentText,
  handleLike,
  handleComment,
  handleDelete,
  toggleComments,
  timeAgo,
} = usePost(post, user, onDelete);

  return (
    <div className="fk-post-card">

      {/* Header */}
      <div className="fk-post-header">

        <div className="fk-post-avatar">
          {post.user?.avatar ? (
            <img
              src={`http://localhost:5002${post.user.avatar}`}
              alt="avatar"
            />
          ) : (
            initials
          )}
        </div>

        <div className="fk-post-user">
          <div className="fk-post-name">
            {post.user?.name}
          </div>

          <div className="fk-post-time">
            {timeAgo(post.createdAt)}
          </div>
        </div>

        {user?._id === post.user?._id && (
          <button
            className="fk-delete"
            onClick={handleDelete}
          >
            <i className="bi bi-trash3-fill"></i>
          </button>
        )}

      </div>

      {/* Post Text */}

      <p className="fk-post-text">
        {post.text}
      </p>

      {/* Actions */}

      <div className="fk-post-actions">

        <button
          className={`fk-action-btn ${
            liked ? "fk-like-active" : ""
          }`}
          onClick={handleLike}
        >
          <img
            src={liked ? redHeartIcon : heartIcon}
            alt="Like"
            width={18}
          />

          {likes}
        </button>

        <button
          className="fk-action-btn"
         onClick={toggleComments}
        >
          <img
            src={commentIcon}
            alt="Comment"
            width={18}
          />

          {comments.length}
        </button>

      </div>

      {/* Comments */}

      {showComments && (

        <div className="fk-comments">

          {comments.length === 0 && (
            <p className="text-muted mb-3">
              No comments yet.
            </p>
          )}

          {comments.map((comment, index) => (

            <div
              className="fk-comment"
              key={index}
            >

              <div className="fk-comment-avatar">
                {comment.user?.name
                  ?.slice(0, 2)
                  .toUpperCase() || "U"}
              </div>

              <div className="fk-comment-body">

                <span className="fk-comment-name">
                  {comment.user?.name || "User"}
                </span>

                {comment.text}

              </div>

            </div>

          ))}

          <form
            className="fk-comment-form"
            onSubmit={handleComment}
          >

            <input
              className="fk-comment-input"
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
            />

            <button
              className="fk-comment-btn"
              disabled={commenting}
            >
              {commenting ? "Posting..." : "Post"}
            </button>

          </form>

        </div>

      )}

    </div>
  );
}