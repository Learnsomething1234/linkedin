import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../App.css";
import Navbar from "./Navbar";

export default function Home() {
  const token = localStorage.getItem("token");
  const userId=localStorage.getItem("userId");
  const [posts, setPosts] = useState([]);  // Ensure posts is an array
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const fetchPosts = async () => {
      if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/allPost", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        
          setPosts(res.data);
       
      } catch (e) {
        console.error("Error fetching posts", e);
      }
    };

    fetchPosts();
  }, [token]);

  const handleLike = async (postId) => {
    const liked = likedPosts.has(postId);
    const action = liked ? "unlike" : "like";

    try {
      const res = await axios.post(
        `http://localhost:8080/post/${postId}/like`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          action,
        }
      );

      // Update post likes
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: res.data.likes } : post
        )
      );

      // Toggle UI like state
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (liked) {
          newSet.delete(postId);
        } else {
          newSet.add(postId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Failed to toggle like", err.message);
    }
  };

  return (
   <div><Navbar />
    <div className="posts-container">
      {posts.length === 0 ? (
        <p>No posts to display</p>
      ) : (
        posts.map((post) => {
          const liked = likedPosts.has(post._id);
          return (
            <Link to={`/post/${post._id}`} className="post-link" key={post._id}>
              <div className="post-card">
                <div className="post-header">
                  <h3>{post.userId?.name || "Unknown User"}</h3>
                  <span className="post-time">
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                </div>

                <img
                  src={post.imageUrl || "https://placehold.co/600x300?text=Post+Image"}
                  alt="Post"
                  className="post-image"
                  style={{height:"200px",width:"500px"}}
                />

                <p className="post-body">{post.body}</p>

                <div className="post-footer">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`like-button ${liked ? "liked" : ""}`}
                  >
                    <i className={`bi bi-heart${liked ? "-fill" : ""}`}></i>
                  </button>
                  <span>{post.likes} Likes</span>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
    </div>
  );
}
