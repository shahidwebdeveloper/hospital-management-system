import type { UserRole } from "../../constants/roles.js";

export type ResourceKey =
  | "departments"
  | "doctors"
  | "patients"
  | "appointments"
  | "medical-records"
  | "prescriptions"
  | "laboratory"
  | "pharmacy"
  | "billing"
  | "notifications";

export type ResourceDefinition = {
  key: ResourceKey;
  collectionName: string;
  displayName: string;
  allowedRoles: UserRole[];
  searchableFields: string[];
  statuses: string[];
};

const clinicalRoles: UserRole[] = ["super_admin", "admin", "doctor", "nurse"];
const operationsRoles: UserRole[] = ["super_admin", "admin", "receptionist"];

export const resourceDefinitions: ResourceDefinition[] = [
  {
    key: "departments",
    collectionName: "departments",
    displayName: "Departments",
    allowedRoles: ["super_admin", "admin"],
    searchableFields: ["name", "code", "head", "location"],
    statuses: ["active", "inactive"]
  },
  {
    key: "doctors",
    collectionName: "doctors",
    displayName: "Doctors",
    allowedRoles: ["super_admin", "admin", "doctor", "receptionist"],
    searchableFields: ["name", "email", "specialization", "department", "licenseNumber"],
    statuses: ["available", "busy", "off_duty", "inactive"]
  },
  {
    key: "patients",
    collectionName: "patients",
    displayName: "Patients",
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "receptionist"],
    searchableFields: ["name", "phone", "email", "patientNumber", "bloodGroup"],
    statuses: ["registered", "admitted", "discharged", "critical", "inactive"]
  },
  {
    key: "appointments",
    collectionName: "appointments",
    displayName: "Appointments",
    allowedRoles: [...clinicalRoles, "receptionist", "patient"],
    searchableFields: ["patientName", "doctorName", "department", "reason", "room"],
    statuses: ["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"]
  },
  {
    key: "medical-records",
    collectionName: "medicalrecords",
    displayName: "Medical Records",
    allowedRoles: clinicalRoles,
    searchableFields: ["patientName", "doctorName", "diagnosis", "symptoms", "recordNumber"],
    statuses: ["draft", "active", "closed", "follow_up"]
  },
  {
    key: "prescriptions",
    collectionName: "prescriptions",
    displayName: "Prescriptions",
    allowedRoles: [...clinicalRoles, "pharmacist"],
    searchableFields: ["patientName", "doctorName", "medicine", "prescriptionNumber"],
    statuses: ["issued", "dispensed", "partially_dispensed", "cancelled"]
  },
  {
    key: "laboratory",
    collectionName: "labrequests",
    displayName: "Laboratory",
    allowedRoles: [...clinicalRoles, "lab_technician"],
    searchableFields: ["patientName", "doctorName", "testName", "sampleNumber"],
    statuses: ["requested", "sample_collected", "processing", "completed", "cancelled"]
  },
  {
    key: "pharmacy",
    collectionName: "medicines",
    displayName: "Pharmacy",
    allowedRoles: ["super_admin", "admin", "pharmacist", "doctor"],
    searchableFields: ["name", "sku", "supplier", "category"],
    statuses: ["in_stock", "low_stock", "out_of_stock", "expired"]
  },
  {
    key: "billing",
    collectionName: "invoices",
    displayName: "Billing",
    allowedRoles: [...operationsRoles, "patient"],
    searchableFields: ["invoiceNumber", "patientName", "status", "paymentMethod"],
    statuses: ["draft", "unpaid", "part_paid", "paid", "refunded", "cancelled"]
  },
  {
    key: "notifications",
    collectionName: "notifications",
    displayName: "Notifications",
    allowedRoles: ["super_admin", "admin", "doctor", "nurse", "receptionist", "pharmacist", "lab_technician", "patient"],
    searchableFields: ["title", "message", "targetRole", "priority"],
    statuses: ["unread", "read", "archived"]
  }
];

export const resourceDefinitionMap = new Map(resourceDefinitions.map((definition) => [definition.key, definition]));

export const applicationRules = [
  "Only admins manage users, roles, departments, and system settings.",
  "Doctors can create diagnoses, prescriptions, lab requests, and follow-up plans.",
  "Nurses can update vitals, care notes, appointment progress, and lab collection status.",
  "Receptionists can register patients, book appointments, check patients in, and manage billing drafts.",
  "Pharmacists can manage medicine stock and dispense approved prescriptions.",
  "Lab technicians can process lab requests and publish test results.",
  "Patients can view their own appointments, prescriptions, invoices, and reports.",
  "Clinical records should keep audit fields and should not be hard-deleted in production.",
  "Every list endpoint supports search, pagination, and status filtering.",
  "Statuses are controlled by module-specific enums so workflow data stays clean."
];