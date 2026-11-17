import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  if (user) return <Navigate to="/" replace />;

  function submit(e) {
    e.preventDefault(); setError("");
    if (!email.trim() || !password) return setError("Enter your email and password.");
    const result = login(email.trim(), password);
    if (!result.success) return setError(result.message);
    navigate("/", { replace: true });
  }

  return <div className="auth-page"><div className="auth-brand"><span className="brand-mark"><i className="bi bi-wallet2" /></span><span className="brand-name">PennyWise</span></div><div className="auth-card"><div className="auth-icon"><i className="bi bi-person-check" /></div><h1>Welcome back</h1><p>Sign in to continue to your dashboard.</p>
    <form onSubmit={submit}><label className="form-label">Email address</label><input className="form-control auth-input mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /><label className="form-label">Password</label><input className="form-control auth-input mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />{error && <div className="alert alert-danger py-2">{error}</div>}<button className="btn btn-primary w-100 py-2 mt-2">Sign in</button></form>
    <p className="auth-footer">Don't have an account? <Link to="/register">Create account</Link></p></div><div className="auth-footnote">Your finances, made clearer.</div></div>;
}