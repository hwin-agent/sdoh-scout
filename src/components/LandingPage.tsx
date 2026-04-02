"use client";

import RiskCard from "@/components/RiskCard";
import ReferralCard from "@/components/ReferralCard";
import ScrollReveal from "@/components/ScrollReveal";
import dynamic from "next/dynamic";

// Lazy load map (needs browser APIs / Leaflet)
const ResourceMap = dynamic(() => import("@/components/ResourceMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] rounded-[4px] border border-border bg-teal-light flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
        <span className="font-sans text-sm text-slate/70">Loading map...</span>
      </div>
    </div>
  ),
});

const A2ATransition = dynamic(() => import("@/components/A2ATransition"), {
  ssr: false,
});

// ─── Demo Data ───────────────────────────────────────────────
// Matches Maria Santos scenario exactly from the demo script

const DEMO_RISKS = [
  {
    category: "housing_instability",
    severity: "HIGH" as const,
    signals: [
      {
        description: "ICD-10 Z59.1 — Inadequate housing logged, never acted on",
        fhir_resource_type: "Condition",
        fhir_resource_id: "cond-z59-001",
        date: "2025-09-15",
      },
      {
        description:
          "4 ED visits in 90 days — respiratory complaints suggesting environmental triggers",
        fhir_resource_type: "Encounter",
        fhir_resource_id: "enc-ed-001..004",
        date: "2026-01-08 to 2026-03-10",
      },
      {
        description: "Address in census tract with 34% poverty rate",
        fhir_resource_type: "Patient",
        fhir_resource_id: "maria-santos-12345",
        date: "2026-03-10",
      },
    ],
    summary:
      "Housing instability code was documented six months ago but no referral was generated. Recurrent ED visits for respiratory issues correlate with substandard housing conditions (mold, poor ventilation).",
    recommended_action:
      "Screen for housing safety at next visit. Refer to housing assistance program. Consider home health assessment for environmental triggers.",
  },
  {
    category: "medication_access",
    severity: "HIGH" as const,
    signals: [
      {
        description:
          "2 missed albuterol refills — no dispense record since Dec 2025",
        fhir_resource_type: "MedicationRequest",
        fhir_resource_id: "medrx-albuterol-001",
        date: "2025-11-01",
      },
      {
        description:
          "No pharmacy claims in last 60 days despite active prescription",
        fhir_resource_type: "MedicationDispense",
        fhir_resource_id: "meddisp-albuterol-002",
        date: "2025-12-10",
      },
      {
        description:
          "Insurance coverage gap: Jan–Feb 2026 (2 months without active Medicaid)",
        fhir_resource_type: "Coverage",
        fhir_resource_id: "cov-medicaid-001",
        date: "2025-12-31",
      },
    ],
    summary:
      "Active albuterol prescription with no fills for 3+ months coincides with Medicaid coverage gap. Patient likely unable to afford rescue inhaler during uninsured period, contributing to repeated ED visits.",
    recommended_action:
      "Enroll in prescription assistance program. Verify Medicaid re-enrollment status. Provide 90-day emergency medication supply.",
  },
  {
    category: "food_insecurity",
    severity: "MODERATE" as const,
    signals: [
      {
        description:
          "BMI decline from 24.1 → 21.3 over 6 months (12% decrease)",
        fhir_resource_type: "Observation",
        fhir_resource_id: "obs-bmi-001..003",
        date: "2025-09-15 to 2026-03-10",
      },
      {
        description: "Dependent child diagnosed with iron-deficiency anemia",
        fhir_resource_type: "Condition",
        fhir_resource_id: "cond-iron-child-003",
        date: "2026-01-20",
      },
      {
        description:
          "2 missed well-child visits — possible transportation or access barrier",
        fhir_resource_type: "Encounter",
        fhir_resource_id: "enc-ed-001",
        date: "2026-01-08",
      },
    ],
    summary:
      "Progressive weight loss combined with child's nutritional deficiency suggests food insecurity in the household. Missed pediatric visits may indicate competing priorities or access barriers.",
    recommended_action:
      "Screen with Hunger Vital Sign tool. Refer to local food pantry near children's school. Connect to WIC/SNAP if not enrolled.",
  },
];

const DEMO_REFERRALS = [
  {
    name: "Covenant House Housing Assistance",
    address: "1234 Main St, Springfield, MO 65801",
    distance_miles: 2.3,
    phone: "(555) 123-4567",
    status: "accepting_applications",
    services: [
      "Emergency shelter",
      "Transitional housing",
      "Case management",
    ],
    eligibility_met: true,
    match_reason: "Addresses housing instability risk (HIGH severity)",
  },
  {
    name: "NeedyMeds Prescription Assistance",
    address: "Online Program",
    distance_miles: null,
    phone: "(800) 503-6897",
    status: "enrollment_open",
    services: [
      "Free/reduced medications",
      "Copay assistance",
      "Patient assistance programs",
    ],
    eligibility_met: true,
    match_reason: "Addresses medication access barriers (HIGH severity)",
  },
  {
    name: "Harvest Hope Food Pantry",
    address: "567 Elm Ave, Springfield, MO 65802",
    distance_miles: 0.8,
    phone: "(555) 987-6543",
    status: "open",
    services: [
      "Weekly food boxes",
      "Fresh produce",
      "Children's nutrition packs",
    ],
    eligibility_met: true,
    match_reason:
      "Addresses food insecurity risk (MODERATE severity) — near children's school",
  },
];

// ─── Page ────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-[55%]">
            <p className="font-mono text-xs text-teal tracking-wide uppercase mb-5">
              SDOH Scout
            </p>
            <h1 className="font-serif text-5xl lg:text-[56px] text-slate leading-[1.08] mb-6">
              See what the EHR&nbsp;misses.
            </h1>
            <p className="font-sans text-xl text-slate/70 leading-relaxed mb-10 max-w-xl">
              SDOH Scout detects social risk factors hiding in patient records
              and connects patients to community resources automatically.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#demo"
                className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-[#0a5c5c] transition-colors"
              >
                See it in action ↓
              </a>
              <a
                href="https://app.promptopinion.ai"
                className="font-sans text-sm font-medium text-teal border border-teal px-6 py-3 rounded-[6px] hover:bg-teal-light transition-colors"
              >
                View on Prompt Opinion
              </a>
            </div>
          </div>

          {/* Mini risk card preview — the "at a glance" summary */}
          <div className="lg:w-[45%] w-full lg:mt-4">
            <div className="bg-white border border-border rounded-[4px] overflow-hidden">
              <div className="bg-surface px-5 py-3 border-b border-border">
                <p className="font-mono text-[11px] text-teal">
                  scan_sdoh_risks → Patient/maria-santos-12345
                </p>
              </div>
              <div className="p-5 space-y-2">
                {[
                  {
                    label: "Housing Instability",
                    level: "HIGH",
                    color: "bg-terracotta",
                  },
                  {
                    label: "Medication Access",
                    level: "HIGH",
                    color: "bg-terracotta",
                  },
                  {
                    label: "Food Insecurity",
                    level: "MODERATE",
                    color: "bg-amber",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between bg-surface px-3 py-2.5 rounded-[4px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${r.color} risk-pulse`}
                      />
                      <span className="font-sans text-sm text-slate">
                        {r.label}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate/50">
                      {r.level}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-4">
                <p className="font-mono text-[11px] text-sage">
                  ✓ 3 risks detected · 3 community resources matched
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-teal text-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col lg:flex-row items-baseline gap-8 lg:gap-16">
              <p className="font-serif text-[120px] lg:text-[160px] leading-none shrink-0">
                80%
              </p>
              <div>
                <p className="font-sans text-xl leading-relaxed opacity-90 mb-4">
                  of health outcomes are driven by factors outside the
                  clinic.
                </p>
                <p className="font-sans text-base leading-relaxed opacity-70">
                  But the average physician has seven minutes per visit — no
                  time to screen for social risk. The clues are already in the
                  EHR. Nobody&apos;s connecting the dots.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-slate mb-16">
            How it works
          </h2>
        </ScrollReveal>
        <div className="relative">
          {/* Connecting line behind the steps */}
          <div
            className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-[1px]"
            style={{
              background:
                "repeating-linear-gradient(90deg, #D4CFC7 0, #D4CFC7 8px, transparent 8px, transparent 16px)",
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
            {[
              {
                step: "01",
                title: "Detect",
                desc: "The MCP server queries FHIR patient data — conditions, encounters, medications, vitals, coverage — and uses AI to synthesize social risk signals across resource types.",
                detail: "scan_sdoh_risks",
              },
              {
                step: "02",
                title: "Match",
                desc: "Detected risks are matched to local community resources based on category, eligibility, geographic proximity, and current availability.",
                detail: "match_community_resources",
              },
              {
                step: "03",
                title: "Refer",
                desc: "FHIR ServiceRequest referrals are generated automatically — ready for a care coordinator to review and activate with one click.",
                detail: "ServiceRequest → draft",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 120}>
                <div className="px-6 relative">
                  {/* Step number circle */}
                  <div className="w-16 h-16 rounded-full border-2 border-teal flex items-center justify-center mb-6 bg-bg relative z-10">
                    <span className="font-mono text-sm text-teal font-medium">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-slate mb-3">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-slate/70 leading-relaxed mb-5">
                    {item.desc}
                  </p>
                  <span className="font-mono text-[11px] text-teal bg-teal-light/60 px-2.5 py-1 rounded-[3px]">
                    {item.detail}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo: Risk Detection ── */}
      <section id="demo" className="bg-surface py-24">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-10">
              <p className="font-mono text-[11px] text-teal mb-3 tracking-wide">
                PATIENT: MARIA SANTOS · ID: maria-santos-12345
              </p>
              <h2 className="font-serif text-3xl text-slate mb-3">
                Risk Detection Dashboard
              </h2>
              <p className="font-sans text-base text-slate/60 max-w-2xl">
                Three social risk factors — from data already in the EHR.{" "}
                <span className="text-slate/80 font-medium">
                  The clues were there all along.
                </span>
              </p>
            </div>
          </ScrollReveal>
          <div className="space-y-5">
            {DEMO_RISKS.map((risk, i) => (
              <ScrollReveal key={risk.category} delay={i * 150}>
                <RiskCard {...risk} animate={false} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── A2A Transition ── */}
      <A2ATransition />

      {/* ── Demo: Community Resources ── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="mb-10">
              <p className="font-mono text-[11px] text-sage mb-3 tracking-wide">
                A2A AGENT → COMMUNITY RESOURCE MATCHING
              </p>
              <h2 className="font-serif text-3xl text-slate mb-3">
                Community Resources
              </h2>
              <p className="font-sans text-base text-slate/60 max-w-2xl">
                Each risk matched to a local program. Eligibility verified.
                FHIR referrals generated automatically.
              </p>
            </div>
          </ScrollReveal>

          {/* Map visualization */}
          <ScrollReveal className="mb-10">
            <ResourceMap />
          </ScrollReveal>

          {/* Referral cards */}
          <div className="space-y-5">
            {DEMO_REFERRALS.map((ref, i) => (
              <ScrollReveal key={ref.name} delay={i * 120}>
                <ReferralCard {...ref} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Video ── */}
      <section className="bg-surface py-24">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <p className="font-mono text-[11px] text-teal mb-3 tracking-wide">
              DEMO VIDEO
            </p>
            <h2 className="font-serif text-3xl text-slate mb-3">
              Watch SDOH Scout in action
            </h2>
            <p className="font-sans text-base text-slate/60 mb-8">
              See SDOH Scout functioning within the Prompt Opinion platform —
              from risk detection to community resource referral in seconds.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="relative aspect-video bg-white border border-border rounded-[4px] overflow-hidden flex items-center justify-center">
              {/* Placeholder until video is recorded */}
              <div className="text-center px-6">
                <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center mx-auto mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-6 h-6 text-teal"
                  >
                    <path
                      d="M8 5.14v14l11-7-11-7z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <p className="font-sans text-sm text-slate/60">
                  Demo video coming soon
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Technical Details ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-serif text-3xl text-slate mb-16">
              Technical Details
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ScrollReveal>
              <div>
                <h3 className="font-serif text-xl text-slate mb-6">
                  MCP Server Tools
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "scan_sdoh_risks",
                      desc: "Analyzes FHIR patient data for social determinant risk signals using LLM synthesis",
                    },
                    {
                      name: "get_risk_details",
                      desc: "Returns expanded analysis for a specific risk category with screening questions",
                    },
                    {
                      name: "match_community_resources",
                      desc: "Matches detected risks to local community programs and generates FHIR referrals",
                    },
                  ].map((tool) => (
                    <div
                      key={tool.name}
                      className="bg-white border border-border rounded-[4px] p-5 hover:border-teal/30 transition-colors"
                    >
                      <p className="font-mono text-sm text-teal mb-1.5">
                        {tool.name}
                      </p>
                      <p className="font-sans text-sm text-slate/70">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div>
                <h3 className="font-serif text-xl text-slate mb-6">
                  SHARP Context Propagation
                </h3>
                <div className="bg-white border border-border rounded-[4px] p-5 mb-8">
                  <p className="font-sans text-sm text-slate/70 mb-4">
                    SDOH Scout uses SHARP extension headers for secure patient
                    context propagation through multi-agent call chains:
                  </p>
                  <div className="space-y-1.5">
                    {[
                      "X-Patient-ID: maria-santos-12345",
                      "X-FHIR-Server-URL: https://fhir.example.com/r4",
                      "X-FHIR-Access-Token: [bearer-token]",
                    ].map((header) => (
                      <p
                        key={header}
                        className="font-mono text-[11px] text-teal bg-teal-light/50 px-3 py-1.5 rounded-[3px]"
                      >
                        {header}
                      </p>
                    ))}
                  </div>
                </div>

                <h3 className="font-serif text-xl text-slate mb-6">
                  FHIR Resources Analyzed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Patient",
                    "Condition",
                    "Encounter",
                    "MedicationRequest",
                    "MedicationDispense",
                    "Observation",
                    "Coverage",
                  ].map((r) => (
                    <span
                      key={r}
                      className="font-mono text-[11px] text-slate bg-white border border-border px-3 py-1.5 rounded-[4px]"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-lg text-slate">SDOH Scout</p>
            <p className="font-sans text-sm text-slate/50 mt-0.5">
              Built for Agents Assemble — The Healthcare AI Endgame
            </p>
          </div>
          <div className="flex items-center gap-8">
            <a
              href="https://github.com/hwin-agent/sdoh-scout"
              className="font-sans text-sm text-slate/60 hover:text-teal transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://app.promptopinion.ai"
              className="font-sans text-sm text-slate/60 hover:text-teal transition-colors"
            >
              Prompt Opinion
            </a>
            <a
              href="https://agents-assemble.devpost.com"
              className="font-sans text-sm text-slate/60 hover:text-teal transition-colors"
            >
              Devpost
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
