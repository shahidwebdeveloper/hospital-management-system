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

export const adminRoles = ["super_admin", "admin"] as const;
export const staffRoles = [
  "super_admin",
  "admin",
  "doctor",
  "nurse",
  "receptionist",
  "pharmacist",
  "lab_technician"
] as const;
export const clinicalRoles = ["super_admin", "admin", "doctor", "nurse"] as const;

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
export type AppRouteModule = HospitalModule | "dashboard";

export type PermissionLevel = "manage" | "create" | "view" | "own" | "none";

export type ModulePermission = {
  role: AppRole;
  level: PermissionLevel;
  note: string;
};

export type ModuleDefinition = {
  key: HospitalModule;
  label: string;
  path: string;
  description: string;
  statuses: readonly string[];
  allowedRoles: readonly AppRole[];
  permissions: readonly ModulePermission[];
};

const allRoles = appRoles;

export const modulePermissions = {
  dashboard: {
    super_admin: { level: "manage", note: "Full system dashboard" },
    admin: { level: "manage", note: "Full admin dashboard" },
    doctor: { level: "view", note: "Doctor dashboard" },
    nurse: { level: "view", note: "Nurse dashboard" },
    receptionist: { level: "view", note: "Reception dashboard" },
    lab_technician: { level: "view", note: "Lab dashboard" },
    pharmacist: { level: "view", note: "Pharmacy dashboard" },
    patient: { level: "own", note: "Patient dashboard" }
  },
  departments: {
    super_admin: { level: "manage", note: "Manage departments" },
    admin: { level: "manage", note: "Manage departments" },
    doctor: { level: "none", note: "No department management" },
    nurse: { level: "none", note: "No department management" },
    receptionist: { level: "none", note: "No department management" },
    lab_technician: { level: "none", note: "No department management" },
    pharmacist: { level: "none", note: "No department management" },
    patient: { level: "none", note: "No department access" }
  },
  patients: {
    super_admin: { level: "manage", note: "Manage all patients" },
    admin: { level: "manage", note: "Manage all patients" },
    doctor: { level: "manage", note: "Manage assigned patients" },
    nurse: { level: "manage", note: "Manage care details" },
    receptionist: { level: "manage", note: "Register and update patients" },
    lab_technician: { level: "view", note: "View patient test context" },
    pharmacist: { level: "none", note: "No patient registry access" },
    patient: { level: "own", note: "Own profile only" }
  },
  doctors: {
    super_admin: { level: "manage", note: "Manage doctors" },
    admin: { level: "manage", note: "Manage doctors" },
    doctor: { level: "view", note: "View doctor directory" },
    nurse: { level: "view", note: "View doctor directory" },
    receptionist: { level: "view", note: "View doctor directory" },
    lab_technician: { level: "none", note: "No doctor directory access" },
    pharmacist: { level: "none", note: "No doctor directory access" },
    patient: { level: "view", note: "View doctors" }
  },
  appointments: {
    super_admin: { level: "manage", note: "Manage all appointments" },
    admin: { level: "manage", note: "Manage all appointments" },
    doctor: { level: "manage", note: "Manage schedule" },
    nurse: { level: "view", note: "View appointment flow" },
    receptionist: { level: "manage", note: "Book and manage appointments" },
    lab_technician: { level: "none", note: "No appointment access" },
    pharmacist: { level: "none", note: "No appointment access" },
    patient: { level: "own", note: "Own appointments" }
  },
  "medical-records": {
    super_admin: { level: "manage", note: "Manage medical records" },
    admin: { level: "manage", note: "Manage medical records" },
    doctor: { level: "own", note: "Own patients only" },
    nurse: { level: "view", note: "View care records" },
    receptionist: { level: "none", note: "No medical record access" },
    lab_technician: { level: "none", note: "No medical record access" },
    pharmacist: { level: "none", note: "No medical record access" },
    patient: { level: "own", note: "Own medical records" }
  },
  prescriptions: {
    super_admin: { level: "manage", note: "Manage prescriptions" },
    admin: { level: "manage", note: "Manage prescriptions" },
    doctor: { level: "create", note: "Create prescriptions" },
    nurse: { level: "view", note: "View prescriptions" },
    receptionist: { level: "none", note: "No prescription access" },
    lab_technician: { level: "none", note: "No prescription access" },
    pharmacist: { level: "view", note: "View prescriptions to dispense" },
    patient: { level: "own", note: "Own prescriptions" }
  },
  laboratory: {
    super_admin: { level: "manage", note: "Manage laboratory" },
    admin: { level: "manage", note: "Manage laboratory" },
    doctor: { level: "create", note: "Request and view tests" },
    nurse: { level: "view", note: "View lab workflow" },
    receptionist: { level: "none", note: "No laboratory access" },
    lab_technician: { level: "manage", note: "Manage lab queue and results" },
    pharmacist: { level: "view", note: "View related lab context" },
    patient: { level: "own", note: "Own lab results" }
  },
  pharmacy: {
    super_admin: { level: "manage", note: "Manage pharmacy" },
    admin: { level: "manage", note: "Manage pharmacy" },
    doctor: { level: "create", note: "Request medicines" },
    nurse: { level: "none", note: "No pharmacy access" },
    receptionist: { level: "none", note: "No pharmacy access" },
    lab_technician: { level: "none", note: "No pharmacy access" },
    pharmacist: { level: "manage", note: "Manage inventory and dispensing" },
    patient: { level: "own", note: "Own prescription medicines" }
  },
  billing: {
    super_admin: { level: "manage", note: "Manage billing" },
    admin: { level: "manage", note: "Manage billing" },
    doctor: { level: "view", note: "View billing context" },
    nurse: { level: "none", note: "No billing access" },
    receptionist: { level: "create", note: "Create and view invoices" },
    lab_technician: { level: "none", note: "No billing access" },
    pharmacist: { level: "none", note: "No billing access" },
    patient: { level: "own", note: "Own bills" }
  },
  users: {
    super_admin: { level: "manage", note: "Manage users and roles" },
    admin: { level: "manage", note: "Manage users and roles" },
    doctor: { level: "none", note: "No user management" },
    nurse: { level: "none", note: "No user management" },
    receptionist: { level: "none", note: "No user management" },
    lab_technician: { level: "none", note: "No user management" },
    pharmacist: { level: "none", note: "No user management" },
    patient: { level: "none", note: "No user management" }
  },
  notifications: {
    super_admin: { level: "manage", note: "All notifications" },
    admin: { level: "manage", note: "All notifications" },
    doctor: { level: "own", note: "Own notifications" },
    nurse: { level: "own", note: "Own notifications" },
    receptionist: { level: "own", note: "Own notifications" },
    lab_technician: { level: "own", note: "Own notifications" },
    pharmacist: { level: "own", note: "Own notifications" },
    patient: { level: "own", note: "Own notifications" }
  },
  settings: {
    super_admin: { level: "manage", note: "Manage system settings" },
    admin: { level: "manage", note: "Manage system settings" },
    doctor: { level: "own", note: "Own profile settings" },
    nurse: { level: "own", note: "Own profile settings" },
    receptionist: { level: "own", note: "Own profile settings" },
    lab_technician: { level: "own", note: "Own profile settings" },
    pharmacist: { level: "own", note: "Own profile settings" },
    patient: { level: "own", note: "Own profile settings" }
  }
} satisfies Record<AppRouteModule, Record<AppRole, { level: PermissionLevel; note: string }>>;

function rolesFor(module: AppRouteModule, levels: readonly PermissionLevel[] = ["manage", "create", "view", "own"]) {
  return allRoles.filter((role) => levels.includes(modulePermissions[module][role].level));
}

export const moduleAccess = {
  dashboard: rolesFor("dashboard"),
  departments: rolesFor("departments"),
  doctors: rolesFor("doctors"),
  patients: rolesFor("patients"),
  appointments: rolesFor("appointments"),
  "medical-records": rolesFor("medical-records"),
  prescriptions: rolesFor("prescriptions"),
  laboratory: rolesFor("laboratory"),
  pharmacy: rolesFor("pharmacy"),
  billing: rolesFor("billing"),
  users: rolesFor("users"),
  notifications: rolesFor("notifications"),
  settings: rolesFor("settings")
} satisfies Record<AppRouteModule, readonly AppRole[]>;

export function getModulePermissions(module: AppRouteModule) {
  return allRoles.map((role) => ({
    role,
    ...modulePermissions[module][role]
  }));
}


export const permissionActions = ["view", "create", "update", "delete", "manage"] as const;
export type PermissionAction = (typeof permissionActions)[number];

export type Permission =
  | "dashboard:view"
  | "patients:view"
  | "patients:create"
  | "patients:update"
  | "patients:delete"
  | "doctors:view"
  | "doctors:create"
  | "doctors:update"
  | "doctors:delete"
  | "appointments:view"
  | "appointments:create"
  | "appointments:update"
  | "appointments:delete"
  | "medical-records:view"
  | "medical-records:create"
  | "medical-records:update"
  | "medical-records:delete"
  | "prescriptions:view"
  | "prescriptions:create"
  | "prescriptions:update"
  | "prescriptions:delete"
  | "laboratory:view"
  | "laboratory:create"
  | "laboratory:manage"
  | "laboratory:delete"
  | "pharmacy:view"
  | "pharmacy:create"
  | "pharmacy:update"
  | "pharmacy:delete"
  | "billing:view"
  | "billing:create"
  | "billing:update"
  | "billing:delete"
  | "users:view"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "settings:view"
  | "settings:update";

export const permissionRoles = {
  "dashboard:view": appRoles,
  "patients:view": ["super_admin", "admin", "doctor", "nurse", "receptionist", "lab_technician", "patient"],
  "patients:create": ["super_admin", "admin", "doctor", "nurse", "receptionist"],
  "patients:update": ["super_admin", "admin", "doctor", "nurse", "receptionist"],
  "patients:delete": ["super_admin", "admin"],
  "doctors:view": ["super_admin", "admin", "doctor", "nurse", "receptionist", "patient"],
  "doctors:create": ["super_admin", "admin"],
  "doctors:update": ["super_admin", "admin"],
  "doctors:delete": ["super_admin", "admin"],
  "appointments:view": ["super_admin", "admin", "doctor", "nurse", "receptionist", "patient"],
  "appointments:create": ["super_admin", "admin", "doctor", "receptionist", "patient"],
  "appointments:update": ["super_admin", "admin", "doctor", "receptionist", "patient"],
  "appointments:delete": ["super_admin", "admin"],
  "medical-records:view": ["super_admin", "admin", "doctor", "nurse", "patient"],
  "medical-records:create": ["super_admin", "admin", "doctor"],
  "medical-records:update": ["super_admin", "admin", "doctor"],
  "medical-records:delete": ["super_admin", "admin"],
  "prescriptions:view": ["super_admin", "admin", "doctor", "nurse", "pharmacist", "patient"],
  "prescriptions:create": ["super_admin", "admin", "doctor"],
  "prescriptions:update": ["super_admin", "admin", "doctor"],
  "prescriptions:delete": ["super_admin", "admin"],
  "laboratory:view": ["super_admin", "admin", "doctor", "nurse", "lab_technician", "pharmacist", "patient"],
  "laboratory:create": ["super_admin", "admin", "doctor"],
  "laboratory:manage": ["super_admin", "admin", "lab_technician"],
  "laboratory:delete": ["super_admin", "admin"],
  "pharmacy:view": ["super_admin", "admin", "doctor", "pharmacist"],
  "pharmacy:create": ["super_admin", "admin", "pharmacist"],
  "pharmacy:update": ["super_admin", "admin", "pharmacist"],
  "pharmacy:delete": ["super_admin", "admin"],
  "billing:view": ["super_admin", "admin", "doctor", "receptionist", "patient"],
  "billing:create": ["super_admin", "admin", "receptionist"],
  "billing:update": ["super_admin", "admin", "receptionist"],
  "billing:delete": ["super_admin", "admin"],
  "users:view": ["super_admin", "admin"],
  "users:create": ["super_admin", "admin"],
  "users:update": ["super_admin", "admin"],
  "users:delete": ["super_admin", "admin"],
  "settings:view": appRoles,
  "settings:update": ["super_admin"]
} satisfies Record<Permission, readonly AppRole[]>;

export function hasPermission(role: AppRole | undefined, permission: Permission) {
  if (!role) return false;
  const allowedRoles = permissionRoles[permission] as readonly AppRole[];
  return allowedRoles.includes(role);
}
export function canAccessModule(role: AppRole | undefined, module: AppRouteModule) {
  if (!role) return false;
  const allowedRoles = moduleAccess[module] as readonly AppRole[];
  return allowedRoles.includes(role);
}

export const moduleDefinitions: readonly ModuleDefinition[] = [
  {
    key: "departments",
    label: "Departments",
    path: "/departments",
    description: "Manage clinical departments, beds, heads, and locations.",
    statuses: ["active", "inactive"],
    allowedRoles: moduleAccess.departments,
    permissions: getModulePermissions("departments")
  },
  {
    key: "doctors",
    label: "Doctors",
    path: "/doctors",
    description: "Doctor profiles, specialties, schedules, and availability.",
    statuses: ["available", "busy", "off_duty", "inactive"],
    allowedRoles: moduleAccess.doctors,
    permissions: getModulePermissions("doctors")
  },
  {
    key: "patients",
    label: "Patients",
    path: "/patients",
    description: "Patient registration, demographics, risk, allergies, and care ownership.",
    statuses: ["registered", "admitted", "discharged", "critical", "inactive"],
    allowedRoles: moduleAccess.patients,
    permissions: getModulePermissions("patients")
  },
  {
    key: "appointments",
    label: "Appointments",
    path: "/appointments",
    description: "Booking, check-in, visit progress, cancellations, and follow-ups.",
    statuses: ["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"],
    allowedRoles: moduleAccess.appointments,
    permissions: getModulePermissions("appointments")
  },
  {
    key: "medical-records",
    label: "Medical Records",
    path: "/medical-records",
    description: "Diagnosis, symptoms, treatment plans, notes, and clinical follow-ups.",
    statuses: ["draft", "active", "closed", "follow_up"],
    allowedRoles: moduleAccess["medical-records"],
    permissions: getModulePermissions("medical-records")
  },
  {
    key: "prescriptions",
    label: "Prescriptions",
    path: "/prescriptions",
    description: "Medication orders, dosage, duration, dispensing state, and instructions.",
    statuses: ["issued", "dispensed", "partially_dispensed", "cancelled"],
    allowedRoles: moduleAccess.prescriptions,
    permissions: getModulePermissions("prescriptions")
  },
  {
    key: "laboratory",
    label: "Laboratory",
    path: "/laboratory",
    description: "Lab requests, sample collection, result workflow, and report publication.",
    statuses: ["requested", "sample_collected", "processing", "completed", "cancelled"],
    allowedRoles: moduleAccess.laboratory,
    permissions: getModulePermissions("laboratory")
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    path: "/pharmacy",
    description: "Medicine inventory, stock alerts, suppliers, expiry, and dispensing.",
    statuses: ["in_stock", "low_stock", "out_of_stock", "expired"],
    allowedRoles: moduleAccess.pharmacy,
    permissions: getModulePermissions("pharmacy")
  },
  {
    key: "billing",
    label: "Billing",
    path: "/billing",
    description: "Invoices, services, payments, refunds, and patient balances.",
    statuses: ["draft", "unpaid", "part_paid", "paid", "refunded", "cancelled"],
    allowedRoles: moduleAccess.billing,
    permissions: getModulePermissions("billing")
  },
  {
    key: "users",
    label: "Users & Roles",
    path: "/users",
    description: "Staff accounts, access levels, role assignments, and activity state.",
    statuses: ["active", "invited", "suspended", "inactive"],
    allowedRoles: moduleAccess.users,
    permissions: getModulePermissions("users")
  },
  {
    key: "notifications",
    label: "Notifications",
    path: "/notifications",
    description: "Role-targeted alerts, patient messages, operational reminders, and announcements.",
    statuses: ["unread", "read", "archived"],
    allowedRoles: moduleAccess.notifications,
    permissions: getModulePermissions("notifications")
  },
  {
    key: "settings",
    label: "Rules & Settings",
    path: "/settings",
    description: "Hospital rules, security policy, role permissions, and workflow controls.",
    statuses: ["enabled", "disabled", "review"],
    allowedRoles: moduleAccess.settings,
    permissions: getModulePermissions("settings")
  }
];

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




