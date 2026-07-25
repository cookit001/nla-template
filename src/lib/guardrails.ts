export const REJECTION_OBJECTION_MESSAGE = 
  "OBJECTION! Request falls outside NLA & Partners scope.";

const FORBIDDEN_KEYWORDS = [
  "legal advice",
  "am I liable",
  "sue",
  "court case",
  "custom clause",
  "indemnity clause",
  "arbitration clause",
  "enforceable",
  "is this valid in court",
  "lawyer advice",
  "attorney",
  "represent me",
  "operating agreement",
  "will and testament",
  "employment contract",
  "service agreement",
  "lawsuit",
];

export function inspectPromptSafety(rawInput: string): { safe: boolean; reason?: string } {
  const normalized = rawInput.toLowerCase();
  
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        safe: false,
        reason: `Unsupported request or illegal/legal advice request containing keyword '${keyword}'`,
      };
    }
  }

  return { safe: true };
}
