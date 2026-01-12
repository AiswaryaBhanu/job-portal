import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RecruiterRoute({ children }) {
  const { user, role } = useAuth();

  // If user not logged in
  if (!user) return <Navigate to="/login" />;

  // If logged in but not recruiter
  if (role !== "recruiter") return <Navigate to="/" />;

  return children;
}
