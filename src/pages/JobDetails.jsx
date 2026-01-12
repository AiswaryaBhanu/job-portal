import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobDetails() {
  const { id } = useParams(); // job id from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  // fetch single job from firestore using job id
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);

        const jobRef = doc(db, "jobs", id);
        const snap = await getDoc(jobRef);

        if (snap.exists()) {
          setJob({ id: snap.id, ...snap.data() });
        } else {
          setJob(null);
        }
      } catch (err) {
        console.log("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="p-6">Loading job...</p>;
  if (!job) return <p className="p-6 text-red-600">Job not found ❌</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-gray-600 text-lg">{job.company}</p>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            📍 {job.location}
          </span>

          {job.type && (
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              🕒 {job.type}
            </span>
          )}

          {job.category && (
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              🏷️ {job.category}
            </span>
          )}
        </div>

        <p className="mt-4 text-xl font-semibold">💰 {job.salary}</p>

        <p className="mt-2 text-gray-700 whitespace-pre-wrap">
            {job.description}
        </p>


        <p className="mt-2 text-gray-700 leading-relaxed">{job.desc}</p>
      </div>
      {/* Easy Apply UI */}
      <div className="mt-8">
          {user && role === "jobseeker" ? (
            <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
                Easy Apply
            </button>
           ) : !user ? (
            <p className="text-gray-500">Login to apply for this job.</p>
            ) : (
            <p className="text-gray-500">Recruiters cannot apply.</p>
            )}
        </div>

    </div>
  );
}
