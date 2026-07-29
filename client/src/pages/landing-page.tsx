import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const pillars = [
  {
    title: "Patient-first workflows",
    text: "Elegant patient registration, records, and follow-up experiences for staff and care teams.",
    icon: UsersRound
  },
  {
    title: "Role-aware operations",
    text: "Separate workspaces for doctors, patients, admins, and support teams with clear responsibilities.",
    icon: ShieldCheck
  },
  {
    title: "Operational visibility",
    text: "Dashboards, appointments, billing, labs, and pharmacy modules in one coordinated system.",
    icon: Building2
  }
];

const quickLinks = [
  {
    label: "Patient workspace",
    href: "/app/patients",
    description: "Registration, history, admissions, and follow-up"
  },
  {
    label: "Doctor workspace",
    href: "/app/doctors",
    description: "Consultations, schedules, and care plans"
  },
  {
    label: "Admin workspace",
    href: "/app/users",
    description: "Users, roles, departments, and access governance"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_100%)] px-5 py-8 text-foreground lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card/90 shadow-sm backdrop-blur">
          <div className="grid gap-8 px-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                <HeartPulse className="h-4 w-4" />
                Senior-level Hospital Management Platform
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                Build modern care delivery around clarity, speed, and trust.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
                A polished MERN-based hospital operations experience for patients, doctors, admins,
                and support teams.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/signup">
                    Sign up
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign in</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/app/dashboard">Explore dashboard</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">HMS Experience</p>
                  <p className="text-sm text-muted-foreground">
                    Professional, modular, and role-aware
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Appointments and scheduling",
                  "Patient records and admissions",
                  "Admin and role governance"
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                  >
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-lg font-semibold">{pillar.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.text}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Jump into a workspace</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-xl border border-border/60 bg-card p-4 transition hover:border-primary"
              >
                <h3 className="font-semibold">{link.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
