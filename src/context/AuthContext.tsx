import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { auth } from "../services/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import type { User } from "firebase/auth";

interface AuthContextType {

  user: User | null;

  loading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  signup: (
    email: string,
    password: string
  ) => Promise<void>;

  googleLogin: () => Promise<void>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | null>(
    null
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (firebaseUser) => {

          setUser(firebaseUser);

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  // EMAIL LOGIN
  const login = async (
    email: string,
    password: string
  ) => {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  // EMAIL SIGNUP
  const signup = async (
    email: string,
    password: string
  ) => {

    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  // GOOGLE LOGIN
  const googleLogin = async () => {

    const provider =
      new GoogleAuthProvider();

    await signInWithRedirect(
      auth,
      provider
    );
  };

  // LOGOUT
  const logout = async () => {

    await signOut(auth);
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        googleLogin,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}