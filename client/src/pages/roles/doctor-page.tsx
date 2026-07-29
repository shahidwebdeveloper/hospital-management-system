import RolePageShell from "@/components/role-page-shell";

export default function DoctorPage() {
  return (
    <RolePageShell
      badge="Doctor workspace"
      title="Clinical operations for physicians"
      description="Coordinate appointments, review patient history, prepare care plans, and move through daily clinical work with focus."
      highlights={[
        "Patient records and treatment history",
        "Appointment queue and follow-up scheduling",
        "Prescription and lab coordination",
        "Secure role-based access for clinical teams"
      ]}
      actions={[
        { label: "Open doctor roster", href: "/app/doctors" },
        { label: "Go to patients", href: "/app/patients", variant: "outline" }
      ]}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Today’s focus</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Review consult requests, update medical notes, and prepare next steps for each patient.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Care collaboration</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Connect with lab, pharmacy, and admin workflows from one streamlined clinical dashboard.
          </p>
        </div>
      </div>
    </RolePageShell>
  );
}
