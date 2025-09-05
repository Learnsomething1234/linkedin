import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Navbar from "./Navbar";

export default function UserProfilePage() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(""); // Added
  const [school, setSchool] = useState({ name: '', year: '', marks: '' });
  const [college, setCollege] = useState({ cname: '', cyear: '', cmarks: '' });
  const [degree, setDegree] = useState({ dname: '', dyear: '', dmarks: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ed, setEd] = useState({ school: {}, college: {}, degree: {} });
  const [work, setWork] = useState({ present: {}, pastworks: [] });
  const [pastworks, setPastWorks] = useState([{ company: "", position: "", years: "" }]);
  const [present, setPresentWork] = useState({ pcompany: "", pposition: "" });

  // Image upload handlers


  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/download/${userId}`, {
        responseType: 'blob', // Important to handle binary data
      });

      // Create a blob URL and simulate download
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;

      // Optional: filename from backend header or default
      const filename = response.headers['content-disposition']
        ? response.headers['content-disposition'].split('filename=')[1]
        : 'resume.pdf';

      link.setAttribute('download', filename.replace(/"/g, '')); // Remove quotes if any
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume. Please try again.");
    }
  };
  const handleImageClick = () => {
    document.getElementById("profileInput").click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await axios.put(
        `http://localhost:8080/profile/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileImage(res.data.profile); // Update image in UI
      alert("Profile image updated.");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to update profile image.");
    }
  };

  const handleSchoolChange = (e) => setSchool({ ...school, [e.target.name]: e.target.value });
  const handleCollegeChange = (e) => setCollege({ ...college, [e.target.name]: e.target.value });
  const handleDegreeChange = (e) => setDegree({ ...degree, [e.target.name]: e.target.value });

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    const data = { school, college, degree };
    try {
      const response = await axios.post(`http://localhost:8080/education/${userId}`, data);
      if (response.data.message === 'Studies are saved') {
        setMessage(response.data.message);
        setError('');
      } else {
        setError(response.data.error);
        setMessage('');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setMessage('');
    }
  };

  const handlePresentWorkChange = (field, value) => {
    setPresentWork((prev) => ({ ...prev, [field]: value }));
  };

  const handlePresentWorkSubmit = async (e) => {
    e.preventDefault();
    if (!present.pcompany || !present.pposition) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:8080/presentwork/${userId}`,
        { present },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(res.data.message);
    } catch (e) {
      console.error("Error adding present work", e);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...pastworks];
    updated[index][field] = value;
    setPastWorks(updated);
  };

  const handleAddPastwork = () => {
    setPastWorks([...pastworks, { company: "", position: "", years: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/addpastwork/${userId}`,
        { pastworks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data submitted:", res.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const userFetch = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setEd(res.data.education || {});
        setWork(res.data.work || {});
        console.log(res.data)
        setProfileImage(res.data.profile || "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/default-avatar.png");
      } catch (e) {
        console.log(e.message);
      }
    };
    userFetch();
  }, [token]);

  return (
    <>
    <Navbar />
      {/* Profile Image Upload */}
      <div style={{ marginBottom: "1rem" }}>
        <img
          src={user.profile}
          alt="Profile"
          onClick={handleImageClick}
          style={{
            height: "200px",
            width: "200px",
            borderRadius: "200px",
            border: "2px solid black",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
        <input
          type="file"
          id="profileInput"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      {/* Basic Info */}
      <div>Name: {user.name}</div>
      <div>UserName: {user.username}</div>
      <div>Email: {user.email}</div>

      {/* Education Section */}
      <div>
        <h2>Education</h2>
        {user?.education?.length === 0 ? (
          <form onSubmit={handleSubmit1}>
            <h3>School Info</h3>
            <input type="text" name="name" placeholder="School Name" value={school.name} onChange={handleSchoolChange} required />
            <input type="number" name="year" placeholder="Passing Year" value={school.year} onChange={handleSchoolChange} required />
            <input type="number" name="marks" placeholder="Percentage" value={school.marks} onChange={handleSchoolChange} required />

            <h3>College Info</h3>
            <input type="text" name="cname" placeholder="College Name" value={college.cname} onChange={handleCollegeChange} required />
            <input type="number" name="cyear" placeholder="Passing Year" value={college.cyear} onChange={handleCollegeChange} required />
            <input type="number" name="cmarks" placeholder="Percentage" value={college.cmarks} onChange={handleCollegeChange} required />

            <h3>Degree Info</h3>
            <input type="text" name="dname" placeholder="Degree Name" value={degree.dname} onChange={handleDegreeChange} required />
            <input type="number" name="dyear" placeholder="Passing Year" value={degree.dyear} onChange={handleDegreeChange} required />
            <input type="number" name="dmarks" placeholder="Percentage" value={degree.dmarks} onChange={handleDegreeChange} required />

            <button type="submit">Save Education</button>
          </form>
        ) : (
          <div>
            <h3>School Info</h3>
            <span>Name: {ed?.school?.name}</span><br />
            <span>Passing Year: {ed?.school?.year}</span><br />
            <span>Percentage: {ed?.school?.marks}%</span>

            <h3>College Info</h3>
            <span>Name: {ed?.college?.cname}</span><br />
            <span>Passing Year: {ed?.college?.cyear}</span><br />
            <span>Percentage: {ed?.college?.cmarks}%</span>

            <h3>Degree Info</h3>
            <span>Name: {ed?.degree?.dname}</span><br />
            <span>Passing Year: {ed?.degree?.dyear}</span><br />
            <span>Percentage: {ed?.degree?.dmarks}%</span>
          </div>
        )}
      </div>

      {/* Present Work */}
      <div>
        <h2>Present Work</h2>
        {work[0]?.present ? (
          <div>
            <p><strong>Company:</strong> {work[0].present.pcompany}</p>
            <p><strong>Position:</strong> {work[0].present.pposition}</p>
          </div>
        ) : (
          <form onSubmit={handlePresentWorkSubmit}>
            <input type="text" name="company" value={present.pcompany} onChange={(e) => handlePresentWorkChange("pcompany", e.target.value)} placeholder="Company" required />
            <input type="text" name="position" value={present.pposition} onChange={(e) => handlePresentWorkChange("pposition", e.target.value)} placeholder="Position" required />
            <button type="submit">Add Present Work</button>
          </form>
        )}
      </div>

      {/* Past Works */}
      <div>
        <h2>Past Works</h2>
        {work?.pastworks?.length === 0 ? (
          <form onSubmit={handleSubmit}>
            {pastworks.map((item, i) => (
              <div key={i}>
                <input type="text" value={item.company} onChange={(e) => handleChange(i, "company", e.target.value)} placeholder="Company" />
                <input type="text" value={item.position} onChange={(e) => handleChange(i, "position", e.target.value)} placeholder="Position" />
                <input type="number" value={item.years} onChange={(e) => handleChange(i, "years", e.target.value)} placeholder="Years" />
              </div>
            ))}
            <button type="button" onClick={handleAddPastwork}>Add Past Work</button>
            <button type="submit">Submit</button>
          </form>
        ) : (
          <div>
            {work[0]?.pastworks?.map((item, i) => (
              <div key={i}>
                <p><strong>Company:</strong> {item.company}</p>
                <p><strong>Position:</strong> {item.position}</p>
                <p><strong>Years:</strong> {item.years}</p>
              </div>
            ))}
            {/* You can still allow additional inputs */}
            <form onSubmit={handleSubmit}>
              {pastworks.map((item, i) => (
                <div key={i}>
                  <input type="text" value={item.company} onChange={(e) => handleChange(i, "company", e.target.value)} placeholder="Company" />
                  <input type="text" value={item.position} onChange={(e) => handleChange(i, "position", e.target.value)} placeholder="Position" />
                  <input type="number" value={item.years} onChange={(e) => handleChange(i, "years", e.target.value)} placeholder="Years" />
                </div>
              ))}
              <button type="button" onClick={handleAddPastwork}>Add Past Work</button>
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
      <button onClick={handleDownload}>Download Resume</button>
    </>
  );
}
