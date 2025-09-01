import { useState } from 'react';
import { useAuth } from "../assets/authContext";
import "bootstrap-icons/font/bootstrap-icons.css"
import {Link} from "react-router-dom"
import axios from "axios";

export default function SignUP() {
   

    // Form state
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Submit handler
    const handleSignUP = async (e) => {
        e.preventDefault();
        try {
            if(!name || !username || !email || !password){
                return alert("Required all fields");
            }
            const res=await axios.post("http://localhost:8080/signup",{
                        name:name,
                        username:username,
                        email:email,
                        password:password,
                    })
                   alert("user Registered");
                   return window.location.href="/login";
            // Optionally, show success message or navigate
        } catch (error) {
            console.error("Signup failed:", error);
            // Optionally, show error message to user
        }
    };

    return (
        <>
        <div>
        <i className="bi bi-linkedin"></i></div>
            <form className="row g-3">
  <div className="col-md-6">
    <label  className="form-label">Name</label>
    <input type="text" className="form-control" id="inputEmail4" value={name} onChange={(e)=>setName(e.target.value)} required />
  </div>
  <div className="col-md-6">
    <label  className="form-label">Email</label>
    <input type="text" className="form-control" id="inputPassword4" value={email} onChange={(e)=>setEmail(e.target.value)} required />
  </div>
  <div className="col-12">
    <label  className="form-label">UserName</label>
    <input type="text" className="form-control" id="inputAddress" placeholder="enter the username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
  </div>
  <div className="col-12">
    <label  className="form-label">Password</label>
    <input type="password" className="form-control" id="inputAddress2" placeholder="Enter the password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
  </div>
  <div className="col-12">
    <button type="submit" className="btn btn-primary" onClick={handleSignUP}>Sign Up</button>
  </div>
  <p>if you have already account you can <Link to={"/login"}>Login</Link></p>
</form>
        </>
    );
}
