import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getUserAccount } from "./firestore";

const AuthContext = createContext({ user: null, loading: true, account: null, accountLoading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [accountLoading, setAccountLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
      if (!u) {
        setAccount(null);
        setAccountLoading(false);
        return;
      }
      setAccountLoading(true);
      getUserAccount(u.uid)
        .then((data) => setAccount(data))
        .catch(() => setAccount(null))
        .finally(() => setAccountLoading(false));
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, account, accountLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

