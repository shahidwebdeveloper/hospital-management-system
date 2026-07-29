export const appRoles = [
  "super_admin",
  "admin",
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician",
  "patient"
] as const;

export type AppRole = (typeof appRoles)[number];

export const hospitalModules = [
  "departments",
  "doctors",
  "patients",
  "appointments",
  "medical-records",
  "prescriptions",
  "laboratory",
  "pharmacy",
  "billing",
  "users",
  "notifications",
  "settings"
] as const;

export type HospitalModule = (typeof hospitalModules)[number];

export type ModuleDefinition = {
  key: HospitalModule;
  label: string;
  path: string;
  description: string;
  statuses: readonly string[];
  allowedRoles: readonly AppRole[];
};

const allStaff = ["super_admin", "admin", "doctor", "nurse", "receptionist", "pharmacist", "lab_technician"] as const;

export const moduleDefinitions: readonly ModuleDefinition[] = [
  {
    key: "departments",
    label: "Departments",
    path: "/departments",
    description: "Manage clinical departments, beds, heads, and locations.",
    statuses: ["active", "inactive"],
    allowedRoles: ["super_admin", "admin"]
  },
  {
    key: "doctors",
    label: "Doctors",
    path: "/doctors",
    description: "Doctor profiles, specialties, schedules, and availability.",
    statuses: ["available", "busy", "off_duty", "inactive"],
    allowedRoles: ["super_admin", "admin", "doctor", "receptionist"]
  },
  {
    key: "patients",
    label: "Patients",
    path: "/patients",
    description: "Patient registration, demographics, risk, allergies, and care ownership.",
    statuses: ["registered", "admitted", "discharged", "critical", "inactive"],
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "receptionist"]
  },
  {
    key: "appointments",
    label: "Appointments",
    path: "/appointments",
    description: "Booking, check-in, visit progress, cancellations, and follow-ups.",
    statuses: ["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"],
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "receptionist", "patient"]
  },
  {
    key: "medical-records",
    label: "Medical Records",
    path: "/medical-records",
    description: "Diagnosis, symptoms, treatment plans, notes, and clinical follow-ups.",
    statuses: ["draft", "active", "closed", "follow_up"],
    allowedRoles: ["super_admin", "admin", "doctor", "nurse"]
  },
  {
    key: "prescriptions",
    label: "Prescriptions",
    path: "/prescriptions",
    description: "Medication orders, dosage, duration, dispensing state, and instructions.",
    statuses: ["issued", "dispensed", "partially_dispensed", "cancelled"],
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "pharmacist"]
  },
  {
    key: "laboratory",
    label: "Laboratory",
    path: "/laboratory",
    description: "Lab requests, sample collection, result workflow, and report publication.",
    statuses: ["requested", "sample_collected", "processing", "completed", "cancelled"],
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "lab_technician"]
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    path: "/pharmacy",
    description: "Medicine inventory, stock alerts, suppliers, expiry, and dispensing.",
    statuses: ["in_stock", "low_stock", "out_of_stock", "expired"],
    allowedRoles: ["super_admin", "admin", "pharmacist", "doctor"]
  },
  {
    key: "billing",
    label: "Billing",
    path: "/billing",
    description: "Invoices, services, payments, refunds, and patient balances.",
    statuses: ["draft", "unpaid", "part_paid", "paid", "refunded", "cancelled"],
    allowedRoles: ["super_admin", "admin", "receptionist", "patient"]
  },
  {
    key: "users",
    label: "Users & Roles",
    path: "/users",
    description: "Staff accounts, access levels, role assignments, and activity state.",
    statuses: ["active", "invited", "suspended", "inactive"],
    allowedRoles: ["super_admin", "admin"]
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/notifications",
    description: "Role-targeted alerts, patient messages, operational reminders, and announcements.",
    statuses: ["unread", "read", "archived"],
    allowedRoles: allStaff
  },
  {
    key: "settings",
    label: "Rules & Settings",
    path: "/settings",
    description: "Hospital rules, security policy, role permissions, and workflow controls.",
    statuses: ["enabled", "disabled", "review"],
    allowedRoles: ["super_admin", "admin"]
  }
];

export const roleLabels: Record<AppRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  pharmacist: "Pharmacist",
  lab_technician: "Lab Technician",
  patient: "Patient"
};

export const hospitalRules = [
  "Admin users manage departments, staff access, and hospital configuration.",
  "Doctors own diagnoses, prescriptions, lab orders, and follow-up care plans.",
  "Nurses record vitals, care notes, appointment progress, and sample collection events.",
  "Receptionists register patients, manage booking, check-in, and billing drafts.",
  "Pharmacists manage inventory and dispense only approved prescriptions.",
  "Lab technicians process lab requests and publish verified reports.",
  "Patients only see their own appointments, prescriptions, invoices, and reports.",
  "Clinical and billing records keep audit data and should be soft-deleted in production.",
  "Every operational list supports search, status filters, and pagination-ready data.",
  "Workflow statuses must use module-specific enum values."
] as const;