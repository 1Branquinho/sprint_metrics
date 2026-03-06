import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { CapacitiesPage } from "@/pages/CapacitiesPage";
import { CollaboratorsPage } from "@/pages/CollaboratorsPage";
import { IssuesPage } from "@/pages/IssuesPage";
import { SprintsPage } from "@/pages/SprintsPage";
import { routes } from "@/utils/routes";

const SprintDashboardPage = lazy(() =>
  import("@/pages/SprintDashboardPage").then((module) => ({ default: module.SprintDashboardPage })),
);

const CollaboratorDashboardPage = lazy(() =>
  import("@/pages/CollaboratorDashboardPage").then((module) => ({
    default: module.CollaboratorDashboardPage,
  })),
);

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p style={{ margin: 0 }}>Loading dashboard module...</p>}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate replace to={routes.issues} /> },
      { path: routes.issues, element: <IssuesPage /> },
      { path: routes.sprints, element: <SprintsPage /> },
      { path: routes.collaborators, element: <CollaboratorsPage /> },
      { path: routes.capacities, element: <CapacitiesPage /> },
      {
        path: routes.sprintDashboard,
        element: (
          <LazyPage>
            <SprintDashboardPage />
          </LazyPage>
        ),
      },
      {
        path: routes.collaboratorDashboard,
        element: (
          <LazyPage>
            <CollaboratorDashboardPage />
          </LazyPage>
        ),
      },
      { path: "*", element: <Navigate replace to={routes.issues} /> },
    ],
  },
]);
