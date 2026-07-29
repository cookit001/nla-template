import { inspectPromptSafety, REJECTION_OBJECTION_MESSAGE } from './guardrails';
import { NdaInputSchema } from '../types';
import { fillNdaTemplate } from '../templates/nda';

// Lightweight test suite runner
function runTests() {
  console.log("=== Running NLA & Partners Guardrail & Schema Tests ===");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Guardrail Safety Tests
  assert(
    inspectPromptSafety("Draft an NDA between Party A and Party B for project discussions").safe === true,
    "Valid NDA request passes prompt safety"
  );

  assert(
    inspectPromptSafety("Give me legal advice on whether this contract is binding in court").safe === false,
    "Legal advice request fails prompt safety"
  );

  assert(
    inspectPromptSafety("Draft an operating agreement for my startup").safe === false,
    "Unsupported document type request fails prompt safety"
  );

  assert(
    inspectPromptSafety("Add a custom clause for non-compete indemnification").safe === false,
    "Custom clause request fails prompt safety"
  );

  // 2. Zod Schema Validation Tests
  const validInputs = NdaInputSchema.safeParse({
    partyA: "Acme Corp",
    partyB: "Beta LLC",
    effectiveDate: "2026-07-25",
    purpose: "Evaluating technical merger opportunities",
    termYears: 3,
    governingJurisdiction: "Global Jurisdiction",
    documentType: "nda"
  });
  assert(validInputs.success === true, "Valid Zod inputs parse successfully");

  const invalidInputs = NdaInputSchema.safeParse({
    partyA: "A", // too short (< 2)
    partyB: "Beta LLC",
    effectiveDate: "",
    purpose: "Short", // too short (< 5)
  });
  assert(invalidInputs.success === false, "Invalid Zod inputs fail validation");

  // 3. Template Engine Safety Tests
  if (validInputs.success) {
    const rendered = fillNdaTemplate(validInputs.data);
    assert(rendered.includes("Acme Corp"), "Template renders Party A name correctly");
    assert(rendered.includes("INFORMATIONAL TEMPLATE ONLY"), "Template includes mandatory non-advisory disclaimer");
    assert(!rendered.includes("<script>"), "Template sanitizes potential script injections");
  }

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
