"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Visual transition that shows the A2A handoff from
 * SDOH Risk Detection → Community Resource Agent.
 * Triggers on scroll into view.
 */
export default function A2ATransition() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "connecting" | "connected">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("connecting");
          const timer = setTimeout(() => setPhase("connected"), 1200);
          observer.unobserve(el);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4">
          {/* Left node: Risk Detection */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                phase === "idle" ? "bg-border" : "bg-teal"
              }`}
            />
            <span className="font-mono text-xs text-slate/60">
              SDOH Risk Detection
            </span>
          </div>

          {/* Connection line */}
          <div className="flex-1 relative h-[2px]">
            <div className="absolute inset-0 bg-border" />
            <div
              className="absolute inset-y-0 left-0 bg-teal transition-all duration-1000 ease-out"
              style={{
                width: phase === "idle" ? "0%" : phase === "connecting" ? "60%" : "100%",
              }}
            />
            {phase === "connecting" && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal"
                style={{
                  left: "60%",
                  animation: "a2a-dot-pulse 0.8s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {/* Right node: Community Resources */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-3 h-3 rounded-full transition-colors duration-500 delay-700 ${
                phase === "connected" ? "bg-sage" : "bg-border"
              }`}
            />
            <span className="font-mono text-xs text-slate/60">
              Community Resource Agent
            </span>
          </div>
        </div>

        {/* Status text */}
        <p
          className={`font-mono text-xs text-center mt-3 transition-opacity duration-500 ${
            phase === "idle" ? "opacity-0" : "opacity-100"
          }`}
        >
          {phase === "connecting" && (
            <span className="text-teal">A2A handoff in progress...</span>
          )}
          {phase === "connected" && (
            <span className="text-sage">
              ✓ Agent connected — matching risks to community resources
            </span>
          )}
        </p>
      </div>

      <style>{`
        @keyframes a2a-dot-pulse {
          0%, 100% { opacity: 1; transform: translateY(-50%) scale(1); }
          50% { opacity: 0.5; transform: translateY(-50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
