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
  HIGH: {
    color: "text-terracotta",
    dot: "bg-terracotta",
    border: "risk-high",
    label: "HIGH RISK",
  },
  MODERATE: {
    color: "text-amber",
    dot: "bg-amber",
    border: "risk-moderate",
    label: "MODERATE RISK",
  },
  LOW: {
    color: "text-sage",
    dot: "bg-sage",
    border: "risk-low",
    label: "LOW RISK",
  },
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
      className={`bg-surface ${config.border} rounded-[4px] p-6 transition-[border-color] duration-300 hover:border-l-[6px] ${animate ? "card-animate" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${config.dot} risk-pulse`} />
          <h3 className="font-serif text-xl text-slate">
            {CATEGORY_LABELS[category] ?? category}
          </h3>
        </div>
        <span
          className={`font-mono text-[11px] font-medium tracking-wider ${config.color}`}
        >
          {config.label}
        </span>
      </div>

      {/* Signals */}
      <div className="space-y-3.5 mb-5">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-border mt-[3px] text-xs select-none">▸</span>
            <div>
              <p className="font-sans text-sm text-slate leading-relaxed">
                {signal.description}
              </p>
              <p className="font-mono text-[11px] text-slate/50 mt-1">
                {signal.fhir_resource_type}/{signal.fhir_resource_id} ·{" "}
                {signal.date}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <p className="font-sans text-sm text-slate/70 italic leading-relaxed mb-4">
        {summary}
      </p>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="group font-sans text-sm font-medium text-teal hover:text-[#0a5c5c] transition-colors inline-flex items-center gap-1.5"
      >
        <span>{expanded ? "Hide details" : "View FHIR Evidence"}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-90" : "group-hover:translate-x-0.5"}`}
        >
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Expanded details */}
      <div
        className="overflow-hidden transition-all duration-400 ease-out"
        style={{
          maxHeight: expanded ? "400px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="mt-5 pt-5 border-t border-border">
          <p className="font-sans text-sm font-medium text-slate mb-2">
            Recommended Action
          </p>
          <p className="font-sans text-sm text-slate/70 leading-relaxed">
            {recommended_action}
          </p>
          <div className="mt-4">
            <p className="font-mono text-[10px] font-medium text-slate/50 uppercase tracking-wider mb-2">
              FHIR Evidence Chain
            </p>
            <div className="space-y-1.5">
              {signals.map((s, i) => (
                <div
                  key={i}
                  className="font-mono text-[11px] text-teal bg-teal-light/50 rounded-[3px] px-3 py-1.5 inline-block mr-2 mb-1"
                >
                  {s.fhir_resource_type}/{s.fhir_resource_id}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
