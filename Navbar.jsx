import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate("/login", { replace: true }); }
  return (
    <header className="topbar">
      <div className="d-flex align-items-center gap-2">
        <span className="brand-mark"><i className="bi bi-wallet2" /></span>
        <span className="brand-name">PennyWise</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div className="user-chip"><span className="avatar">{user?.name?.[0]?.toUpperCase()}</span><span className="d-none d-sm-inline">{user?.name}</span></div>
        <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}><i className="bi bi-box-arrow-right me-1" />Logout</button>
      </div>
    </header>
  );
}