import { useEffect, useState } from "react";
import axios from "axios";
import "./Users.css"; 
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Users() {
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/allUsers`, {
          headers: { "Content-Type": "application/json" },
        });
        const result = res.data;
        setUsers(result.filter((prev) => prev._id !== userId));
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchUsers();
  }, [userId]);

//   const handleSendRequest = async (toUserId) => {
//     try {
//       const res = await axios.post(
//         `http://localhost:8080/sendRequest`,
//         { from: userId, to: toUserId },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       alert(`Friend request sent to user!`);
//     } catch (err) {
//       console.error("Error sending request:", err.message);
//       alert("Failed to send request.");
//     }
//   };

  return (
    <><Navbar />
    <div className="users-container">
      <h2>Available Users</h2>
      <div className="users-list">
        {users.map((user) => (
            <Link to={`/profile/${user._id}`}>
          <div className="user-card" key={user._id}>
            <span>@{user.username}</span>
            <button>
              Send Request
            </button>
          </div></Link>
        ))}
      </div>
    </div>
    </>
  );
}
