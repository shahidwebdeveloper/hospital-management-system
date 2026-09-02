import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";

import type { AppRole } from "@hms/contracts";
import { roleLabels } from "@hms/contracts";

import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: readonly AppRole[];
  allowed?: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  allowed = true
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-lg font-semibold">Checking your session...</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowed || (allowedRoles && !allowedRoles.includes(user.role))) {
    const roleLabel = roleLabels[user.role as AppRole] ?? user.role;

    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <section className="max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-sm font-semibold text-destructive">403 Forbidden</p>
          <h1 className="mt-2 text-2xl font-semibold">Access restricted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account is currently signed in as {roleLabel}, and this page is not available for
            that role.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Please use one of the modules assigned to your account or contact an administrator.
          </p>
        </section>
      </main>
    );
  }

  return children;
}
