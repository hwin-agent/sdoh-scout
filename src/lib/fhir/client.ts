// ── FHIR Client ──
// Queries FHIR server for patient resources.
// Falls back to synthetic bundle if FHIR server is unavailable (for demo).

import type { SharpContext } from "../types";
import mariaSantosBundleData from "../data/maria-santos-bundle.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FHIRBundle = { resourceType: string; entry?: Array<{ resource: any }> };

const mariaSantosBundle = mariaSantosBundleData as FHIRBundle;

export async function queryFHIR(
  context: SharpContext,
  resourceType: string,
  params?: Record<string, string>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> {
  // If we have a real FHIR server URL, try it first
  if (context.fhirServerUrl && context.fhirServerUrl !== "synthetic") {
    try {
      const searchParams = new URLSearchParams({
        patient: context.patientId,
        ...params,
      });
      const url = `${context.fhirServerUrl}/${resourceType}?${searchParams}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${context.fhirAccessToken}`,
          Accept: "application/fhir+json",
        },
      });
      if (response.ok) {
        const bundle = (await response.json()) as FHIRBundle;
        return bundle.entry?.map((e) => e.resource) ?? [];
      }
    } catch {
      // Fall through to synthetic data
    }
  }

  // Fallback: use synthetic Maria Santos bundle
  return (
    mariaSantosBundle.entry
      ?.filter((e) => e.resource.resourceType === resourceType)
      .map((e) => e.resource) ?? []
  );
}

export async function fetchAllPatientData(context: SharpContext) {
  const [conditions, encounters, medicationRequests, medicationDispenses, observations, coverages, patients] =
    await Promise.all([
      queryFHIR(context, "Condition"),
      queryFHIR(context, "Encounter"),
      queryFHIR(context, "MedicationRequest"),
      queryFHIR(context, "MedicationDispense"),
      queryFHIR(context, "Observation", { category: "vital-signs" }),
      queryFHIR(context, "Coverage"),
      queryFHIR(context, "Patient"),
    ]);

  return {
    patient: patients[0] ?? null,
    conditions,
    encounters,
    medicationRequests,
    medicationDispenses,
    observations,
    coverages,
  };
}
