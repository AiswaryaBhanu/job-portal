import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../firebase.config";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          JobPortal
        </Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {/* ✅ show Jobs ONLY to job seekers */}
        {user && role === "jobseeker" && (
          <>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/jobseeker-dashboard">Dashboard</Link></li>
            <li><Link to="/jobseeker-profile">Profile</Link></li>
          </>
        )}

        {/* ✅ show Recruiter features ONLY to recruiters */}
        {user && role === "recruiter" && (
          <>
            <li><Link to="/post-job">Post Job</Link></li>
            <li><Link to="/recruiter-dashboard">Dashboard</Link></li>
            <li><Link to="/recruiter-profile">Profile</Link></li>
          </>
        )}

        {/* ✅ if NOT logged in */}
        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup" className="signup-btn">Signup</Link></li>
          </>
        )}

        {/* ✅ logout if logged in */}
        {user && (
          <li>
            <button
              onClick={handleLogout}
              className="signup-btn"
              style={{ border: "none", cursor: "pointer" }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
