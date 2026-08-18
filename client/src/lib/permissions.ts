import { hasPermission } from "@hms/contracts";
import type { HmsUser, Permission } from "@hms/contracts";

export function can(user: HmsUser | null | undefined, permission: Permission) {
  return hasPermission(user?.role, permission);
}
