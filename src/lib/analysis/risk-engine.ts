// ── LLM-Powered Risk Synthesis Engine ──

import { SDOH_RISK_ANALYSIS_PROMPT, RISK_DETAIL_PROMPT } from "./prompts";
import type { RiskAssessment, DetectedRisk, SharpContext } from "../types";
import { fetchAllPatientData } from "../fhir/client";

async function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LLM API error: ${response.status} ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0].message.content;
}

export async function analyzeSDOHRisks(context: SharpContext): Promise<RiskAssessment> {
  const patientData = await fetchAllPatientData(context);

  const userMessage = `Patient FHIR Data for analysis:

PATIENT:
${JSON.stringify(patientData.patient, null, 2)}

CONDITIONS (${patientData.conditions.length} found):
${JSON.stringify(patientData.conditions, null, 2)}

ENCOUNTERS (${patientData.encounters.length} found):
${JSON.stringify(patientData.encounters, null, 2)}

MEDICATION REQUESTS (${patientData.medicationRequests.length} found):
${JSON.stringify(patientData.medicationRequests, null, 2)}

MEDICATION DISPENSES (${patientData.medicationDispenses.length} found):
${JSON.stringify(patientData.medicationDispenses, null, 2)}

OBSERVATIONS / VITALS (${patientData.observations.length} found):
${JSON.stringify(patientData.observations, null, 2)}

COVERAGE / INSURANCE (${patientData.coverages.length} found):
${JSON.stringify(patientData.coverages, null, 2)}

Analyze this patient's data for social determinant risk factors. Return structured JSON.`;

  const llmResponse = await callLLM(SDOH_RISK_ANALYSIS_PROMPT, userMessage);
  const parsed = JSON.parse(llmResponse) as {
    risks: DetectedRisk[];
    overall_social_risk: "HIGH" | "MODERATE" | "LOW";
  };

  return {
    patient_id: context.patientId,
    scan_date: new Date().toISOString(),
    risks: parsed.risks,
    overall_social_risk: parsed.overall_social_risk,
  };
}

export async function getRiskDetails(
  context: SharpContext,
  riskCategory: string,
  existingAssessment?: RiskAssessment
): Promise<string> {
  const patientData = await fetchAllPatientData(context);

  const riskInfo = existingAssessment?.risks.find((r) => r.category === riskCategory);

  const userMessage = `Risk Category: ${riskCategory}

${riskInfo ? `Existing Assessment:\n${JSON.stringify(riskInfo, null, 2)}\n\n` : ""}
Relevant FHIR Data:
${JSON.stringify(patientData, null, 2)}

Provide an expanded analysis for the "${riskCategory}" risk factor.`;

  return callLLM(RISK_DETAIL_PROMPT, userMessage);
}
