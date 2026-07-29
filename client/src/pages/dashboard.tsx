import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  CalendarCheck,
  Clock3,
  FlaskConical,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";

import { moduleDefinitions, roleLabels } from "@hms/contracts";

import { Button } from "@/components/ui/button";
import { moduleRecords } from "@/data/hospital-data";

const metrics = [
  {
    label: "Patients",
    value: moduleRecords.patients.length,
    detail: "registered and admitted",
    icon: UsersRound,
    path: "/app/patients"
  },
  {
    label: "Appointments",
    value: moduleRecords.appointments.length,
    detail: "scheduled today",
    icon: CalendarCheck,
    path: "/app/appointments"
  },
  {
    label: "Doctors",
    value: moduleRecords.doctors.length,
    detail: "clinical profiles",
    icon: Stethoscope,
    path: "/app/doctors"
  },
  {
    label: "Open invoices",
    value: moduleRecords.billing.filter((item) => item.status !== "paid").length,
    detail: "need payment action",
    icon: BadgeDollarSign,
    path: "/app/billing"
  }
];

const workspaces = [
  {
    title: "Doctor Workspace",
    text: "Appointments, EMR, prescriptions, and follow-ups.",
    icon: Stethoscope
  },
  {
    title: "Patient Workspace",
    text: "Registration, history, admissions, and progress visibility.",
    icon: UsersRound
  },
  {
    title: "Pharmacy Workspace",
    text: "Stock, alerts, dispensing, and reorder workflows.",
    icon: Pill
  },
  {
    title: "Laboratory Workspace",
    text: "Tests, reports, and processing queues.",
    icon: FlaskConical
  }
] as const;

const highlights = [
  {
    title: "Care coordination",
    text: "Keep clinical, patient, and support workflows aligned in one view.",
    icon: HeartPulse
  },
  {
    title: "Operational readiness",
    text: "Monitor critical areas with a clear and executive-friendly dashboard.",
    icon: ShieldCheck
  },
  {
    title: "Fast access",
    text: "Jump directly into the modules that matter most today.",
    icon: Clock3
  }
];

export default function Dashboard() {
  return (
    <main className="space-y-6 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_25%)] p-5 lg:p-6">
      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <HeartPulse className="h-4 w-4" />
              Executive care operations overview
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Hospital Command Center
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              A polished operating view for departments, patients, appointments, and clinical
              services across the hospital.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/app/patients">
                Open patient registry
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/users">View governance</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.label}
              to={metric.path}
              className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:border-primary"
            >
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-semibold">
                  Live
                </span>
              </div>
              <div className="mt-4 text-3xl font-semibold">{metric.value}</div>
              <div className="text-sm font-medium">{metric.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{metric.detail}</div>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Application modules</h2>
              <p className="text-sm text-muted-foreground">
                Every part of the system is presented as a focused operational module.
              </p>
            </div>
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {moduleDefinitions.length} modules
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {moduleDefinitions.map((module) => (
              <Link
                key={module.key}
                to={`/app${module.path}`}
                className="rounded-xl border border-border/60 bg-background p-4 transition hover:border-primary"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{module.label}</h3>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {module.description}
                </p>
                <div className="mt-3 text-xs font-semibold text-primary">
                  {module.statuses.length} workflow states
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Why this platform matters</h2>
            <div className="mt-4 space-y-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Role access model</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(roleLabels).map(([key, label]) => (
                <span
                  key={key}
                  className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs font-semibold"
                >
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <h2 className="font-semibold">Workspaces</h2>
            <div className="mt-4 space-y-3">
              {workspaces.map((workspace) => {
                const Icon = workspace.icon;
                return (
                  <article
                    key={workspace.title}
                    className="rounded-xl border border-border/60 bg-background p-3"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="mt-2 text-sm font-semibold">{workspace.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{workspace.text}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
