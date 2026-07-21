# Hospital Management System

A professional MERN Stack Hospital Management System built with React, Express, MongoDB, TypeScript, authentication, role-based authorization, dashboards, and modular hospital workflows.

## Project Goal

Build a production-minded portfolio project that demonstrates the complete software development lifecycle: planning, architecture, database design, API design, frontend implementation, secure authentication, testing, deployment, and documentation.

## User Roles

- Super Admin
- Admin
- Doctor
- Nurse
- Receptionist
- Pharmacist
- Lab Technician
- Patient

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, shadcn/ui-ready structure, React Router, TanStack Query, Zustand, Axios, React Hook Form, Zod
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod validation
- Tooling: npm workspaces, ESLint, Prettier, Husky, lint-staged
- Deployment target: MongoDB Atlas, cloud backend host, static frontend host

## Project Structure

```text
HMS/
  apps/
    api/      Express + TypeScript + MongoDB API
    web/      Vite + React + Tailwind frontend
  docs/       Architecture, API, database, and workflow docs
  packages/   Future shared packages
```

## Quick Start

```bash
npm install
cp apps/api/.env.example apps/api/.env
npm run dev
```

The API runs on `http://localhost:5000` and the web app runs on `http://localhost:5173`.

## Zero to Hero Roadmap

Project status:

- Completed: planning, base design, local project setup, dependency installation, local Git setup, first commit, GitHub remote connection.
- In progress: UI design and real feature development.
- Next phase: authentication and role-based authorization.

### Phase 1: Planning - Done

- [x] Choose the project name: Hospital Management System
- [x] Write the project goal
- [x] Identify all user roles
- [x] List all project features
- [x] Decide the technology stack
- [x] Create a README.md file
- [x] Add the project roadmap to the README
- [x] Create a local Git repository
- [x] Create the first commit
- [x] Connect the local repository to GitHub
- [x] Push the setup to GitHub

### Phase 2: Design - Mostly Done

- [x] Draw the system architecture in `docs/architecture.md`
- [x] Design the database plan in `docs/database-design.md`
- [x] Design the API plan in `docs/api-design.md`
- [x] Plan the folder structure
- [ ] Create UI wireframes for login, dashboard, patients, doctors, appointments, billing, pharmacy, and laboratory

### Phase 3: Project Setup - Done

- [x] Create npm workspace monorepo
- [x] Configure backend with Node.js, Express, TypeScript, MongoDB, and Mongoose
- [x] Configure frontend with React, Vite, TypeScript, and Tailwind CSS
- [x] Add shadcn/ui-ready structure
- [x] Install React Router
- [x] Install TanStack Query
- [x] Install Zustand
- [x] Install Axios
- [x] Install React Hook Form
- [x] Install Zod
- [x] Configure environment variables
- [x] Configure ESLint and Prettier
- [x] Add MongoDB connection module
- [x] Add API health route
- [x] Run typecheck, lint, and production build successfully
- [x] Commit project setup

### Phase 4: Authentication - Next

Branch name: `feature/authentication`

- [ ] Create auth module on backend
- [ ] Create register endpoint
- [ ] Create login endpoint
- [ ] Add password hashing with bcrypt
- [ ] Add JWT access token generation
- [ ] Add current user endpoint
- [ ] Add logout flow
- [ ] Add forgot password flow
- [ ] Add reset password flow
- [ ] Add authentication middleware
- [ ] Add role-based authorization middleware
- [ ] Create login page on frontend
- [ ] Create register page on frontend
- [ ] Store authenticated user state
- [ ] Add protected frontend routes
- [ ] Test authentication flow
- [ ] Commit with `feat: add authentication`

### Phase 5: User Management

Branch name: `feature/user-management`

- [ ] Create user list API
- [ ] Create user detail API
- [ ] Create admin CRUD
- [ ] Create doctor CRUD
- [ ] Create nurse CRUD
- [ ] Create receptionist CRUD
- [ ] Create patient CRUD
- [ ] Create user profile page
- [ ] Add change password feature
- [ ] Add role filters and pagination
- [ ] Commit with `feat: add user management`

### Phase 6: Department Management

- [ ] Create department model
- [ ] Add department API routes
- [ ] Add department create, edit, delete, and list screens
- [ ] Connect doctors to departments
- [ ] Commit with `feat: add department management`

### Phase 7: Doctor Management

- [ ] Create doctor profile model
- [ ] Add specialization fields
- [ ] Add schedule and availability
- [ ] Add working hours
- [ ] Add doctor dashboard view
- [ ] Commit with `feat: add doctor management`

### Phase 8: Patient Management

- [ ] Create patient model
- [ ] Add patient registration
- [ ] Add patient profile
- [ ] Add medical history
- [ ] Add emergency contact
- [ ] Add allergies
- [ ] Commit with `feat: add patient management`

### Phase 9: Appointment System

- [ ] Create appointment model
- [ ] Book appointment
- [ ] Approve appointment
- [ ] Cancel appointment
- [ ] Show appointment history
- [ ] Add appointment calendar
- [ ] Commit with `feat: add appointment system`

### Phase 10: Electronic Medical Records

- [ ] Create medical record model
- [ ] Add patient diagnosis
- [ ] Add symptoms
- [ ] Add treatment plan
- [ ] Add doctor notes
- [ ] Add follow-up plan
- [ ] Commit with `feat: add electronic medical records`

### Phase 11: Prescription Module

- [ ] Create prescription model
- [ ] Create prescription form
- [ ] Add medicine list
- [ ] Add dosage
- [ ] Add duration
- [ ] Add prescription history
- [ ] Commit with `feat: add prescription module`

### Phase 12: Laboratory Module

- [ ] Create lab request model
- [ ] Request test
- [ ] Add result
- [ ] Upload report
- [ ] Show patient report history
- [ ] Commit with `feat: add laboratory module`

### Phase 13: Pharmacy Module

- [ ] Create medicine model
- [ ] Add medicine CRUD
- [ ] Add suppliers
- [ ] Add inventory
- [ ] Add stock alerts
- [ ] Add expiry date tracking
- [ ] Commit with `feat: add pharmacy module`

### Phase 14: Billing System

- [ ] Create invoice model
- [ ] Generate invoice
- [ ] Add payment status
- [ ] Add payment history
- [ ] Add printable invoice page
- [ ] Commit with `feat: add billing system`

### Phase 15: Dashboards

- [ ] Create admin dashboard
- [ ] Create doctor dashboard
- [ ] Create nurse dashboard
- [ ] Create receptionist dashboard
- [ ] Create patient dashboard
- [ ] Add charts and statistics
- [ ] Commit with `feat: add dashboards`

### Phase 16: Notifications

- [ ] Add appointment notifications
- [ ] Add prescription notifications
- [ ] Add laboratory notifications
- [ ] Add billing notifications
- [ ] Add notification list and read status
- [ ] Commit with `feat: add notifications`

### Phase 17: Search, Filter, Pagination, and Sorting

- [ ] Add global search
- [ ] Add module filters
- [ ] Add reusable pagination
- [ ] Add table sorting
- [ ] Commit with `feat: add search and filters`

### Phase 18: File Upload

- [ ] Upload profile image
- [ ] Upload medical reports
- [ ] Upload laboratory reports
- [ ] Validate file type and size
- [ ] Commit with `feat: add file uploads`

### Phase 19: Security and Error Handling

- [ ] Add strong input validation everywhere
- [ ] Add centralized error handling
- [ ] Review authorization for all protected APIs
- [ ] Add secure API defaults
- [ ] Add rate limiting strategy
- [ ] Commit with `chore: harden security`

### Phase 20: Testing and Quality

- [ ] Test backend APIs
- [ ] Test frontend forms and pages
- [ ] Fix bugs
- [ ] Improve performance
- [ ] Add useful test data
- [ ] Commit with `test: add project tests`

### Phase 21: Deployment

- [ ] Configure MongoDB Atlas
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure production environment variables
- [ ] Test production app
- [ ] Commit deployment documentation

### Phase 22: Final Documentation

- [ ] Update README.md
- [ ] Add installation guide
- [ ] Add API documentation
- [ ] Add screenshots
- [ ] Record demo video
- [ ] Push final version to GitHub

## Next Immediate Steps

1. Confirm MongoDB is running locally.
2. Run the full project with `npm run dev`.
3. Create the next branch with `git checkout -b feature/authentication`.
4. Build backend authentication first.
5. Build frontend login and register pages.
6. Add protected routes and RBAC.
7. Test the complete auth flow.
8. Commit, push, and open a Pull Request.

## GitHub Workflow

For every feature:

1. Create a new branch, for example `feature/authentication`.
2. Build the feature.
3. Commit with a clear message, for example `feat: add JWT authentication`.
4. Push the branch to GitHub.
5. Open a Pull Request.
6. Review and merge into `main`.
7. Delete the feature branch after merging.
