import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { CapacitiesPage } from "@/pages/CapacitiesPage";
import { CollaboratorDashboardPage } from "@/pages/CollaboratorDashboardPage";
import { CollaboratorsPage } from "@/pages/CollaboratorsPage";
import { IssuesPage } from "@/pages/IssuesPage";
import { SprintDashboardPage } from "@/pages/SprintDashboardPage";
import { SprintsPage } from "@/pages/SprintsPage";
import { routes } from "@/utils/routes";

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
      { path: routes.sprintDashboard, element: <SprintDashboardPage /> },
      { path: routes.collaboratorDashboard, element: <CollaboratorDashboardPage /> },
      { path: "*", element: <Navigate replace to={routes.issues} /> },
    ],
  },
]);
