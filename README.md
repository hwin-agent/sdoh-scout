# SDOH Scout

**See what the EHR misses.** SDOH Scout detects social determinant risk factors hiding in patient records and connects patients to community resources automatically.

Built for the [Agents Assemble](https://agents-assemble.devpost.com/) hackathon — The Healthcare AI Endgame.

## The Problem

80% of health outcomes are driven by social factors — housing, food access, transportation — but the average physician has seven minutes per visit. The clues are already in the EHR. Nobody's connecting the dots.

## What It Does

SDOH Scout is a healthcare AI agent that:

1. **Detects** social risk signals from existing FHIR patient data (conditions, encounters, medications, vitals, coverage)
2. **Matches** detected risks to local community resources based on eligibility and proximity
3. **Generates** FHIR ServiceRequest referrals automatically — ready for care coordinator review

## Architecture

```
┌─────────────────────────┐
│  Prompt Opinion Platform │
│  (SHARP Context)         │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│  SDOH Scout MCP Server  │  ← Our code
│  Tools:                 │
│  - scan_sdoh_risks      │
│  - get_risk_details     │
│  - match_community_     │
│    resources            │
└──────────┬──────────────┘
           │
┌──────────▼──────────────┐
│  FHIR R4 Server         │
│  (Patient data)         │
└─────────────────────────┘
```

## Tech Stack

- **MCP Server**: TypeScript + `@modelcontextprotocol/sdk` (Streamable HTTP transport)
- **LLM**: GPT-4o for multi-signal risk synthesis
- **Data**: FHIR R4 resources (Condition, Encounter, MedicationRequest, MedicationDispense, Observation, Coverage)
- **Context**: SHARP headers (X-Patient-ID, X-FHIR-Server-URL, X-FHIR-Access-Token)
- **Landing Page**: Next.js + Tailwind CSS
- **Hosting**: Vercel

## MCP Tools

| Tool | Description |
|------|-------------|
| `scan_sdoh_risks` | Analyzes FHIR patient data for social determinant risk signals using LLM synthesis |
| `get_risk_details` | Returns expanded analysis for a specific risk category |
| `match_community_resources` | Matches risks to community programs and generates FHIR ServiceRequest referrals |

## FHIR Resources Analyzed

- **Condition** — Z-codes (Z55-Z65) for social determinant diagnoses
- **Encounter** — ED visit patterns, frequency analysis
- **MedicationRequest/Dispense** — Adherence gaps, refill patterns
- **Observation** — Vitals trends (BMI decline, etc.)
- **Coverage** — Insurance gaps, Medicaid status

## Setup

```bash
bun install
cp .env.example .env.local  # Add your OPENAI_API_KEY
bun dev
```

MCP endpoint: `http://localhost:3000/api/mcp`
Health check: `http://localhost:3000/api/health`

## Synthetic Demo Data

Uses a synthetic patient "Maria Santos" (Synthea-style) with:
- Housing instability (Z59.1)
- 4 ED visits in 90 days for respiratory complaints
- Missed medication refills with coverage gap
- BMI decline + dependent child with iron-deficiency anemia

All data is synthetic. No real PHI.

## License

MIT
