import { AuthProvider } from './assets/authContext'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUP from './pages/SignUp'
import Protect from "./pages/ProtecteRoutes"
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Post from './pages/Post'
import CreatePost from './pages/CreatePost'
import UserProfilePage from './pages/Profile'
import FetchUser from './pages/User'
import Users from './pages/Users'
import MyPost from './pages/MyPost'
import Logout from './pages/Logout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Protect><Home /></Protect>} />
          <Route path="/post/:postId" element={<Protect><Post /></Protect>} />
          <Route path="/post/create" element={<Protect><CreatePost /></Protect>} />
          <Route path="/profile" element={<Protect><UserProfilePage /></Protect>} />
          <Route path="/profile/:id" element={<Protect><FetchUser /></Protect>} />
          <Route path="/mypost" element={<Protect><MyPost /></Protect>} />
          <Route path="/logout" element={<Protect><Logout /></Protect>} />
          <Route path="/users" element={<Protect><Users /></Protect>} />
          <Route path="/signup" element={<SignUP />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App
