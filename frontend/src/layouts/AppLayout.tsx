import { NavLink, Outlet } from "react-router-dom";

import { routes } from "@/utils/routes";

import "./AppLayout.css";

const navItems = [
  { to: routes.issues, label: "Issues" },
  { to: routes.sprints, label: "Sprints" },
  { to: routes.collaborators, label: "Colaboradores" },
  { to: routes.capacities, label: "Capacidades" },
  { to: routes.sprintDashboard, label: "Painel da Sprint" },
  { to: routes.collaboratorDashboard, label: "Painel Individual" },
];

export function AppLayout() {
  return (
    <div className="app-layout">
      <aside className="app-layout__sidebar">
        <div className="brand">
          <span className="brand__title">Sprint Metrics</span>
          <span className="brand__subtitle">Operacao e Analytics</span>
        </div>

        <nav className="side-nav" aria-label="Navegacao principal">
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
            <h2>Painel de Entrega da Sprint</h2>
            <p>Controle operacional e visao analitica em um fluxo unico.</p>
          </div>
        </header>

        <main className="content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}