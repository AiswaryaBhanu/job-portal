import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase.config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currUser) => {
      setUser(currUser);

      // default values
      setRole(null);

      if (!currUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", currUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) setRole(snap.data().role);
        else setRole(null);
      } catch (err) {
        console.log("❌ Error fetching role:", err.message);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
