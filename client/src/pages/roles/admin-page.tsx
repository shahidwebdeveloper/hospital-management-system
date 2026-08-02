import RolePageShell from "@/components/role-page-shell";

export default function AdminPage() {
  return (
    <RolePageShell
      badge="Admin workspace"
      title="Operational command center for administrators"
      description="Manage users, roles, departments, workflows, and governance with a clear and high-trust experience."
      highlights={[
        "User and access management",
        "Department and organizational setup",
        "Workflow oversight and operational monitoring",
        "Governance controls for enterprise readiness"
      ]}
      actions={[
        { label: "Go to dashboard", href: "/app/dashboard" },
        { label: "Manage users", href: "/app/users/manage", variant: "outline" }
      ]}
    >
      <div className="space-y-3">
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Administration controls</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Expose governance tools, team operations, and policy configuration from one admin
            surface.
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-background p-4">
          <h3 className="font-semibold">Oversight ready</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Track platform health, service coverage, and critical workflows without losing clarity.
          </p>
        </div>
      </div>
    </RolePageShell>
  );
}
