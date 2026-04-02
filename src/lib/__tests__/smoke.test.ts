import { describe, it, expect } from "vitest";
import { matchResourcesToRisks, generateAllReferrals } from "../mcp/resource-matcher";
import type { RiskAssessment } from "../types";

const MOCK_ASSESSMENT: RiskAssessment = {
  patient_id: "maria-santos-12345",
  scan_date: new Date().toISOString(),
  risks: [
    {
      category: "housing_instability",
      severity: "HIGH",
      signals: [
        {
          description: "Z59.1 — Inadequate housing",
          fhir_resource_type: "Condition",
          fhir_resource_id: "cond-z59-001",
          date: "2025-09-15",
        },
      ],
      summary: "Housing instability detected",
      recommended_action: "Refer to housing assistance",
    },
    {
      category: "food_insecurity",
      severity: "MODERATE",
      signals: [
        {
          description: "BMI decline",
          fhir_resource_type: "Observation",
          fhir_resource_id: "obs-bmi-001",
          date: "2025-09-15",
        },
      ],
      summary: "Food insecurity detected",
      recommended_action: "Refer to food pantry",
    },
  ],
  overall_social_risk: "HIGH",
};

describe("Resource Matcher", () => {
  it("matches risks to community resources", () => {
    const matches = matchResourcesToRisks(MOCK_ASSESSMENT);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((m) => m.resource.category === "housing")).toBe(true);
    expect(matches.some((m) => m.resource.category === "food")).toBe(true);
  });

  it("generates FHIR ServiceRequest referrals", () => {
    const referrals = generateAllReferrals(MOCK_ASSESSMENT);
    expect(referrals.length).toBeGreaterThan(0);
    for (const r of referrals) {
      expect(r.serviceRequest.resourceType).toBe("ServiceRequest");
      expect(r.serviceRequest.status).toBe("draft");
      expect(r.serviceRequest.intent).toBe("order");
      expect(r.serviceRequest.subject.reference).toContain("maria-santos");
    }
  });
});

describe("Build", () => {
  it("can import core modules", async () => {
    const types = await import("../types");
    expect(types).toBeDefined();
  });
});
