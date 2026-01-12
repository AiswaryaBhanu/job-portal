import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RecruiterDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // redirect if not recruiter
  useEffect(() => {
    if (!user) navigate("/login");
    if (role && role !== "recruiter") navigate("/");
  }, [user, role, navigate]);

  // fetch recruiter jobs only
  useEffect(() => {
    const fetchMyJobs = async () => {
      if (!user) return;

      try {
        setLoading(true);

        const q = query(
          collection(db, "jobs"),
          where("createdBy", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setJobs(list);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [user]);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("Delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert("Job deleted");
    } catch (err) {
      console.log(err);
      alert("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>

          <button
            onClick={() => navigate("/post-job")}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            + Post Job
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">
            You have not posted any jobs yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>

                <div className="mt-2 text-sm text-gray-500">
                  <p>📍 {job.location}</p>
                  <p>🕒 {job.type}</p>
                  <p>🏷️ {job.category}</p>
                </div>

                <p className="mt-3 font-semibold">{job.salary}</p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => navigate(`/recruiter/applicants/${job.id}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    View Applicants
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
