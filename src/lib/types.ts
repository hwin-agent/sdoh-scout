// ── SDOH Scout Type Definitions ──

export type RiskSeverity = "HIGH" | "MODERATE" | "LOW";

export type RiskCategory =
  | "housing_instability"
  | "food_insecurity"
  | "medication_access"
  | "transportation"
  | "financial_strain";

export interface RiskSignal {
  description: string;
  fhir_resource_type: string;
  fhir_resource_id: string;
  date: string;
}

export interface DetectedRisk {
  category: RiskCategory;
  severity: RiskSeverity;
  signals: RiskSignal[];
  summary: string;
  recommended_action: string;
}

export interface RiskAssessment {
  patient_id: string;
  scan_date: string;
  risks: DetectedRisk[];
  overall_social_risk: RiskSeverity;
}

export interface CommunityResource {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  distance_miles: number | null;
  phone: string;
  status: string;
  eligibility: Record<string, unknown>;
  services: string[];
  hours: string;
  match_risk: string;
}

export interface ResourceMatch {
  resource: CommunityResource;
  matched_risk: DetectedRisk;
  eligibility_met: boolean;
  match_reason: string;
}

export interface FHIRServiceRequest {
  resourceType: "ServiceRequest";
  status: "draft" | "active";
  intent: "order";
  category: Array<{
    coding: Array<{ system: string; code: string; display: string }>;
  }>;
  subject: { reference: string };
  reasonReference: Array<{ reference: string; display: string }>;
  performer: Array<{ display: string }>;
  note: Array<{ text: string }>;
}

// SHARP context from Prompt Opinion headers
export interface SharpContext {
  patientId: string;
  fhirServerUrl: string;
  fhirAccessToken: string;
}
