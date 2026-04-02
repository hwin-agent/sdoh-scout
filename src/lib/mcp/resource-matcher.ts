// ── Community Resource Matcher ──

import communityResourceData from "../data/community-resources.json";
import type {
  CommunityResource,
  DetectedRisk,
  ResourceMatch,
  FHIRServiceRequest,
  RiskAssessment,
} from "../types";

const resources = communityResourceData.resources as CommunityResource[];

const RISK_TO_CATEGORY_MAP: Record<string, string[]> = {
  housing_instability: ["housing"],
  food_insecurity: ["food"],
  medication_access: ["medication"],
  transportation: ["transportation"],
  financial_strain: ["financial"],
};

export function matchResourcesToRisks(assessment: RiskAssessment): ResourceMatch[] {
  const matches: ResourceMatch[] = [];

  for (const risk of assessment.risks) {
    const categories = RISK_TO_CATEGORY_MAP[risk.category] ?? [];
    const matched = resources.filter((r) => categories.includes(r.category));

    for (const resource of matched) {
      matches.push({
        resource,
        matched_risk: risk,
        eligibility_met: true, // Simplified for demo — in production would check against patient demographics
        match_reason: `Addresses ${risk.category.replace(/_/g, " ")} risk (${risk.severity} severity)`,
      });
    }
  }

  return matches;
}

export function generateServiceRequest(
  patientId: string,
  risk: DetectedRisk,
  resource: CommunityResource
): FHIRServiceRequest {
  return {
    resourceType: "ServiceRequest",
    status: "draft",
    intent: "order",
    category: [
      {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "410606002",
            display: "Social service procedure",
          },
        ],
      },
    ],
    subject: { reference: `Patient/${patientId}` },
    reasonReference: [
      {
        reference: `Condition/${risk.signals[0]?.fhir_resource_id ?? "unknown"}`,
        display: risk.summary,
      },
    ],
    performer: [{ display: resource.name }],
    note: [
      {
        text: `Auto-generated referral for ${risk.category.replace(/_/g, " ")} risk. ${resource.name} — ${resource.services.join(", ")}. Contact: ${resource.phone}`,
      },
    ],
  };
}

export function generateAllReferrals(assessment: RiskAssessment) {
  const matches = matchResourcesToRisks(assessment);

  return matches.map((match) => ({
    ...match,
    serviceRequest: generateServiceRequest(
      assessment.patient_id,
      match.matched_risk,
      match.resource
    ),
  }));
}
