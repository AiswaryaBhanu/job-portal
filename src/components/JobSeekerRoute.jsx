import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function JobSeekerRoute({ children }) {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (role !== "jobseeker") return <Navigate to="/" />;

  return children;
}
