import {
  Activity,
  BedDouble,
  CalendarCheck,
  HeartPulse,
  LogIn,
  ShieldCheck,
  UserPlus,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";

import type { DemoAppointment, DemoDepartment, DemoMetric } from "@hms/contracts";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const metrics: DemoMetric[] = [
  { label: "Patients", value: "1,284", trend: "+12% this month" },
  { label: "Appointments", value: "86", trend: "24 checked in" },
  { label: "Active Doctors", value: "42", trend: "8 departments" },
  { label: "Open Cases", value: "19", trend: "5 high priority" }
];

const departments: DemoDepartment[] = [
  { name: "Emergency", doctors: 9, beds: 34, occupancy: 82 },
  { name: "Cardiology", doctors: 7, beds: 22, occupancy: 64 },
  { name: "Pediatrics", doctors: 6, beds: 28, occupancy: 71 }
];

const appointments: DemoAppointment[] = [
  { patient: "Amina Safi", doctor: "Dr. Rahimi", time: "09:30", status: "checked-in" },
  { patient: "Omar Khan", doctor: "Dr. Ahmadi", time: "10:15", status: "scheduled" },
  { patient: "Lina Noor", doctor: "Dr. Stanikzai", time: "11:00", status: "in-progress" }
];

const metricIcons = [UsersRound, CalendarCheck, HeartPulse, Activity];

export default function Dashboard() {
  const { user, logout, loading } = useAuth();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">HMS Command Center</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal">
              Hospital Management System
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <>
                <span className="inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium">
                  {user.name}
                </span>
                <Button variant="outline" onClick={() => void logout()}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/signup">
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Secure login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Operations Overview</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                A role-aware MERN foundation for authentication, user management, scheduling, EMR,
                billing, lab, pharmacy, and dashboards.
              </p>
            </div>
            <span className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
              Better Auth ready
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item, index) => {
              const Icon = metricIcons[index] ?? Activity;

              return (
                <div key={item.label} className="rounded-md border bg-background p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="mt-4 text-2xl font-semibold">{item.value}</div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.trend}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Auth Status</h2>
          </div>
          <div className="mt-5 rounded-md border bg-background p-4 text-sm">
            {loading
              ? "Checking session..."
              : user
                ? `Signed in as ${user.email}`
                : "Demo mode: sign up or sign in to test Better Auth."}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-10 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <BedDouble className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Departments</h2>
          </div>
          <div className="mt-5 space-y-4">
            {departments.map((department) => (
              <div key={department.name} className="rounded-md border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{department.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {department.doctors} doctors · {department.beds} beds
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{department.occupancy}%</div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${department.occupancy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-3">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Today&apos;s Appointments</h2>
          </div>
          <div className="mt-5 divide-y rounded-md border bg-background">
            {appointments.map((appointment) => (
              <div
                key={`${appointment.patient}-${appointment.time}`}
                className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="font-medium">{appointment.patient}</div>
                  <div className="text-sm text-muted-foreground">
                    {appointment.doctor} · {appointment.time}
                  </div>
                </div>
                <span className="inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-semibold capitalize">
                  {appointment.status.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
