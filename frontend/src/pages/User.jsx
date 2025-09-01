import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";

export default function FetchUser() {
  const { id } = useParams(); 
const [user, setUser] = useState({});
const [ed, setEd] = useState({
    school: {},
    college: {},
    degree: {},
  });
  const [work, setWork] = useState({
    present: {},
    pastworks: [],
  });

  useEffect(() => {
    console.log("Fetching user with ID:", id);
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(res.data);
        setUser(res.data);
        setEd(res.data.education);
        setWork(res.data.work[0]);
        console.log(res.data.work[0]);
      } catch (e) {
        console.log("Error:", e.message);
      }
    };
    if (id) fetchUser();
  }, [id]);

  return (
    <>
    <Navbar />
      <div>
        <img
          src={user.profile}
          style={{
            height: "200px",
            width: "200px",
            borderRadius: "200px",
            border: "1px solid black",
          }}
        />
      </div>
      <div>Name: {user.name}</div>
      <div>UserName: {user.username}</div>
      <div>Email: {user.email}</div>
       <div>
        <h2>Education</h2>
      {ed==undefined?<p>User not uploaded anything about education</p>:<div>
          <h3>School Info</h3>
          <span>Name: {ed?.school?.name}</span>
          <span>Passing Year: {ed?.school?.year}</span>
          <span>Percentage: {ed?.school?.marks}%</span>

          <h3>College Info</h3>
          <span>Name: {ed?.college?.cname}</span>
          <span>Passing Year: {ed?.college?.cyear}</span>
          <span>Percentage: {ed?.college?.cmarks}%</span>

          <h3>Degree Info</h3>
          <span>Name: {ed?.degree?.dname}</span>
          <span>Passing Year: {ed?.degree?.dyear}</span>
          <span>Percentage: {ed?.degree?.dmarks}%</span>
        </div>}
        </div>
   <div>
  <h2>Present Work</h2>
        {work==undefined ? (
     <div><p>There is no present Work</p></div>
  ):(
    <div className="present-work-display">
      <p><strong>Company:</strong> {work?.present?.pcompany}</p>
      <p><strong>Position:</strong> {work?.present?.pposition}</p>
    </div>
   
  )}
  </div>
  <div>
    <h2>PastWorks</h2>
    {work==undefined?<p>There is no past works</p>:(
    <div>
      {work?.pastworks?.map((works, index) => (
        <div key={index} className="past-work-display">
          <p><strong>Company:</strong> {works.company}</p>
          <p><strong>Position:</strong> {works.position}</p>
          <p><strong>Years:</strong> {works.years}</p>
        </div>
      ))}
  </div>
    )}</div>
      
    </>
  );
}
