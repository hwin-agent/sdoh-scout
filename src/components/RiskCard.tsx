"use client";

import { useState } from "react";

interface RiskSignal {
  description: string;
  fhir_resource_type: string;
  fhir_resource_id: string;
  date: string;
}

interface RiskCardProps {
  category: string;
  severity: "HIGH" | "MODERATE" | "LOW";
  signals: RiskSignal[];
  summary: string;
  recommended_action: string;
  animate?: boolean;
}

const SEVERITY_CONFIG = {
  HIGH: { color: "text-terracotta", dot: "bg-terracotta", border: "risk-high", label: "HIGH RISK" },
  MODERATE: { color: "text-amber", dot: "bg-amber", border: "risk-moderate", label: "MODERATE RISK" },
  LOW: { color: "text-sage", dot: "bg-sage", border: "risk-low", label: "LOW RISK" },
};

const CATEGORY_LABELS: Record<string, string> = {
  housing_instability: "Housing Instability",
  food_insecurity: "Food Insecurity",
  medication_access: "Medication Access Barriers",
  transportation: "Transportation Barriers",
  financial_strain: "Financial Strain",
};

export default function RiskCard({
  category,
  severity,
  signals,
  summary,
  recommended_action,
  animate = true,
}: RiskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[severity];

  return (
    <div
      className={`bg-surface ${config.border} rounded-[4px] p-6 ${animate ? "card-animate" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${config.dot} risk-pulse`} />
          <h3 className="font-serif text-xl text-slate">
            {CATEGORY_LABELS[category] ?? category}
          </h3>
        </div>
        <span className={`font-sans font-bold text-sm tracking-wide ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Signals */}
      <div className="space-y-3 mb-4">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-border mt-1 text-xs">▸</span>
            <div>
              <p className="font-sans text-sm text-slate leading-relaxed">
                {signal.description}
              </p>
              <p className="font-mono text-xs text-slate/60 mt-0.5">
                {signal.fhir_resource_type}/{signal.fhir_resource_id} · {signal.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <p className="font-sans text-sm text-slate/80 italic mb-3">{summary}</p>

      {/* Expand to show FHIR evidence + recommendation */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="font-sans text-sm font-medium text-teal hover:underline"
      >
        {expanded ? "Hide details ↑" : "View FHIR Evidence →"}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="font-sans text-sm font-medium text-slate mb-2">Recommended Action</p>
          <p className="font-sans text-sm text-slate/80">{recommended_action}</p>
          <div className="mt-3">
            <p className="font-sans text-xs font-medium text-slate/60 mb-1">FHIR Evidence Chain</p>
            {signals.map((s, i) => (
              <div key={i} className="font-mono text-xs text-teal bg-teal-light/50 rounded px-2 py-1 mb-1">
                {s.fhir_resource_type}/{s.fhir_resource_id}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
