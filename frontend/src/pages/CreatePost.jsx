import React, { useState } from "react";
import axios from "axios";
import "./Post.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function CreatePost() {
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "linkedin"); // Your Cloudinary preset here

    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dl4izb2hd/image/upload",
        formData
      );
      setUploading(false);
      return res.data.secure_url;
    } catch (err) {
      setUploading(false);
      console.error("Cloudinary upload failed:", err);
      alert("Image upload failed");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!body.trim() || !description.trim() || !image) {
      alert("Please add body, description and select an image.");
      return;
    }

    const uploadedImageUrl = await handleImageUpload();

    if (!uploadedImageUrl) return;

    try {
      await axios.post(
        `http://localhost:8080/createpost/${userId}`,
        {
          token,
          body,
          description,
          imageUrl: uploadedImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Post created successfully!");
      setBody("");
      setDescription("");
      setImage(null);
      setImageUrl("");
      navigate("/");
    } catch (err) {
      console.error("Failed to create post:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <><Navbar />
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div>
          <label>Body:</label>
          <textarea
            rows="4"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the main content here..."
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            required
          />
        </div>

        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        {uploading && <p>Uploading image...</p>}

        {imageUrl && (
          <div>
            <p>Preview:</p>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: "300px" }} />
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
    </>
  );
}
