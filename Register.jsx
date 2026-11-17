import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }
  function submit(e) {
    e.preventDefault(); setError(""); setSuccess("");
    if (Object.values(form).some((value) => !value.trim())) return setError("Please fill in every field.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Enter a valid email address.");
    if (form.password.length < 6) return setError("Password must contain at least 6 characters.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    const result = register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
    if (!result.success) return setError(result.message);
    setSuccess("Account created successfully. Redirecting to login...");
    setTimeout(() => navigate("/login"), 900);
  }

  return <AuthPage title="Create your account" subtitle="Start building healthier money habits.">
    <form onSubmit={submit}>
      <label className="form-label">Full name</label><input className="form-control auth-input mb-3" name="name" value={form.name} onChange={change} placeholder="Your name" />
      <label className="form-label">Email address</label><input className="form-control auth-input mb-3" name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" />
      <label className="form-label">Password</label><input className="form-control auth-input mb-3" name="password" type="password" value={form.password} onChange={change} placeholder="At least 6 characters" />
      <label className="form-label">Confirm password</label><input className="form-control auth-input mb-3" name="confirmPassword" type="password" value={form.confirmPassword} onChange={change} placeholder="Re-enter password" />
      {error && <div className="alert alert-danger py-2">{error}</div>}{success && <div className="alert alert-success py-2">{success}</div>}
      <button className="btn btn-primary w-100 py-2 mt-2">Create account</button>
    </form>
    <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
  </AuthPage>;
}

function AuthPage({ title, subtitle, children }) {
  return <div className="auth-page"><div className="auth-brand"><span className="brand-mark"><i className="bi bi-wallet2" /></span><span className="brand-name">PennyWise</span></div><div className="auth-card"><div className="auth-icon"><i className="bi bi-person-plus" /></div><h1>{title}</h1><p>{subtitle}</p>{children}</div><div className="auth-footnote">Your finances, made clearer.</div></div>;
}