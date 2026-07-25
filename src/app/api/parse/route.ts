import { NextRequest, NextResponse } from 'next/server';
import { NdaInputSchema, ParseApiResponse } from '@/types';
import { fillNdaTemplate } from '@/templates/nda';
import { parseNdaRequestFromAi } from '@/lib/ai';
import { inspectPromptSafety, REJECTION_OBJECTION_MESSAGE } from '@/lib/guardrails';
import { logAuditEvent } from '@/lib/logger';

export async function POST(req: NextRequest): Promise<NextResponse<ParseApiResponse>> {
  try {
    const body = await req.json();
    
    // Mode 1: Direct Structured Form Input (bypasses AI if form fully filled)
    if (body.mode === 'structured') {
      const parsed = NdaInputSchema.safeParse(body.data);
      if (parsed.success) {
        const text = fillNdaTemplate(parsed.data);
        logAuditEvent({
          eventType: 'NDA_GENERATED',
          documentType: 'nda',
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
          documentType: 'nda',
          partyLengthA: 0,
          partyLengthB: 0,
          reason: 'Structured validation error',
        });

        return NextResponse.json({
          success: false,
          objection: REJECTION_OBJECTION_MESSAGE,
          reason: "Invalid structured inputs provided",
        }, { status: 400 });
      }
    }

    // Mode 2: Natural Text Parsing using AI Extraction
    const prompt = body.prompt;
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({
        success: false,
        objection: REJECTION_OBJECTION_MESSAGE,
        reason: "Prompt string is required",
      }, { status: 400 });
    }

    const safety = inspectPromptSafety(prompt);
    if (!safety.safe) {
      logAuditEvent({
        eventType: 'OBJECTION_TRIGGERED',
        documentType: 'nda',
        partyLengthA: 0,
        partyLengthB: 0,
        reason: safety.reason,
      });

      return NextResponse.json({
        success: false,
        objection: REJECTION_OBJECTION_MESSAGE,
        reason: safety.reason,
      }, { status: 400 });
    }

    const aiResult = await parseNdaRequestFromAi(prompt);
    if (!aiResult.success || !aiResult.data) {
      logAuditEvent({
        eventType: 'OBJECTION_TRIGGERED',
        documentType: 'nda',
        partyLengthA: 0,
        partyLengthB: 0,
        reason: aiResult.error || 'AI parsing objection',
      });

      return NextResponse.json({
        success: false,
        objection: aiResult.objection || REJECTION_OBJECTION_MESSAGE,
        reason: aiResult.error,
      }, { status: 400 });
    }

    const text = fillNdaTemplate(aiResult.data);
    logAuditEvent({
      eventType: 'NDA_GENERATED',
      documentType: 'nda',
      partyLengthA: aiResult.data.partyA.length,
      partyLengthB: aiResult.data.partyB.length,
    });

    return NextResponse.json({
      success: true,
      data: aiResult.data,
      renderedText: text,
    });

  } catch (err: any) {
    return NextResponse.json({
      success: false,
      objection: REJECTION_OBJECTION_MESSAGE,
      reason: err.message || "Internal server error",
    }, { status: 500 });
  }
}

