import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Connections() {
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);

  // Fetch all users and requests
  useEffect(() => {
    fetchUsers();
    fetchSentRequests();
    fetchIncomingRequests();
  }, [userId]);

  // Get all users except current
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/allUsers");
      const filtered = res.data.filter((u) => u._id !== userId);
      setUsers(filtered);
    } catch (e) {
      console.error("Error fetching users:", e.message);
    }
  };

  // Get sent requests
  const fetchSentRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/allRequest/${userId}`);
      const receiverIds = res.data.map((r) => r.receiver._id);
      setSentRequests(receiverIds);
    } catch (e) {
      console.error("Error fetching sent requests:", e.message);
    }
  };

  // Get incoming requests
  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/incomingRequests/${userId}`);
      setIncomingRequests(res.data);
    } catch (e) {
      console.error("Error fetching incoming requests:", e.message);
    }
  };

  // Send request
  const sendRequest = async (receiverId) => {
    try {
      await axios.post(`http://localhost:8080/request/${userId}/${receiverId}`, {
        senderId: userId,
        receiverId,
      });
      setSentRequests((prev) => [...prev, receiverId]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send request.");
    }
  };

  // Accept request
  const acceptRequest = async (senderId) => {
    try {
      await axios.post(`http://localhost:8080/accept/${senderId}/${userId}`, {
        senderId,
        receiverId: userId,
      });
      setIncomingRequests((prev) => prev.filter((r) => r.sender._id !== senderId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="users-container">
        <h2>Connection System</h2>

        {/* ==== Available Users Section ==== */}
        <div className="section">
          <h3>Available Users</h3>
          <div className="users-list">
            {users.map((user) => (
              <div className="user-card" key={user._id}>
                <Link to={`/profile/${user._id}`}>
                  <span>@{user.username}</span>
                </Link>
                {sentRequests.includes(user._id) ? (
                  <button disabled>Request Sent</button>
                ) : (
                  <button onClick={() => sendRequest(user._id)}>Send Request</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ==== Incoming Requests Section ==== */}
        <div className="section">
          <h3>Incoming Requests</h3>
          <div className="users-list">
            {incomingRequests.length === 0 ? (
              <p>No incoming requests</p>
            ) : (
              incomingRequests.map((req) => (
                <div className="user-card" key={req._id}>
                  <span>@{req.sender.username}</span>
                  <button onClick={() => acceptRequest(req.sender._id)}>Accept</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
