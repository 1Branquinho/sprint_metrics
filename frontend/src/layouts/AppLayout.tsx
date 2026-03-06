import { NavLink, Outlet } from "react-router-dom";

import { routes } from "@/utils/routes";

import "./AppLayout.css";

const navItems = [
  { to: routes.issues, label: "Issues" },
  { to: routes.sprints, label: "Sprints" },
  { to: routes.collaborators, label: "Collaborators" },
  { to: routes.capacities, label: "Capacities" },
  { to: routes.sprintDashboard, label: "Sprint Dashboard" },
  { to: routes.collaboratorDashboard, label: "Collaborator Dashboard" },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="app-layout__sidebar">
        <div className="brand">
          <span className="brand__title">Sprint Metrics</span>
          <span className="brand__subtitle">Ops + Analytics</span>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                isActive ? "side-nav__item side-nav__item--active" : "side-nav__item"
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-layout__main">
        <header className="topbar">
          <div>
            <h2>Sprint Intelligence Workspace</h2>
            <p>Operational control and delivery analytics in one place.</p>
          </div>
        </header>

        <main className="content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
