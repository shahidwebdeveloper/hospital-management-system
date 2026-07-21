# Database Design

The first implementation uses MongoDB with Mongoose models. Collections are designed around hospital workflows and RBAC.

## Core Collections

- `users`: login credentials, role, profile status
- `departments`: hospital departments and service metadata
- `doctors`: professional profile, specialization, schedule, availability
- `patients`: demographics, emergency contact, allergies, medical history
- `appointments`: patient, doctor, status, time, reason
- `medicalRecords`: diagnosis, symptoms, treatment plan, notes, follow-up
- `prescriptions`: medicines, dosage, duration, doctor, patient
- `labRequests`: test request, result, uploaded report
- `medicines`: stock, suppliers, expiry, alert thresholds
- `invoices`: billing items, payment status, payment history
- `notifications`: role-targeted and user-targeted messages

## Design Rules

- Every write-heavy collection includes audit fields.
- Sensitive patient data is only exposed through authorized routes.
- Status values are enums where possible.
- Soft deletion can be added for clinical and financial records before production deployment.
