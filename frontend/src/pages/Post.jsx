import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";
import Navbar from "./Navbar";

export default function Post() {
  const { postId } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ body: "", description: "", imageUrl: "" });
  const [imageFile, setImageFile] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const CLOUDINARY_UPLOAD_PRESET = "linkedin";
  const CLOUDINARY_CLOUD_NAME = "dl4izb2hd"; 

  // Fetch post and comments
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/post/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
        setForm({
          body: res.data.body || "",
          description: res.data.description || "",
          imageUrl: res.data.imageUrl || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/${postId}/getcomment`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchPost();
    fetchComments();
  }, [postId, token]);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      throw error;
    }
  };

  // Update post
  const handleUpdate = async () => {
    try {
      let imageUrl = form.imageUrl;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const res = await axios.put(
        `http://localhost:8080/${userId}/updatepost/${postId}`,
        { ...form, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost(res.data);
      setIsEditing(false);
      setImageFile(null);
      console.log("Post updated:", res.data);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Delete post
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/${userId}/deletepost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Post deleted");
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Create comment
  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8080/${userId}/createcomment/${postId}`,
        { body: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/${userId}/${postId}/${commentId}/deletecomment`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <div><Navbar></Navbar>
    <div className="post-details-container">
      {isEditing ? (
        <>
          <h2>Edit Post</h2>
          <label>
            Body:
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Image Upload:
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </label>

          {/* Optional image preview */}
          {imageFile && (
            <div className="image-preview">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: "200px" }} />
            </div>
          )}

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>@{post.userId?.name || "Unknown User"}</h2>
          <img src={post.imageUrl} alt="Post" className="post-image" />
          <p><strong>Body:</strong> {post.body}</p>
          {post.description && <p><strong>Description:</strong> {post.description}</p>}
          <p><strong>{post.likes}</strong> Likes</p>
          <button onClick={() => setIsEditing(true)}>Update</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCreateComment}>Add Comment</button>
        </div>

        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <p><strong>{comment.userId?.name || "Anonymous"}:</strong> {comment.body}</p>
              <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>
  );
}
