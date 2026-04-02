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
  const [referralSent, setReferralSent] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-[4px] p-6">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-serif text-lg text-slate">{name}</h3>
        <div className="flex items-center gap-3 mt-1">
          {distance_miles != null && (
            <span className="font-sans text-sm text-slate/70">{distance_miles} miles</span>
          )}
          {distance_miles != null && <span className="text-border">·</span>}
          <span className="font-sans text-sm text-sage font-medium">
            ✓ {STATUS_LABELS[status] ?? status}
          </span>
        </div>
      </div>

      <hr className="border-border mb-3" />

      {/* Services */}
      <p className="font-sans text-sm text-slate/80 mb-2">
        <span className="font-medium">Services:</span> {services.join(", ")}
      </p>

      {/* Eligibility */}
      {eligibility_met && (
        <p className="font-sans text-sm text-sage mb-2">
          ✓ Eligibility confirmed
        </p>
      )}

      {/* Match reason */}
      <p className="font-sans text-xs text-slate/60 mb-4">{match_reason}</p>

      {/* Contact + Actions */}
      <div className="flex items-center gap-3">
        {!referralSent ? (
          <button
            onClick={() => setReferralSent(true)}
            className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-teal/90 transition-colors"
          >
            Generate Referral
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-sage">
              ✓ Referral generated
            </span>
            <button
              className="font-sans text-sm font-medium bg-teal text-white px-6 py-3 rounded-[6px] hover:bg-teal/90 transition-colors"
              onClick={() => {}}
            >
              Send to Care Coordinator
            </button>
          </div>
        )}
        <a
          href={`tel:${phone}`}
          className="font-sans text-sm font-medium text-teal border border-teal px-6 py-3 rounded-[6px] hover:bg-teal-light transition-colors"
        >
          {phone}
        </a>
      </div>
    </div>
  );
}
