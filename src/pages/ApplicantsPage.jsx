import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase.config";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/login");
    if (role && role !== "recruiter") navigate("/");
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);

        const q = query(
          collection(db, "applications"),
          where("jobId", "==", jobId),
          orderBy("appliedAt", "desc")
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setApps(list);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 font-semibold"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-4">Applicants</h1>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : apps.length === 0 ? (
          <p className="text-gray-600">No applications yet.</p>
        ) : (
          <div className="bg-white rounded-2xl shadow">
            {apps.map((app) => (
              <div
                key={app.id}
                className="p-5 border-b last:border-b-0 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{app.applicantEmail}</p>
                  <p className="text-sm text-gray-500">
                    Applied for: {app.jobTitle} @ {app.company}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {app.status || "applied"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
