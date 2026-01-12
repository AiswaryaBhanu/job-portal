import { useState,useEffect } from "react";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";

export default function PostJob() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [location, setLocation] = useState("");

  // new fields for filtering
  const [type, setType] = useState("Full-time");
  const [category, setCategory] = useState("Software Development");

  const [salary, setSalary] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchCompany = async () => {
            if (!user) return;

            try {
            setProfileLoading(true);
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const data = snap.data();
                if (data.company) setCompany(data.company);
            }
            } catch (err) {
            console.log("Error fetching recruiter profile:", err);
            } finally {
            setProfileLoading(false);
            }
        };
        fetchCompany();
    }, [user]);


  const handlePostJob = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (role !== "recruiter") {
      alert("Only recruiters can post jobs!");
      return;
    }

    if (!title || !company || !location || !salary || !desc) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        type,       
        category,  
        salary,
        desc,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      console.log(err);
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <form
        onSubmit={handlePostJob}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Post a Job
        </h2>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
            className="w-full p-2 mb-3 border rounded bg-gray-100"
            placeholder="Company Name"
            value={company}
            disabled
        />

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        {/*Job Type */}
        <select
          className="w-full p-2 mb-3 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        {/*Category */}
        <select
          className="w-full p-2 mb-3 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Software Development">Software Development</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="AI & Machine Learning">AI & Machine Learning</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="UI/UX Design">UI/UX Design</option>
        </select>

        <input
          className="w-full p-2 mb-3 border rounded"
          placeholder="Salary (ex: 8 LPA / 30k per month)"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-4 border rounded"
          placeholder="Job Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
