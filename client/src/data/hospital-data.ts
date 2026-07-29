import type { HospitalModule } from "@hms/contracts";

export type HospitalRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  owner: string;
  priority: "low" | "normal" | "high" | "urgent";
  metric: string;
  updatedAt: string;
  details: Record<string, string>;
};

export const moduleRecords: Record<HospitalModule, HospitalRecord[]> = {
  departments: [
    { id: "DEP-001", title: "Emergency", subtitle: "24/7 urgent care and triage", status: "active", owner: "Dr. Safi", priority: "urgent", metric: "34 beds", updatedAt: "Today", details: { Location: "Block A", Occupancy: "82%", Staff: "48" } },
    { id: "DEP-002", title: "Cardiology", subtitle: "Heart care, ECG, echo, inpatient cardiac beds", status: "active", owner: "Dr. Ahmadi", priority: "high", metric: "22 beds", updatedAt: "Today", details: { Location: "Block B", Occupancy: "64%", Staff: "31" } },
    { id: "DEP-003", title: "Pediatrics", subtitle: "Child health, vaccination, pediatric admission", status: "active", owner: "Dr. Stanikzai", priority: "normal", metric: "28 beds", updatedAt: "Yesterday", details: { Location: "Block C", Occupancy: "71%", Staff: "29" } }
  ],
  doctors: [
    { id: "DOC-101", title: "Dr. Amina Rahimi", subtitle: "Internal Medicine", status: "available", owner: "Medical Director", priority: "normal", metric: "12 visits", updatedAt: "Now", details: { Department: "Emergency", License: "MD-4481", Shift: "Morning" } },
    { id: "DOC-102", title: "Dr. Omar Ahmadi", subtitle: "Cardiologist", status: "busy", owner: "Medical Director", priority: "high", metric: "9 visits", updatedAt: "15 min ago", details: { Department: "Cardiology", License: "MD-2217", Shift: "Morning" } },
    { id: "DOC-103", title: "Dr. Lina Stanikzai", subtitle: "Pediatrics", status: "off_duty", owner: "Medical Director", priority: "low", metric: "0 visits", updatedAt: "Yesterday", details: { Department: "Pediatrics", License: "MD-7512", Shift: "Evening" } }
  ],
  patients: [
    { id: "PAT-1007", title: "Amina Safi", subtitle: "Female, 32, penicillin allergy", status: "admitted", owner: "Dr. Rahimi", priority: "high", metric: "Room ER-2", updatedAt: "Today", details: { Phone: "+93 700 111 222", Blood: "O+", Risk: "Medium" } },
    { id: "PAT-1042", title: "Omar Khan", subtitle: "Male, 48, cardiac observation", status: "critical", owner: "Dr. Ahmadi", priority: "urgent", metric: "Room C-1", updatedAt: "Today", details: { Phone: "+93 700 333 444", Blood: "A+", Risk: "High" } },
    { id: "PAT-1189", title: "Lina Noor", subtitle: "Female, 9, pediatric follow-up", status: "registered", owner: "Dr. Stanikzai", priority: "normal", metric: "OPD", updatedAt: "Jul 24", details: { Phone: "+93 799 555 111", Blood: "B+", Risk: "Low" } }
  ],
  appointments: [
    { id: "APT-2201", title: "Amina Safi with Dr. Rahimi", subtitle: "Acute cough and dehydration", status: "checked_in", owner: "Reception", priority: "high", metric: "09:30", updatedAt: "Today", details: { Room: "ER-2", Department: "Emergency", Type: "Walk-in" } },
    { id: "APT-2202", title: "Omar Khan with Dr. Ahmadi", subtitle: "Cardiac review", status: "in_progress", owner: "Reception", priority: "urgent", metric: "10:15", updatedAt: "Today", details: { Room: "Cardio-1", Department: "Cardiology", Type: "Follow-up" } },
    { id: "APT-2203", title: "Lina Noor with Dr. Stanikzai", subtitle: "Pediatric checkup", status: "scheduled", owner: "Reception", priority: "normal", metric: "11:00", updatedAt: "Today", details: { Room: "Peds-3", Department: "Pediatrics", Type: "Booked" } }
  ],
  "medical-records": [
    { id: "EMR-9001", title: "Amina Safi respiratory visit", subtitle: "Acute bronchitis with mild dehydration", status: "active", owner: "Dr. Rahimi", priority: "high", metric: "Follow-up 3d", updatedAt: "Today", details: { Symptoms: "Cough, fever", Treatment: "Nebulizer, fluids", Notes: "Monitor oxygen" } },
    { id: "EMR-9002", title: "Omar Khan cardiac observation", subtitle: "Chest pain rule-out and ECG monitoring", status: "follow_up", owner: "Dr. Ahmadi", priority: "urgent", metric: "ECG pending", updatedAt: "Today", details: { Symptoms: "Chest pain", Treatment: "Observation", Notes: "Repeat troponin" } }
  ],
  prescriptions: [
    { id: "RX-501", title: "Azithromycin 250mg", subtitle: "Amina Safi, 5 days, after meals", status: "issued", owner: "Dr. Rahimi", priority: "normal", metric: "1 medicine", updatedAt: "Today", details: { Patient: "Amina Safi", Dosage: "Once daily", Pharmacy: "Main" } },
    { id: "RX-502", title: "Aspirin 81mg", subtitle: "Omar Khan, daily cardiac plan", status: "partially_dispensed", owner: "Dr. Ahmadi", priority: "high", metric: "2 medicines", updatedAt: "Today", details: { Patient: "Omar Khan", Dosage: "Daily", Pharmacy: "Main" } }
  ],
  laboratory: [
    { id: "LAB-701", title: "CBC panel", subtitle: "Amina Safi, sample collected", status: "completed", owner: "Lab Team", priority: "normal", metric: "Report ready", updatedAt: "Today", details: { Sample: "S-7781", Doctor: "Dr. Rahimi", Result: "Stable" } },
    { id: "LAB-702", title: "Troponin I", subtitle: "Omar Khan cardiac marker", status: "processing", owner: "Lab Team", priority: "urgent", metric: "45 min", updatedAt: "Now", details: { Sample: "S-7782", Doctor: "Dr. Ahmadi", Result: "Pending" } }
  ],
  pharmacy: [
    { id: "MED-301", title: "Amoxicillin 500mg", subtitle: "Antibiotic capsule stock", status: "in_stock", owner: "Pharmacy", priority: "normal", metric: "320 units", updatedAt: "Today", details: { Supplier: "MediSupply", Expiry: "2027-03", Threshold: "80" } },
    { id: "MED-302", title: "Insulin Rapid", subtitle: "Cold-chain diabetes medicine", status: "low_stock", owner: "Pharmacy", priority: "high", metric: "28 units", updatedAt: "Today", details: { Supplier: "HealthPlus", Expiry: "2026-10", Threshold: "50" } },
    { id: "MED-303", title: "Ceftriaxone", subtitle: "Injectable antibiotic", status: "out_of_stock", owner: "Pharmacy", priority: "urgent", metric: "0 units", updatedAt: "Today", details: { Supplier: "MediSupply", Expiry: "2026-09", Threshold: "40" } }
  ],
  billing: [
    { id: "INV-2048", title: "Omar Khan invoice", subtitle: "Cardiology visit, ECG, lab tests", status: "part_paid", owner: "Billing Desk", priority: "high", metric: "$240", updatedAt: "Today", details: { Paid: "$120", Balance: "$120", Method: "Cash" } },
    { id: "INV-2051", title: "Amina Safi invoice", subtitle: "Emergency visit and medication", status: "paid", owner: "Billing Desk", priority: "normal", metric: "$82", updatedAt: "Today", details: { Paid: "$82", Balance: "$0", Method: "Card" } },
    { id: "INV-2058", title: "Farid Azizi invoice", subtitle: "Lab and consultation", status: "unpaid", owner: "Billing Desk", priority: "urgent", metric: "$410", updatedAt: "Yesterday", details: { Paid: "$0", Balance: "$410", Method: "Pending" } }
  ],
  users: [
    { id: "USR-001", title: "Nadia Admin", subtitle: "Administrator", status: "active", owner: "Super Admin", priority: "normal", metric: "Full access", updatedAt: "Today", details: { Role: "admin", Email: "admin@hms.local", Scope: "Hospital" } },
    { id: "USR-002", title: "Farid Nurse", subtitle: "Nursing team", status: "active", owner: "Admin", priority: "normal", metric: "Clinical", updatedAt: "Today", details: { Role: "nurse", Email: "nurse@hms.local", Scope: "Ward" } },
    { id: "USR-003", title: "Samira Lab", subtitle: "Laboratory technician", status: "invited", owner: "Admin", priority: "low", metric: "Pending", updatedAt: "Yesterday", details: { Role: "lab_technician", Email: "lab@hms.local", Scope: "Lab" } }
  ],
  notifications: [
    { id: "NOT-001", title: "Low stock alert", subtitle: "Insulin Rapid is below threshold", status: "unread", owner: "Pharmacy", priority: "high", metric: "28 units", updatedAt: "Now", details: { Target: "pharmacist", Channel: "In-app", Action: "Reorder" } },
    { id: "NOT-002", title: "Lab report published", subtitle: "CBC result uploaded for Amina Safi", status: "read", owner: "Laboratory", priority: "normal", metric: "1 report", updatedAt: "Today", details: { Target: "doctor", Channel: "In-app", Action: "Review" } }
  ],
  settings: [
    { id: "SET-001", title: "Role based access control", subtitle: "Permissions enabled for hospital modules", status: "enabled", owner: "Admin", priority: "urgent", metric: "8 roles", updatedAt: "Today", details: { Policy: "RBAC", Audit: "Enabled", Mode: "Strict" } },
    { id: "SET-002", title: "Clinical audit trail", subtitle: "Track create/update ownership on sensitive records", status: "enabled", owner: "Admin", priority: "high", metric: "All modules", updatedAt: "Today", details: { Policy: "Audit", Retention: "7 years", Mode: "Required" } },
    { id: "SET-003", title: "Soft delete workflow", subtitle: "Mark clinical and financial records inactive before removal", status: "review", owner: "Admin", priority: "normal", metric: "Planned", updatedAt: "Today", details: { Policy: "Data safety", Retention: "Review", Mode: "Draft" } }
  ]
};

export function statusTone(status: string) {
  if (["critical", "urgent", "unpaid", "out_of_stock", "expired", "cancelled", "suspended"].includes(status)) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (["low_stock", "part_paid", "processing", "checked_in", "follow_up", "busy", "review", "invited"].includes(status)) {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (["active", "available", "completed", "paid", "in_stock", "enabled", "read", "registered"].includes(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function priorityTone(priority: HospitalRecord["priority"]) {
  if (priority === "urgent") return "bg-red-600 text-white";
  if (priority === "high") return "bg-amber-500 text-white";
  if (priority === "low") return "bg-slate-200 text-slate-700";
  return "bg-emerald-100 text-emerald-800";
}