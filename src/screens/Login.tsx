import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login 🔐</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;