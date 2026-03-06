# Frontend Spec (Sprint Metrics)

## 1. Purpose
This document defines the product, UX, technical architecture, API contracts, and delivery criteria for the Sprint Metrics frontend.

Goal: build a robust frontend that is operationally useful and analytically trustworthy, without duplicating backend domain logic.

## 2. Product Scope

### 2.1 Core capabilities
- CRUD operations
  - Issues
  - Sprints
  - Collaborators
  - Capacities (by sprint/collaborator)
- Sprint analytical dashboard
  - KPI cards
  - Burndown
  - Status breakdown
  - Assignee summary
- Collaborator analytical dashboard
  - Individual KPIs
  - Individual burndown
  - Daily completed points
  - Status breakdown
- Configurable widgets (controlled presets)

### 2.2 Non-goals
- No heavy analytics computed in frontend.
- No duplicated business rules already implemented in backend (example: `done_at` behavior).
- No fully generic BI builder in v1.

## 3. Frontend Stack
- React
- Vite
- TypeScript
- React Router
- TanStack Query
- Recharts
- CSS baseline (can migrate to Tailwind later)

## 4. Information Architecture

### 4.1 Main pages
- `IssuesPage`
- `SprintsPage`
- `CollaboratorsPage`
- `CapacitiesPage`
- `SprintDashboardPage`
- `CollaboratorDashboardPage`

### 4.2 Shared infrastructure
- `api/`
- `hooks/`
- `components/`
- `types/`
- `routes/`
- `layouts/`
- `utils/`

### 4.3 Proposed folder layout
```text
src/
  api/
    client.ts
    issues.ts
    sprints.ts
    collaborators.ts
    capacities.ts
    metrics.ts
    collaboratorMetrics.ts

  components/
    common/
    forms/
    tables/
    charts/
    dashboard/
    widgets/

  hooks/
    useIssues.ts
    useSprints.ts
    useCollaborators.ts
    useCapacities.ts
    useSprintMetrics.ts
    useCollaboratorMetrics.ts
    useWidgets.ts

  layouts/
    AppLayout.tsx

  pages/
    IssuesPage.tsx
    SprintsPage.tsx
    CollaboratorsPage.tsx
    CapacitiesPage.tsx
    SprintDashboardPage.tsx
    CollaboratorDashboardPage.tsx

  routes/
    index.tsx

  types/
    common.ts
    issue.ts
    sprint.ts
    collaborator.ts
    capacity.ts
    metrics.ts
    widgets.ts

  utils/
    date.ts
    format.ts
    charts.ts
    query.ts

  App.tsx
  main.tsx
```

## 5. UX and Interaction Rules

### 5.1 Global rules
- Every list view must support:
  - Loading state
  - Empty state
  - Error state with retry
  - Pagination (`limit`, `offset`)
- Any filter change resets `offset` to `0`.
- URL query params reflect page state (`filters`, `limit`, `offset`) for shareable views.
- Mutations should show explicit feedback (`success` and `error` toast/alert).

### 5.2 Modal and form rules
- `Create` and `Edit` forms share the same form component.
- Delete actions require confirmation.
- Unsaved changes in modal must show discard confirmation.

### 5.3 Date and numbers
- Dates from API treated as UTC-safe strings and formatted in UI only.
- Story points and counts displayed as integers.

## 6. API Contract Strategy (Critical)

### 6.1 Existing backend endpoints (already available)
- `GET /issues`
- `POST /issues`
- `PUT /issues/{issue_id}`
- `DELETE /issues/{issue_id}`
- `GET /sprints`
- `POST /sprints`
- `GET /collaborators`
- `POST /collaborators`
- `GET /capacities`
- `POST /capacities`
- `GET /metrics/sprint/{sprint_number}`

### 6.2 Missing endpoints required for full viability
To make `CollaboratorDashboardPage` and advanced widgets viable without frontend analytics duplication, backend must expose collaborator-centric metrics.

Required:
- `GET /metrics/collaborator/{collaborator_id}`
  - Query params: `sprint_number` (optional), `from`, `to` (optional)
  - Returns:
    - KPIs (done/open points and issues, avg points done issue, optional lead time)
    - Daily completed series
    - Individual burndown series
    - Status totals

Optional for widget expansion:
- `GET /metrics/collaborator/{collaborator_id}/lead-time-trend`
- `GET /metrics/collaborator/{collaborator_id}/cumulative-flow`

## 7. Type Contracts

### 7.1 Core types
```ts
type IssueStatus = "TODO" | "DOING" | "CODE REVIEW" | "TESTING" | "DONE"

type Page<T> = {
  items: T[]
  total: number
  limit: number
  offset: number
}
```

### 7.2 Issue
```ts
type Issue = {
  id: number
  sprint_number: number
  issue_number: string
  gitlab_url: string | null
  title: string
  story_points: number
  assignee_id: number
  status: IssueStatus
  created_at: string
  work_day: string
  done_at: string | null
}
```

### 7.3 Sprint metrics response
Mirror backend contracts:
- `SprintInfo`
- `StatusTotals`
- `AssigneeSummary`
- `BurndownSeries`

### 7.4 Widget config contract (controlled)
```ts
type WidgetType =
  | "burndown"
  | "daily_completed"
  | "status_breakdown"
  | "issues_table"
  | "lead_time_trend"

type ChartType = "bar" | "line" | "area" | "pie" | "table"
type Metric = "points" | "issues" | "lead_time_days"
type GroupBy = "day" | "status" | "assignee" | "sprint"

type WidgetFilter = {
  sprint_number?: number
  collaborator_id?: number
  status?: IssueStatus
  from?: string
  to?: string
}

type WidgetConfig = {
  id: string
  type: WidgetType
  chartType: ChartType
  metric: Metric
  groupBy: GroupBy
  filters: WidgetFilter
}
```

## 8. Widget System Strategy
- Widgets are preset-driven, not free-form BI.
- Each widget type has allowed combinations:
  - Example: `burndown` allows `line/area`; does not allow `pie`.
- Invalid combinations are blocked in UI.
- Persistence v1:
  - default: localStorage
  - optional: backend persistence later

## 9. Data Layer Standards

### 9.1 API client
- Single `client.ts` with:
  - `baseURL` from env (`VITE_API_BASE_URL`)
  - request timeout
  - normalized error parser

### 9.2 TanStack Query conventions
- Query keys are centralized and stable.
- Mutations invalidate only affected resources.
- Keep stale-time short on operational pages; longer on dashboards if needed.

## 10. Layout and Design Baseline
- App shell: sidebar + header + content.
- Design tokens minimum:
  - spacing scale
  - color palette
  - typography scale
  - border radius and elevation
- Component baseline required before full page build:
  - Button
  - Input
  - Select
  - Badge
  - Card
  - Table
  - Modal
  - Pagination

## 11. Testing Strategy

### 11.1 Frontend test layers
- Unit: formatters, small UI primitives.
- Integration: page + hooks + query with API mocks.
- E2E: critical user flows.

### 11.2 Minimum acceptance E2E flows
- Issues CRUD + filters + pagination.
- Update issue status and verify reflected state.
- Sprint dashboard loads selected sprint and renders charts.
- Collaborator dashboard loads selected collaborator and sprint.

## 12. Observability and Reliability
- Global error boundary.
- Standard API error component.
- Client-side logging hooks for request failures.
- Basic performance checks on dashboard load and render.

## 13. Security and Config
- Env vars:
  - `VITE_API_BASE_URL`
- No secrets in frontend bundle.
- CORS must allow frontend origin(s).

## 14. Delivery Plan (No shortcuts)

### Phase 1: Foundation
- Vite + TS setup
- Router + app layout
- API client + types
- Query provider
- Core UI primitives

### Phase 2: Operational pages
- Issues page full (filters, pagination, create/edit/delete)
- Sprints page full
- Collaborators page full
- Capacities page full

### Phase 3: Sprint analytics
- Sprint dashboard page
- KPI cards
- Burndown chart
- Status breakdown chart
- Assignee summary table

### Phase 4: Collaborator analytics
- Collaborator dashboard page
- Collaborator KPIs
- Daily completed chart
- Individual burndown
- Status breakdown

### Phase 5: Configurable widgets
- Preset-driven widget catalog
- Widget configuration panel
- Dashboard composition persistence

## 15. Definition of Done
A phase is done only if all are true:
- Feature implemented with strong typing.
- Loading/empty/error states implemented.
- Query invalidation and refetch behavior verified.
- Tests for critical flows added.
- No duplicated backend domain logic in frontend.
- Documentation updated.

## 16. Open Decisions (Must be closed before coding dashboards)
- Final collaborator metrics endpoint payload.
- Lead time definition (start/end timestamps and edge cases).
- Widget persistence target (localStorage vs backend).
- Initial design token palette.
