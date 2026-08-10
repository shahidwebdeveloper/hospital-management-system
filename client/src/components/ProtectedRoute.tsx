import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-center px-4">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <p className="text-lg font-semibold">Checking your session…</p>
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

  return children;
}
