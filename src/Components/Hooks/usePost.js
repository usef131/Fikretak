import { useState } from "react";
import { postService } from "../../../Services/postServices";

export default function usePost(post, user, onDelete) {
  const [likes, setLikes] = useState(post.likes?.length || 0);

  const [liked, setLiked] = useState(
    post.likes?.includes(user?._id) || false
  );

  const [comments, setComments] = useState(post.comments || []);

  const [showComments, setShowComments] = useState(false);

  const [commentText, setCommentText] = useState("");

  const [commenting, setCommenting] = useState(false);

  const initials = post.user?.name?.slice(0, 2).toUpperCase() || "U";

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleLike = async () => {
    try {
      const data = await postService.likePost(post._id);

      setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setCommenting(true);

    try {
      const data = await postService.addComment(post._id, commentText);

      setComments((prev) => [...prev, data.comment]);
      setCommentText("");
    } catch (err) {
      console.error(err);
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await postService.deletePost(post._id);

      onDelete?.(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return {
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
  };
}