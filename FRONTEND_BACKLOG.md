# Frontend Backlog (Sprint Metrics)

## 1. Execution Principles
- No frontend domain rule duplication.
- API-first for dashboards.
- Every deliverable includes loading/empty/error states.
- Every page must be navigable directly via URL.

## 2. Milestones
- M1: Foundation and app shell
- M2: Operational CRUD pages
- M3: Sprint dashboard
- M4: Collaborator dashboard
- M5: Widget system

## 3. Epic Breakdown

## EPIC A - Foundation
Status: Ready
Depends on: none

### A1. Project scaffold
- Create Vite + React + TypeScript app in `frontend/`
- Add routing, query provider, app layout
- Add env handling (`VITE_API_BASE_URL`)
Acceptance:
- App boots
- Routes render inside layout shell

### A2. Base architecture
- Create folder structure from `FRONTEND_SPEC.md`
- Create `api/client.ts` and query key helpers
- Create common type modules
Acceptance:
- Build passes with no unresolved imports
- API client can call backend health endpoint

### A3. UI primitives
- Implement base components: Button, Input, Select, Badge, Card, Modal, Table, Pagination
- Create design tokens (spacing, typography, colors)
Acceptance:
- Story/demo page with all primitives
- Responsive behavior verified on desktop/mobile widths

### A4. App quality baseline
- Add frontend lint/format/typecheck scripts
- Add frontend test setup (unit + integration base)
Acceptance:
- CI runs lint/typecheck/tests for frontend

## EPIC B - Issues Page (Operational Core)
Status: Ready
Depends on: EPIC A

### B1. Types and API
- Add `Issue` and `Page<T>` types
- Implement `issues.ts` API calls (list/create/update/delete)
Acceptance:
- API layer typed and covered by basic integration mocks

### B2. Query hooks
- `useIssues`, `useCreateIssue`, `useUpdateIssue`, `useDeleteIssue`
- Proper invalidation strategy on mutation
Acceptance:
- Mutations refresh visible list correctly

### B3. UI and interactions
- Build `IssueFilters`, `IssueTable`, `IssueFormModal`, `IssueStatusBadge`, `Pagination`
- Filters: sprint, assignee, status
- Table fields from spec
Acceptance:
- Full CRUD + filters + pagination functional
- `offset` resets on filter change

### B4. State UX
- Loading skeleton
- Empty state
- Error with retry
Acceptance:
- All states verifiably rendered

## EPIC C - Sprints Page
Status: Ready
Depends on: EPIC A

### C1. API + hooks
- `sprints.ts`, `useSprints`, `useCreateSprint`, `useUpdateSprint` (if endpoint exists)
Acceptance:
- List/create available in UI

### C2. UI
- `SprintTable`, `SprintFormModal`, optional `SprintCard`
- Include "Open Dashboard" action
Acceptance:
- User can create sprint and navigate to sprint dashboard selection

## EPIC D - Collaborators Page
Status: Ready
Depends on: EPIC A

### D1. API + hooks
- `collaborators.ts`, `useCollaborators`, `useCreateCollaborator`, `useUpdateCollaborator` (if endpoint exists)
Acceptance:
- List/create/filter by `active`

### D2. UI
- `CollaboratorTable`, `CollaboratorFormModal`, `CollaboratorStatusBadge`
- Include "Open Collaborator Dashboard" action
Acceptance:
- Navigation to collaborator dashboard with selected collaborator context

## EPIC E - Capacities Page
Status: Ready
Depends on: EPIC A, EPIC C, EPIC D

### E1. API + hooks
- `capacities.ts`, `useCapacities`, `useCreateCapacity`, `useUpdateCapacity`, `useDeleteCapacity`
Acceptance:
- Capacity listing and creation stable

### E2. UI
- `CapacityFilters`, `CapacityTable`, `CapacityFormModal`
Acceptance:
- Filter by sprint/collaborator
- Duplicate protection handled via backend 409 feedback

## EPIC F - Sprint Dashboard
Status: Ready
Depends on: EPIC A, backend `/metrics/sprint/{n}`

### F1. Contract and hooks
- Strong types for sprint metrics payload
- `useSprintMetrics(sprintNumber)`
Acceptance:
- Typed payload drives all widgets

### F2. Dashboard components
- `SprintSelector`
- KPI cards
- `BurndownChart`
- `StatusBreakdownChart`
- `AssigneeSummaryTable`
Acceptance:
- Selecting sprint updates full page data
- Charts/tables match backend payload values

### F3. Dashboard UX
- Unified loading/error/empty handling
Acceptance:
- Clear state transitions when sprint changes

## EPIC G - Collaborator Dashboard
Status: Blocked (backend endpoint missing)
Depends on: EPIC A + new backend contract

### G0. Backend dependency
Required endpoint:
- `GET /metrics/collaborator/{collaborator_id}` with optional `sprint_number`

### G1. Types and hooks
- Add `types/collaboratorMetrics.ts`
- Add `useCollaboratorMetrics`
Acceptance:
- Hook returns typed data with controlled query states

### G2. UI components
- `CollaboratorSelector`
- KPI grid
- `DailyCompletedChart`
- `IndividualBurndownChart`
- status breakdown
Acceptance:
- Collaborator + sprint selection updates all sections

## EPIC H - Widgets (Controlled Config)
Status: Partially blocked (depends on collaborator metrics contracts)
Depends on: EPIC F and EPIC G

### H1. Widget model
- Implement `WidgetConfig` types
- Define allowed combinations matrix
Acceptance:
- Invalid chart/metric/groupBy combinations blocked in UI

### H2. Widget renderer
- Build `WidgetContainer` and preset renderers
- Support: burndown, daily completed, status breakdown, issues table
Acceptance:
- Each preset renders with configurable options

### H3. Persistence
- Persist widget layout/config in localStorage (v1)
Acceptance:
- Dashboard restores widget settings after reload

## EPIC I - Reliability and Testing
Status: Ongoing
Depends on each epic

### I1. Unit tests
- Format/date utils
- Widget config validators

### I2. Integration tests
- Page-level flows with API mocking

### I3. E2E tests
- Critical flows:
  - Issues CRUD -> reflected in sprint dashboard
  - Sprint dashboard selection and render
  - Collaborator dashboard selection and render

Acceptance:
- Critical flows green in CI

## 4. Dependency Graph
- A -> B,C,D
- C,D -> E
- A + backend sprint metrics -> F
- A + backend collaborator metrics -> G
- F + G -> H
- I runs across all epics

## 5. Implementation Order (Recommended)
1. EPIC A
2. EPIC B
3. EPIC C
4. EPIC D
5. EPIC E
6. EPIC F
7. Backend collaborator metrics endpoint
8. EPIC G
9. EPIC H
10. EPIC I hardening pass

## 6. Current Blockers
- Missing backend collaborator metrics endpoint(s).
- Need confirmation for lead time definition.
- Need decision for widget persistence (localStorage approved as v1 default).

## 7. Ready-Now Sprint Plan
If development starts now with no backend collaborator endpoint yet:
- Sprint 1: EPIC A + B
- Sprint 2: EPIC C + D + E
- Sprint 3: EPIC F + reliability pass
- Sprint 4: G (after backend) + H

## 8. Definition of Done (Global)
- Typed API contracts and no `any` in feature code.
- UX states complete (loading/empty/error).
- Query invalidation verified.
- Tests added for critical behavior.
- Documentation updated for new features.
