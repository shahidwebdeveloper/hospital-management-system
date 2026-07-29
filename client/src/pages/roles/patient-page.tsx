import RolePageShell from "@/components/role-page-shell";

export default function PatientPage() {
  return (
    <RolePageShell
      badge="Patient workspace"
      title="A clearer experience for patients"
      description="Support patient self-service, registrations, appointments, and progress visibility from a calm and modern experience."
      highlights={[
        "Patient registration and profile overview",
        "Appointment and visit history",
        "Care coordination with clinical staff",
        "Accessible and friendly experience for everyday use"
      ]}
      actions={[
        { label: "Open patient registry", href: "/app/patients" },
        { label: "Back to dashboard", href: "/app/dashboard", variant: "outline" }
      ]}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Patient profile</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Display personal details, medical context, and visit history in a clean overview.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Digital engagement</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Offer pre-visit preparation, follow-ups, and appointment updates in one place.
          </p>
        </div>
      </div>
    </RolePageShell>
  );
}
