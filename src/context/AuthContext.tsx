"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase/client";
import type { UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult(true);
        const userRole = (tokenResult.claims.role as UserRole) || null;
        setRole(userRole);
        const idToken = await firebaseUser.getIdToken();
        Cookies.set("zetplay_session", idToken, { expires: 1, sameSite: "strict" });
      } else {
        setRole(null);
        Cookies.remove("zetplay_session");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    Cookies.remove("zetplay_session");
  };

  const value = useMemo(() => ({ user, role, loading, signOut }), [user, role, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
