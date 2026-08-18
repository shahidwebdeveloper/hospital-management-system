import type { ReactElement } from "react";

import type { Permission } from "@hms/contracts";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { can } from "@/lib/permissions";

export function useCan() {
  const { user } = useAuth();

  return (permission: Permission) => can(user, permission);
}

export function RequirePermission({ children, permission }: { children: ReactElement; permission: Permission }) {
  const { user } = useAuth();

  return <ProtectedRoute allowed={user ? can(user, permission) : false}>{children}</ProtectedRoute>;
}
