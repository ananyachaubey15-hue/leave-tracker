import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import type { User } from "firebase/auth";

type AuthMode = "guest" | "user" | "loading";

interface AuthContextType {
  user: User | null;
  mode: AuthMode;
  loginWithGoogle: () => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>("loading");

  useEffect(() => {
  setMode("loading");

  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log("Auth state changed:", firebaseUser);
    if (firebaseUser) {
      setUser(firebaseUser);
      setMode("user");
    } else {
      setUser(null);
      setMode("guest");
    }
  });

  return () => unsubscribe();
}, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const continueAsGuest = () => {
    setUser(null);
    setMode("guest");
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setMode("guest");
  };

  return (
    <AuthContext.Provider
      value={{ user, mode, loginWithGoogle, continueAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}