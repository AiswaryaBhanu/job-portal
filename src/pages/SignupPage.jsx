import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase.config";

function SignupPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // ✅ first user selects

  // common fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // job seeker fields
  const [university, setUniversity] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  // recruiter fields
  const [company, setCompany] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ validations
    if (!role) {
      setError("Please choose Recruiter or Job Seeker");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ✅ role-based validation
    if (role === "jobseeker") {
      if (!university || !cgpa) {
        setError("Job Seeker must fill university, cgpa, resume link");
        return;
      }
      if (resumeLink && !resumeLink.startsWith("http")) {
        setError("Please enter a valid resume drive link");
        return;
      }
    }

    if (role === "recruiter") {
      if (!company) {
        setError("Recruiter must fill company & LinkedIn link");
        return;
      }
      if (linkedinLink && !linkedinLink.startsWith("http")) {
        setError("Please enter a valid LinkedIn link");
        return;
      }
    }

    try {
      setLoading(true);

      // ✅ create auth user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // ✅ store role-based profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        role, // "jobseeker" or "recruiter"
        email: user.email,
        name,
        phone,

        // job seeker fields
        university: role === "jobseeker" ? university : "",
        cgpa: role === "jobseeker" ? cgpa : "",
        resumeLink: role === "jobseeker" ? resumeLink : "",

        // recruiter fields
        company: role === "recruiter" ? company : "",
        linkedinLink: role === "recruiter" ? linkedinLink : "",

        createdAt: serverTimestamp(),
      });

      alert("✅ Account created successfully!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>

        {/* ✅ Role selection */}
        <label className="text-sm font-medium">Signup as</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Select</option>
          <option value="jobseeker">Job Seeker</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {/* ✅ common fields */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 mb-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone Number"
          className="w-full p-2 mb-3 border rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-4 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* ✅ job seeker fields */}
        {role === "jobseeker" && (
          <>
            <input
              type="text"
              placeholder="University"
              className="w-full p-2 mb-3 border rounded"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />

            <input
              type="text"
              placeholder="CGPA"
              className="w-full p-2 mb-3 border rounded"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
            />

            <input
              type="text"
              placeholder="Resume Drive Link"
              className="w-full p-2 mb-3 border rounded"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />

            <p className="text-xs text-gray-500 mb-4">
              Make sure resume is public: Drive → Share → Anyone with link can view
            </p>
          </>
        )}

        {/* ✅ recruiter fields */}
        {role === "recruiter" && (
          <>
            <input
              type="text"
              placeholder="Company Name"
              className="w-full p-2 mb-3 border rounded"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

            <input
              type="text"
              placeholder="Recruiter LinkedIn Link"
              className="w-full p-2 mb-4 border rounded"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
            />
          </>
        )}

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 text-white rounded ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
