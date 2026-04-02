// ── SDOH Scout MCP Server ──

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { analyzeSDOHRisks, getRiskDetails } from "../analysis/risk-engine";
import { matchResourcesToRisks, generateAllReferrals } from "./resource-matcher";
import type { SharpContext, RiskAssessment } from "../types";

// In-memory cache of last assessment for detail drill-down
let lastAssessment: RiskAssessment | null = null;

export function createMCPServer() {
  const server = new McpServer({
    name: "sdoh-scout",
    version: "1.0.0",
  });

  // ── Tool: scan_sdoh_risks ──
  server.tool(
    "scan_sdoh_risks",
    "Scan a patient's FHIR record for social determinant of health (SDOH) risk factors. Analyzes conditions, encounters, medications, vitals, and coverage data to identify housing instability, food insecurity, medication access barriers, transportation issues, and financial strain. Uses SHARP context for patient identification.",
    {
      patient_id: z.string().optional().describe("Patient ID (uses SHARP context X-Patient-ID if not provided)"),
      fhir_server_url: z.string().optional().describe("FHIR server URL (uses SHARP context X-FHIR-Server-URL if not provided)"),
      fhir_access_token: z.string().optional().describe("FHIR access token (uses SHARP context X-FHIR-Access-Token if not provided)"),
    },
    async (params, extra) => {
      try {
        // Extract SHARP context from headers or params
        const extraHeaders = extra as unknown as Record<string, string> | undefined;
        const context: SharpContext = {
          patientId:
            params.patient_id ??
            extraHeaders?.["X-Patient-ID"] ??
            "maria-santos-12345",
          fhirServerUrl:
            params.fhir_server_url ??
            extraHeaders?.["X-FHIR-Server-URL"] ??
            "synthetic",
          fhirAccessToken:
            params.fhir_access_token ??
            extraHeaders?.["X-FHIR-Access-Token"] ??
            "",
        };

        const assessment = await analyzeSDOHRisks(context);
        lastAssessment = assessment;

        // Also generate resource matches
        const referrals = generateAllReferrals(assessment);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  assessment,
                  community_resources: referrals.map((r) => ({
                    resource_name: r.resource.name,
                    resource_category: r.resource.category,
                    address: r.resource.address,
                    phone: r.resource.phone,
                    distance_miles: r.resource.distance_miles,
                    status: r.resource.status,
                    services: r.resource.services,
                    eligibility_met: r.eligibility_met,
                    match_reason: r.match_reason,
                    referral: r.serviceRequest,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error scanning SDOH risks: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── Tool: get_risk_details ──
  server.tool(
    "get_risk_details",
    "Get expanded details for a specific SDOH risk category, including deeper evidence analysis, clinical context, screening questions, and potential health impact. Run scan_sdoh_risks first.",
    {
      risk_category: z.enum([
        "housing_instability",
        "food_insecurity",
        "medication_access",
        "transportation",
        "financial_strain",
      ]).describe("The risk category to get details for"),
      patient_id: z.string().optional().describe("Patient ID"),
    },
    async (params) => {
      try {
        const context: SharpContext = {
          patientId: params.patient_id ?? lastAssessment?.patient_id ?? "maria-santos-12345",
          fhirServerUrl: "synthetic",
          fhirAccessToken: "",
        };

        const details = await getRiskDetails(
          context,
          params.risk_category,
          lastAssessment ?? undefined
        );

        return {
          content: [{ type: "text" as const, text: details }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error getting risk details: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ── Tool: match_community_resources ──
  server.tool(
    "match_community_resources",
    "Match detected SDOH risks to local community resources and generate FHIR ServiceRequest referrals. Requires a prior scan_sdoh_risks call.",
    {
      patient_id: z.string().optional().describe("Patient ID"),
    },
    async () => {
      try {
        if (!lastAssessment) {
          return {
            content: [
              {
                type: "text" as const,
                text: "No risk assessment available. Please run scan_sdoh_risks first.",
              },
            ],
            isError: true,
          };
        }

        const referrals = generateAllReferrals(lastAssessment);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  patient_id: lastAssessment.patient_id,
                  matches: referrals.map((r) => ({
                    resource: r.resource,
                    matched_risk_category: r.matched_risk.category,
                    matched_risk_severity: r.matched_risk.severity,
                    eligibility_met: r.eligibility_met,
                    match_reason: r.match_reason,
                    service_request: r.serviceRequest,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error matching resources: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
