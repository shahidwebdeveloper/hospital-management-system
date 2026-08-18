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

export default function ProtectedRoute({ children, allowedRoles, allowed = true }: ProtectedRouteProps) {
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <section className="max-w-md rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-sm font-semibold text-destructive">403 Forbidden</p>
          <h1 className="mt-2 text-2xl font-semibold">You do not have access to this page</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your current role is {roleLabels[user.role as AppRole]}. Please use the modules allowed
            for your account.
          </p>
        </section>
      </main>
    );
  }

  return children;
}


