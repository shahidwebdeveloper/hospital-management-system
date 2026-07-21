import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Activity, CalendarCheck, HeartPulse, ShieldCheck, UsersRound } from "lucide-react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPreview />
  }
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "Patients", value: "1,284", icon: UsersRound },
    { label: "Appointments", value: "86", icon: CalendarCheck },
    { label: "Active Doctors", value: "42", icon: HeartPulse },
    { label: "Open Cases", value: "19", icon: Activity }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">HMS Command Center</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-normal">Hospital Management System</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">View Roadmap</Button>
            <Button>
              <ShieldCheck className="h-4 w-4" />
              Secure Login
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Operations Overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A role-aware foundation ready for authentication, scheduling, EMR, billing, lab,
                pharmacy, and dashboards.
              </p>
            </div>
            <span className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
              Phase 3
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-md border bg-background p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <div className="mt-4 text-2xl font-semibold">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold">Next Build Order</h2>
          <div className="mt-5 space-y-4">
            {["Authentication", "User Management", "Departments", "Doctor Scheduling"].map(
              (item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md border text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
