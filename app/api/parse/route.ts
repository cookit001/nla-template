import { NextRequest, NextResponse } from 'next/server';
import { LegalTemplateInputSchema, ParseApiResponse } from '../../../src/types';
import { renderLegalTemplate } from '../../../src/templates';
import { parseNdaRequestFromAi } from '../../../src/lib/ai';
import { inspectPromptSafety, REJECTION_OBJECTION_MESSAGE } from '../../../src/lib/guardrails';
import { logAuditEvent } from '../../../src/lib/logger';

// In-memory rate limiting tracker: IP -> { count: number, resetTime: number }
const MAX_AI_DAILY_USES = 3;
const aiUsageMap = new Map<string, { count: number; resetTime: number }>();

function checkAndIncrementAiRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const userUsage = aiUsageMap.get(ip);

  if (!userUsage || now > userUsage.resetTime) {
    aiUsageMap.set(ip, { count: 1, resetTime: now + dayMs });
    return { allowed: true, remaining: MAX_AI_DAILY_USES - 1 };
  }

  if (userUsage.count >= MAX_AI_DAILY_USES) {
    return { allowed: false, remaining: 0 };
  }

  userUsage.count += 1;
  return { allowed: true, remaining: MAX_AI_DAILY_USES - userUsage.count };
}

export async function POST(req: NextRequest): Promise<NextResponse<ParseApiResponse>> {
  try {
    const body = await req.json();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous_user';

    // Mode 1: Direct Structured Form Input (unlimited uses, bypasses AI rate limit)
    if (body.mode === 'structured') {
      const parsed = LegalTemplateInputSchema.safeParse(body.data);
      if (parsed.success) {
        const text = renderLegalTemplate(parsed.data);
        logAuditEvent({
          eventType: 'DOCUMENT_GENERATED',
          documentType: parsed.data.documentType,
          partyLengthA: parsed.data.partyA.length,
          partyLengthB: parsed.data.partyB.length,
        });

        return NextResponse.json({
          success: true,
          data: parsed.data,
          renderedText: text,
        });
      } else {
        logAuditEvent({
          eventType: 'VALIDATION_FAILED',
          documentType: body.data?.documentType || 'unknown',
          partyLengthA: 0,
          partyLengthB: 0,
          reason: 'Structured validation error',
        });

        return NextResponse.json({
          success: false,
          objection: REJECTION_OBJECTION_MESSAGE,
          reason: 'Invalid structured inputs provided',
        }, { status: 400 });
      }
    }

    // Mode 2: Natural Text Parsing using AI Extraction (capped at 3 uses per day)
    const rateCheck = checkAndIncrementAiRateLimit(clientIp);
    if (!rateCheck.allowed) {
      logAuditEvent({
        eventType: 'RATE_LIMIT_REACHED',
        documentType: 'ai_extraction',
        partyLengthA: 0,
        partyLengthB: 0,
        reason: 'Daily AI extraction limit of 3 uses reached',
      });

      return NextResponse.json({
        success: false,
        aiGenerationsRemaining: 0,
        objection: 'OBJECTION! You have reached your daily limit of 3 AI extractions. Please use the Form Wizard tab for unlimited document generation.',
        reason: 'Daily AI limit reached (3/3)',
      }, { status: 429 });
    }

    const prompt = body.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        success: false,
        aiGenerationsRemaining: rateCheck.remaining,
        objection: REJECTION_OBJECTION_MESSAGE,
        reason: 'Prompt string is required',
      }, { status: 400 });
    }

    const safety = inspectPromptSafety(prompt);
    if (!safety.safe) {
      logAuditEvent({
        eventType: 'OBJECTION_TRIGGERED',
        documentType: 'ai_extraction',
        partyLengthA: 0,
        partyLengthB: 0,
        reason: safety.reason,
      });

      return NextResponse.json({
        success: false,
        aiGenerationsRemaining: rateCheck.remaining,
        objection: REJECTION_OBJECTION_MESSAGE,
        reason: safety.reason,
      }, { status: 400 });
    }

    const aiResult = await parseNdaRequestFromAi(prompt, body.forceDocumentType);
    if (!aiResult.success || !aiResult.data) {
      logAuditEvent({
        eventType: 'OBJECTION_TRIGGERED',
        documentType: 'ai_extraction',
        partyLengthA: 0,
        partyLengthB: 0,
        reason: aiResult.error || 'AI parsing objection',
      });

      return NextResponse.json({
        success: false,
        aiGenerationsRemaining: rateCheck.remaining,
        objection: aiResult.objection || REJECTION_OBJECTION_MESSAGE,
        reason: aiResult.error,
      }, { status: 400 });
    }

    const text = renderLegalTemplate(aiResult.data);
    logAuditEvent({
      eventType: 'DOCUMENT_GENERATED',
      documentType: aiResult.data.documentType,
      partyLengthA: aiResult.data.partyA.length,
      partyLengthB: aiResult.data.partyB.length,
    });

    return NextResponse.json({
      success: true,
      data: aiResult.data,
      renderedText: text,
      aiGenerationsRemaining: rateCheck.remaining,
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      objection: REJECTION_OBJECTION_MESSAGE,
      reason: err.message || 'Internal server error',
    }, { status: 500 });
  }
}
