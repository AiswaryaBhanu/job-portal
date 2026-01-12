import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const authData = useAuth();
  const user = authData?.user;
  const role = authData?.role;


  const handlePostJobClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (role !== "recruiter") {
      alert("Only recruiters can post jobs.");
      return;
    }

    navigate("/post-job");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-4xl text-center mt-20">
        <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover opportunities that match your skills, interests, and goals.
        </p>

        <div className="flex justify-center gap-4">
        {/*Browse Jobs only for JobSeekers */}
        {user && role === "jobseeker" && (
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => navigate("/jobs")}
          >
            Browse Jobs
          </button>
        )}

        {/*Post Job only for Recruiters */}
        {user && role === "recruiter" && (
          <button
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl text-lg shadow-md hover:bg-gray-300 transition"
            onClick={() => navigate("/post-job")}
          >
            Post a Job
          </button>
        )}

        {/* if not logged in show both options */}
        {!user && (
          <>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg shadow-md hover:bg-blue-700 transition"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </button>

            <button
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl text-lg shadow-md hover:bg-gray-300 transition"
              onClick={() => navigate("/signup")}
            >
              Post a Job
            </button>
          </>
        )}
      </div>

        {user && role === "jobseeker" && (
          <p className="mt-4 text-sm text-gray-500">
            You are logged in as a <b>Job Seeker</b>. Recruiters can post jobs.
          </p>
        )}
      </div>

      {/* Category Section */}
      <div className="mt-24 max-w-5xl w-full">
        <h2 className="text-3xl font-semibold mb-6">Popular Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            "Software Development",
            "Data Science",
            "AI & Machine Learning",
            "Web Development",
            "Cyber Security",
            "UI/UX Design",
          ].map((cat) => (
            <div
              key={cat}
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat)}`)}
              className="p-6 bg-white shadow rounded-2xl text-center hover:shadow-lg transition cursor-pointer"
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
