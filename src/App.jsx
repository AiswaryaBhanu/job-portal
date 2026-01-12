import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import JobDetails from "./pages/JobDetails";
import RecruiterProfile from "./pages/RecruiterProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ApplicantsPage from "./pages/ApplicantsPage";

import RecruiterRoute from "./components/RecruiterRoute";
import PostJob from "./pages/PostJob";

import JobSeekerProfile from "./pages/JobSeekerProfile";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/recruiter-profile" element={<RecruiterProfile />} />
        <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
        <Route path="/recruiter/applicants/:jobId" element={<ApplicantsPage />} />
        <Route path="/jobseeker-profile" element={<JobSeekerProfile />} />
        <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />

        {/* ✅ Recruiter Only */}
        <Route
          path="/post-job"
          element={
            <RecruiterRoute>
              <PostJob />
            </RecruiterRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
