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

## Roadmap

### Phase 1: Planning

- [x] Choose the project name
- [x] Write the project goal
- [x] Identify all user roles
- [x] List all project features
- [x] Decide the technology stack
- [ ] Create a GitHub repository
- [ ] Clone the repository to your computer
- [x] Create a README.md file
- [x] Add the project roadmap to the README

### Phase 2: Design

- [x] Draw the system architecture
- [x] Design the database
- [x] Design the API
- [x] Plan folder structure
- [ ] Design the UI in Figma or paper

### Phase 3: Project Setup

- [x] Configure backend project
- [x] Configure frontend project
- [x] Configure TypeScript
- [x] Configure environment variables
- [x] Configure ESLint and Prettier
- [x] Add MongoDB connection module
- [ ] Install dependencies
- [ ] Commit everything to GitHub

### Future Phases

- Authentication and RBAC
- User, department, doctor, and patient management
- Appointments, EMR, prescriptions, laboratory, pharmacy, billing
- Dashboards, notifications, search, filtering, uploads
- Security, testing, deployment, and final documentation

## GitHub Workflow

For every feature:

1. Create a new branch, for example `feature/authentication`.
2. Build the feature.
3. Commit with a clear message, for example `feat: add JWT authentication`.
4. Push the branch to GitHub.
5. Open a Pull Request.
6. Review and merge into `main`.
7. Delete the feature branch after merging.
