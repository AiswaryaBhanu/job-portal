import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function JobSeekerDashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // protect route
  useEffect(() => {
    if (!user) navigate("/login");
    if (role && role !== "jobseeker") navigate("/");
  }, [user, role, navigate]);

  // fetch applications
  useEffect(() => {
    const fetchApps = async () => {
      if (!user || role !== "jobseeker") return;

      try {
        setLoading(true);

        const q = query(
          collection(db, "applications"),
          where("applicantId", "==", user.uid),
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

    fetchApps();
  }, [user, role]);

  const handleWithdraw = async (jobId) => {
    if (!user) return;

    const confirmWithdraw = window.confirm("Withdraw this application?");
    if (!confirmWithdraw) return;

    try {
      const appId = `${jobId}_${user.uid}`;
      await deleteDoc(doc(db, "applications", appId));

      setApps((prev) => prev.filter((a) => a.jobId !== jobId));
      alert("Withdrawn successfully");
    } catch (err) {
      console.log(err);
      alert("Failed to withdraw");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Job Seeker Dashboard</h1>

          <button
            onClick={() => navigate("/jobs")}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Browse Jobs
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading applications...</p>
        ) : apps.length === 0 ? (
          <p className="text-gray-600">
            You haven’t applied to any job yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h2 className="text-xl font-semibold">{app.jobTitle}</h2>
                <p className="text-gray-600">{app.company}</p>

                <p className="mt-2 text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-semibold text-blue-700">
                    {app.status || "applied"}
                  </span>
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => navigate(`/jobs/${app.jobId}`)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    View Job
                  </button>

                  <button
                    onClick={() => handleWithdraw(app.jobId)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Withdraw
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
