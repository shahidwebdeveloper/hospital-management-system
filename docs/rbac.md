# HMS Authorization

## Authentication

Better Auth owns credentials and sessions. The `authenticate` middleware resolves the session to the HMS `User` document and rejects missing sessions with `401`. Inactive accounts receive `403`.

## Roles

The fixed roles are `super_admin`, `admin`, `doctor`, `nurse`, `receptionist`, `pharmacist`, `lab_technician`, and `patient`. Role permissions are centralized in `contracts/src/types/hospital.ts` and consumed by both the server middleware and client guards.

`admin` manages hospital operations but does not receive clinical-write permissions. Clinical writes belong to doctors, nurses where explicitly supported, pharmacists, or laboratory technicians according to the workflow.

## Backend rules

- Use `authenticate` before protected routers.
- Use `authorizePermission("module:action")` on every sensitive endpoint.
- Use `authorizeResource` for patient-linked detail, update, and delete endpoints.
- Use `resourceScope` for list endpoints so patient and assignment scopes are applied in the database query.
- Return `401` for missing authentication, `403` for denied authorization, and `404` when a requested resource does not exist.
- User role, active state, and verification state are server-controlled. User updates cannot change `isVerified`, and users cannot change their own role or deactivate themselves.
- Super-admin accounts are protected, and at least one active administrator must remain.

## Ownership rules

Patients are scoped to the patient profile linked to the authenticated HMS user. Doctors are scoped to records assigned to their user ID. Laboratory technicians and pharmacists may access their workflow resources, while receptionist access is limited to registration, appointments, and invoices. Assignment models should be extended before granting nurses broad clinical access.

## Frontend rules

`useCan` and `RequirePermission` consume the same shared matrix. `ProtectedRoute` renders a 403 state for authenticated users without access; it redirects only unauthenticated users to login. Frontend checks improve navigation and usability, but the API remains the security boundary.

## Permission matrix

| Module          | Super Admin | Admin | Doctor       | Nurse   | Receptionist | Pharmacist | Lab Tech | Patient |
| --------------- | ----------- | ----- | ------------ | ------- | ------------ | ---------- | -------- | ------- |
| Users and roles | FULL        | FULL  | NONE         | NONE    | NONE         | NONE       | NONE     | NONE    |
| Departments     | FULL        | FULL  | NONE         | NONE    | NONE         | NONE       | NONE     | NONE    |
| Patients        | FULL        | FULL  | LIMITED      | LIMITED | LIMITED      | NONE       | VIEW     | OWN     |
| Appointments    | FULL        | FULL  | LIMITED      | VIEW    | FULL         | NONE       | NONE     | OWN     |
| Medical records | FULL        | VIEW  | OWN          | VIEW    | NONE         | NONE       | NONE     | OWN     |
| Prescriptions   | FULL        | VIEW  | FULL         | VIEW    | NONE         | PROCESS    | NONE     | OWN     |
| Laboratory      | FULL        | VIEW  | REQUEST/VIEW | VIEW    | NONE         | VIEW       | FULL     | OWN     |
| Pharmacy        | FULL        | VIEW  | VIEW         | NONE    | NONE         | FULL       | NONE     | OWN     |
| Billing         | FULL        | FULL  | VIEW         | NONE    | LIMITED      | NONE       | NONE     | OWN     |
| Notifications   | FULL        | FULL  | OWN          | OWN     | OWN          | OWN        | OWN      | OWN     |
| Files           | FULL        | FULL  | OWN          | OWN     | OWN          | OWN        | OWN      | OWN     |

## Current scope

Implemented API routers cover users, patients, doctors, appointments, medical records, prescriptions, laboratory, pharmacy, and billing. Department, notification, file, report, and audit persistence APIs are not currently mounted in `server/src/routes/index.ts`; their shared permissions are defined for the next module phase. Audit entries currently use the existing in-process audit utility and should move to a durable collection before production deployment.
