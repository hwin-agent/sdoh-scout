import RiskCard from "@/components/RiskCard";
import ReferralCard from "@/components/ReferralCard";

// Demo data matching Maria Santos scenario exactly
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
        description: "4 ED visits in 90 days — respiratory complaints suggesting environmental triggers",
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
        description: "2 missed albuterol refills — no dispense record since Dec 2025",
        fhir_resource_type: "MedicationRequest",
        fhir_resource_id: "medrx-albuterol-001",
        date: "2025-11-01",
      },
      {
        description: "No pharmacy claims in last 60 days despite active prescription",
        fhir_resource_type: "MedicationDispense",
        fhir_resource_id: "meddisp-albuterol-002",
        date: "2025-12-10",
      },
      {
        description: "Insurance coverage gap: Jan–Feb 2026 (2 months without active Medicaid)",
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
        description: "BMI decline from 24.1 → 21.3 over 6 months (12% decrease)",
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
        description: "2 missed well-child visits — possible transportation or access barrier",
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
    services: ["Emergency shelter", "Transitional housing", "Case management"],
    eligibility_met: true,
    match_reason: "Addresses housing instability risk (HIGH severity)",
  },
  {
    name: "NeedyMeds Prescription Assistance",
    address: "Online Program",
    distance_miles: null,
    phone: "(800) 503-6897",
    status: "enrollment_open",
    services: ["Free/reduced medications", "Copay assistance", "Patient assistance programs"],
    eligibility_met: true,
    match_reason: "Addresses medication access barriers (HIGH severity)",
  },
  {
    name: "Harvest Hope Food Pantry",
    address: "567 Elm Ave, Springfield, MO 65802",
    distance_miles: 0.8,
    phone: "(555) 987-6543",
    status: "open",
    services: ["Weekly food boxes", "Fresh produce", "Children's nutrition packs"],
    eligibility_met: true,
    match_reason: "Addresses food insecurity risk (MODERATE severity) — near children's school",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          <div className="lg:w-[55%]">
            <p className="font-sans text-sm font-medium text-teal tracking-wide uppercase mb-4">
              SDOH Scout · Healthcare AI Agent
            </p>
            <h1 className="font-serif text-5xl text-slate leading-tight mb-6">
              See what the EHR misses.
            </h1>
            <p className="font-sans text-xl text-slate/70 leading-relaxed mb-8 max-w-xl">
              SDOH Scout detects social risk factors hiding in patient records and
              connects patients to community resources automatically.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#demo"
                className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-teal/90 transition-colors"
              >
                See it in action ↓
              </a>
              <a
                href="https://github.com"
                className="font-sans text-sm font-medium text-teal border border-teal px-6 py-3 rounded-[6px] hover:bg-teal-light transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Mini risk card preview */}
          <div className="lg:w-[45%] w-full">
            <div className="bg-white border border-border rounded-[4px] p-5 shadow-sm">
              <p className="font-mono text-xs text-slate/50 mb-3">
                scan_sdoh_risks → Patient/maria-santos-12345
              </p>
              <div className="space-y-2">
                {[
                  { label: "Housing Instability", level: "HIGH", color: "bg-terracotta" },
                  { label: "Medication Access", level: "HIGH", color: "bg-terracotta" },
                  { label: "Food Insecurity", level: "MODERATE", color: "bg-amber" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between bg-surface px-3 py-2 rounded-[4px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${r.color}`} />
                      <span className="font-sans text-sm text-slate">{r.label}</span>
                    </div>
                    <span className="font-mono text-xs text-slate/60">{r.level}</span>
                  </div>
                ))}
              </div>
              <p className="font-mono text-xs text-sage mt-3">
                ✓ 3 risks detected · 3 community resources matched
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="bg-teal text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-serif text-[120px] leading-none mb-4">80%</p>
          <p className="font-sans text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
            of health outcomes are driven by factors outside the clinic. But the
            average physician has seven minutes per visit — no time to screen for
            social risk. The clues are already in the EHR. Nobody&apos;s connecting
            the dots.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-serif text-3xl text-slate mb-12">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
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
              desc: "Detected risks are matched to local community resources based on category, eligibility, geographic proximity, and availability.",
              detail: "match_community_resources",
            },
            {
              step: "03",
              title: "Refer",
              desc: "FHIR ServiceRequest referrals are generated automatically — ready for a care coordinator to review and activate with one click.",
              detail: "ServiceRequest → draft",
            },
          ].map((item, i) => (
            <div
              key={item.step}
              className={`p-6 ${i < 2 ? "md:border-r border-border" : ""}`}
            >
              <p className="font-mono text-xs text-teal mb-2">{item.step}</p>
              <h3 className="font-serif text-2xl text-slate mb-3">{item.title}</h3>
              <p className="font-sans text-sm text-slate/70 leading-relaxed mb-4">
                {item.desc}
              </p>
              <p className="font-mono text-xs text-teal bg-teal-light/50 inline-block px-2 py-1 rounded">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Demo: Risk Detection ── */}
      <section id="demo" className="bg-surface py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <p className="font-mono text-xs text-teal mb-2">
              Patient: Maria Santos · ID: maria-santos-12345
            </p>
            <h2 className="font-serif text-3xl text-slate mb-2">
              Risk Detection Dashboard
            </h2>
            <p className="font-sans text-sm text-slate/60">
              Three social risk factors — from data already in the EHR. The clues
              were there all along.
            </p>
          </div>
          <div className="space-y-4">
            {DEMO_RISKS.map((risk) => (
              <RiskCard key={risk.category} {...risk} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo: Community Resources ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-8">
          <p className="font-mono text-xs text-sage mb-2">
            A2A Agent → Community Resource Matching
          </p>
          <h2 className="font-serif text-3xl text-slate mb-2">
            Community Resource Referrals
          </h2>
          <p className="font-sans text-sm text-slate/60">
            Each risk matched to a local program. Eligibility verified. FHIR
            referrals generated automatically.
          </p>
        </div>
        <div className="space-y-4">
          {DEMO_REFERRALS.map((ref) => (
            <ReferralCard key={ref.name} {...ref} />
          ))}
        </div>
      </section>

      {/* ── Technical Details ── */}
      <section className="bg-surface py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-slate mb-12">Technical Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-xl text-slate mb-4">MCP Server Tools</h3>
              <div className="space-y-3">
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
                  <div key={tool.name} className="bg-white border border-border rounded-[4px] p-4">
                    <p className="font-mono text-sm text-teal mb-1">{tool.name}</p>
                    <p className="font-sans text-sm text-slate/70">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate mb-4">
                SHARP Context Propagation
              </h3>
              <div className="bg-white border border-border rounded-[4px] p-4 mb-4">
                <p className="font-sans text-sm text-slate/70 mb-3">
                  SDOH Scout uses SHARP headers for secure patient context:
                </p>
                <div className="space-y-1">
                  {[
                    "X-Patient-ID: maria-santos-12345",
                    "X-FHIR-Server-URL: https://fhir.example.com/r4",
                    "X-FHIR-Access-Token: [bearer-token]",
                  ].map((header) => (
                    <p key={header} className="font-mono text-xs text-teal bg-teal-light/50 px-2 py-1 rounded">
                      {header}
                    </p>
                  ))}
                </div>
              </div>
              <h3 className="font-serif text-xl text-slate mb-4">
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
                    className="font-mono text-xs text-slate bg-white border border-border px-3 py-1.5 rounded-[4px]"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-border">
        <div>
          <p className="font-serif text-lg text-slate">SDOH Scout</p>
          <p className="font-sans text-sm text-slate/60">
            Built for Agents Assemble — The Healthcare AI Endgame
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com" className="font-sans text-sm text-teal hover:underline">
            GitHub
          </a>
          <a href="https://app.promptopinion.ai" className="font-sans text-sm text-teal hover:underline">
            Prompt Opinion
          </a>
          <a
            href="https://agents-assemble.devpost.com"
            className="font-sans text-sm text-teal hover:underline"
          >
            Devpost
          </a>
        </div>
      </footer>
    </main>
  );
}
