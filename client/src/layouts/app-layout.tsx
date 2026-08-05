import {
  BadgeDollarSign,
  BellRing,
  Building2,
  CalendarCheck,
  ClipboardList,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCog,
  UsersRound
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { moduleDefinitions, roleLabels } from "@hms/contracts";
import type { AppRole, HospitalModule } from "@hms/contracts";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const moduleIcons: Record<HospitalModule | "dashboard", typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  departments: Building2,
  doctors: Stethoscope,
  patients: UsersRound,
  appointments: CalendarCheck,
  "medical-records": ClipboardList,
  prescriptions: Pill,
  laboratory: FlaskConical,
  pharmacy: Pill,
  billing: BadgeDollarSign,
  users: UserCog,
  notifications: BellRing,
  settings: Settings
};

const navItemsBase = [
  { label: "Dashboard", path: "/app/dashboard", key: "dashboard" as const },
  ...moduleDefinitions.map((module) => ({
    label: module.label,
    path: `/app${module.path}`,
    key: module.key,
    allowedRoles: module.allowedRoles
  }))
];

export default function AppLayout() {
  const { user, logout, loading } = useAuth();

  const visibleNav = navItemsBase.filter((item) => {
    if (item.key === "dashboard") return true;
    const role = user?.role as AppRole | undefined;
    if (!role) return true;
    return "allowedRoles" in item ? item.allowedRoles.includes(role) : true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b bg-card lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">HMS</p>
            <h1 className="text-lg font-semibold">Hospital System</h1>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:overflow-visible">
          {visibleNav.map((item) => {
            const Icon = moduleIcons[item.key];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition lg:flex lg:w-full ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="border-b bg-white">
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Operational workspace</p>
              <h2 className="text-xl font-semibold">Hospital Management Application</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                {loading ? (
                  "Checking session"
                ) : user ? (
                  <span>
                    <span className="font-medium">{user.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {roleLabels[user.role as AppRole]}
                    </span>
                  </span>
                ) : (
                  "Not signed in"
                )}
              </span>
              {user ? (
                <Button variant="outline" onClick={() => void logout()}>
                  Sign out
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}
