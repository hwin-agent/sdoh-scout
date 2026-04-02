"use client";

import { useState } from "react";

interface ReferralCardProps {
  name: string;
  address: string;
  distance_miles: number | null;
  phone: string;
  status: string;
  services: string[];
  eligibility_met: boolean;
  match_reason: string;
}

const STATUS_LABELS: Record<string, string> = {
  accepting_applications: "Accepting applications",
  enrollment_open: "Enrollment open",
  open: "Open",
  accepting_riders: "Accepting riders",
  accepting_clients: "Accepting clients",
};

export default function ReferralCard({
  name,
  address,
  distance_miles,
  phone,
  status,
  services,
  eligibility_met,
  match_reason,
}: ReferralCardProps) {
  const [state, setState] = useState<"idle" | "generating" | "generated" | "sent">("idle");

  const handleGenerate = () => {
    setState("generating");
    // Simulate brief generation delay
    setTimeout(() => setState("generated"), 800);
  };

  const handleSend = () => {
    setState("sent");
  };

  return (
    <div className="bg-white border border-border rounded-[4px] overflow-hidden hover:border-teal/20 transition-colors">
      {/* Header */}
      <div className="p-6 pb-0">
        <h3 className="font-serif text-lg text-slate">{name}</h3>
        <div className="flex items-center gap-3 mt-1.5 mb-4">
          {distance_miles != null && (
            <span className="font-sans text-sm text-slate/60">
              {distance_miles} miles
            </span>
          )}
          {distance_miles != null && (
            <span className="text-border text-xs">·</span>
          )}
          <span className="font-sans text-sm text-sage font-medium">
            ✓ {STATUS_LABELS[status] ?? status}
          </span>
        </div>
      </div>

      <div className="border-t border-border mx-6" />

      {/* Body */}
      <div className="p-6 pt-4">
        <p className="font-sans text-sm text-slate/70 mb-3">
          <span className="font-medium text-slate/80">Services:</span>{" "}
          {services.join(", ")}
        </p>

        {eligibility_met && (
          <div className="flex items-center gap-4 mb-3">
            <span className="font-sans text-sm text-sage">
              ✓ Eligibility confirmed
            </span>
          </div>
        )}

        <p className="font-sans text-xs text-slate/50 mb-5">{match_reason}</p>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {state === "idle" && (
            <button
              onClick={handleGenerate}
              className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-[#0a5c5c] transition-colors"
            >
              Generate Referral
            </button>
          )}

          {state === "generating" && (
            <div className="flex items-center gap-2.5 px-6 py-3">
              <div className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full animate-spin" />
              <span className="font-sans text-sm text-teal font-medium">
                Generating FHIR ServiceRequest...
              </span>
            </div>
          )}

          {state === "generated" && (
            <>
              <span className="font-sans text-sm text-sage font-medium">
                ✓ Referral generated
              </span>
              <button
                onClick={handleSend}
                className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-[#0a5c5c] transition-colors"
              >
                Send to Care Coordinator
              </button>
            </>
          )}

          {state === "sent" && (
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm text-sage font-medium">
                ✓ Referral sent to Care Coordination team
              </span>
              <span className="font-mono text-[10px] text-slate/40 bg-surface px-2 py-0.5 rounded">
                ServiceRequest/status: active
              </span>
            </div>
          )}

          {(state === "idle" || state === "generated") && (
            <a
              href={`tel:${phone}`}
              className="font-sans text-sm font-medium text-teal border border-teal px-6 py-3 rounded-[6px] hover:bg-teal-light transition-colors"
            >
              {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
