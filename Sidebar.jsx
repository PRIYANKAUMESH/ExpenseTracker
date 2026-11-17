import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Overview", icon: "bi-grid" },
  { to: "/transactions", label: "Transactions", icon: "bi-arrow-left-right" },
  { to: "/analytics", label: "Analytics", icon: "bi-bar-chart" }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-label">WORKSPACE</div>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
          <i className={`bi ${link.icon}`} /><span>{link.label}</span>
        </NavLink>
      ))}
      <div className="sidebar-tip mt-auto">
        <i className="bi bi-lightbulb" />
        <strong>Small steps add up</strong>
        <span>Track your spending and build better money habits.</span>
      </div>
    </aside>
  );
}