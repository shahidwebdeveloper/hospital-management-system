type AuditAction =
  | "clinical_result_finalized"
  | "clinical_record_updated"
  | "role_changed"
  | "privilege_changed"
  | "security_config_validated";

type AuditEntry = {
  actorId?: string;
  actorRole?: string;
  targetId?: string;
  targetType?: string;
  action: AuditAction;
  details?: Record<string, unknown>;
  createdAt: Date;
};

const auditEntries: AuditEntry[] = [];

export function writeAuditLog(entry: Omit<AuditEntry, "createdAt">) {
  auditEntries.push({
    ...entry,
    createdAt: new Date()
  });

  return auditEntries[auditEntries.length - 1];
}

export function getAuditEntries() {
  return [...auditEntries];
}

export function logClinicalAudit({
  actorId,
  actorRole,
  targetId,
  targetType,
  action,
  details
}: Omit<AuditEntry, "createdAt">) {
  return writeAuditLog({
    actorId,
    actorRole,
    targetId,
    targetType,
    action,
    details
  });
}
