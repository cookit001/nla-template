export interface AuditLogEntry {
  timestamp: string;
  eventType: 'NDA_GENERATED' | 'OBJECTION_TRIGGERED' | 'VALIDATION_FAILED';
  documentType: 'nda';
  partyLengthA: number;
  partyLengthB: number;
  ipHash?: string;
  reason?: string;
}

export function logAuditEvent(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const logData: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    ...entry,
  };

  // Structured stdout logger (compatible with Datadog, Vercel Logs, and GCP Cloud Logging)
  console.log(JSON.stringify({ audit: true, ...logData }));
}
