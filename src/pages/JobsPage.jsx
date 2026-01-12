import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ filters
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const navigate = useNavigate();
  const { user, role } = useAuth();

  // ✅ store applied jobIds
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  // ✅ read category from URL
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) setCategory(catFromUrl);
  }, [searchParams]);

  // ✅ fetch applied jobs for jobseeker (persistent)
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user || role !== "jobseeker") return;

      try {
        const q = query(
          collection(db, "applications"),
          where("applicantId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const appliedSet = new Set();
        snap.docs.forEach((d) => {
          appliedSet.add(d.data().jobId);
        });

        setAppliedJobs(appliedSet);
      } catch (err) {
        console.log("Error fetching applied jobs:", err);
      }
    };

    fetchAppliedJobs();
  }, [user, role]);

  // ✅ fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setJobs(list);
      } catch (err) {
        console.log("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ✅ Easy Apply
  const handleEasyApply = async (e, job) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (role !== "jobseeker") {
      alert("Only job seekers can apply.");
      return;
    }

    if (appliedJobs.has(job.id)) return;

    try {
      const appId = `${job.id}_${user.uid}`;
      await setDoc(doc(db, "applications", appId), {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        recruiterId: job.createdBy,
        applicantId: user.uid,
        applicantEmail: user.email,
        status: "applied",
        appliedAt: serverTimestamp(),
      });

      alert("✅ Applied successfully!");

      setAppliedJobs((prev) => new Set([...prev, job.id]));
    } catch (err) {
      console.log(err);
      alert("❌ Failed to apply");
    }
  };

  // ✅ Withdraw application
  const handleWithdraw = async (e, job) => {
    e.stopPropagation();

    if (!user) return;

    try {
      const appId = `${job.id}_${user.uid}`;
      await deleteDoc(doc(db, "applications", appId));

      alert("✅ Application withdrawn");

      setAppliedJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    } catch (err) {
      console.log(err);
      alert("❌ Failed to withdraw");
    }
  };

  // ✅ Recruiter delete job (only own jobs shown button)
  const handleDeleteJob = async (e, jobId) => {
    e.stopPropagation();

    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));

      // remove job from UI immediately
      setJobs((prev) => prev.filter((j) => j.id !== jobId));

      alert("✅ Job deleted successfully");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to delete job");
    }
  };

  // ✅ filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTitle = (job.title || "").toLowerCase();
      const jobCompany = (job.company || "").toLowerCase();
      const jobLocation = (job.location || "").toLowerCase();
      const jobType = (job.type || "").toLowerCase();
      const jobCategory = (job.category || "").toLowerCase();

      const searchText = search.toLowerCase();

      const matchSearch =
        jobTitle.includes(searchText) || jobCompany.includes(searchText);

      const matchLocation = location
        ? jobLocation.includes(location.toLowerCase())
        : true;

      const matchType = type === "all" ? true : jobType === type.toLowerCase();

      const matchCategory =
        category === "all" ? true : jobCategory === category.toLowerCase();

      return matchSearch && matchLocation && matchType && matchCategory;
    });
  }, [jobs, search, location, type, category]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Job Listings</h1>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border p-2 rounded"
            placeholder="Search title / company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

          <select
            className="border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Software Development">Software Development</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="UI/UX Design">UI/UX Design</option>
          </select>
        </div>

        <p className="text-gray-600 mb-4">
          Showing <b>{filteredJobs.length}</b> job(s)
        </p>

        {loading ? (
          <p className="text-gray-600">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="text-gray-600">No jobs match your filters.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
              >
                {/* TOP */}
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{job.title}</h2>
                      <p className="text-gray-600">{job.company}</p>
                    </div>

                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {job.type || "Job"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">{job.location}</p>

                  {job.category && (
                    <p className="mt-2 text-sm text-gray-700">
                      Category:{" "}
                      <span className="font-medium">{job.category}</span>
                    </p>
                  )}

                  <p className="mt-2 font-semibold">{job.salary}</p>

                  <p className="mt-3 text-gray-600 line-clamp-2">{job.desc}</p>
                </div>

                {/* ✅ BOTTOM */}
                <div className="mt-4 flex justify-between items-center">
                  {/* recruiter delete */}
                  {user &&
                    role === "recruiter" &&
                    job.createdBy === user.uid && (
                      <button
                        onClick={(e) => handleDeleteJob(e, job.id)}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}

                  {/* jobseeker apply / withdraw */}
                  <div className="ml-auto">
                    {user && role === "jobseeker" && (
                      appliedJobs.has(job.id) ? (
                        <button
                          onClick={(e) => handleWithdraw(e, job)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600"
                        >
                          Withdraw
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEasyApply(e, job)}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700"
                        >
                          Easy Apply
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
