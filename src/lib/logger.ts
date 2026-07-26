export interface AuditLogEntry {
  timestamp: string;
  eventType: 'DOCUMENT_GENERATED' | 'NDA_GENERATED' | 'OBJECTION_TRIGGERED' | 'VALIDATION_FAILED' | 'RATE_LIMIT_REACHED';
  documentType: string;
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
