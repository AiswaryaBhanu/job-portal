import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function RecruiterProfile() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (role && role !== "recruiter") {
      navigate("/");
      return;
    }
  }, [user, role, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          setCompany(data.company || "");
          setLinkedinLink(data.linkedinLink || "");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    if (!name || !company) {
      alert("Name and company are required");
      return;
    }

    if (linkedinLink && !linkedinLink.startsWith("http")) {
      alert("Enter valid LinkedIn URL");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "users", user.uid), {
        name,
        phone,
        company,
        linkedinLink,
      });

      alert("✅ Profile updated!");
    } catch (err) {
      console.log(err);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-2">Recruiter Profile</h1>
        <p className="text-gray-600 mb-8">
          Manage your recruiter details
        </p>

        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              className="w-full p-2 border rounded mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full p-2 border rounded mt-1 bg-gray-100"
              value={user?.email || ""}
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone (optional)</label>
            <input
              className="w-full p-2 border rounded mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company</label>
            <input
              className="w-full p-2 border rounded mt-1"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">LinkedIn URL</label>
            <input
              className="w-full p-2 border rounded mt-1"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-8 w-full p-3 rounded-xl text-white font-semibold ${
            saving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
