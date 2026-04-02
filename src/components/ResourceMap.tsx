"use client";

import { useEffect, useRef, useState } from "react";

interface Resource {
  name: string;
  lat: number;
  lng: number;
  category: "housing" | "medication" | "food";
  distance_miles: number | null;
  status: string;
}

const PATIENT_LOCATION = { lat: 37.2090, lng: -93.2923 }; // Springfield, MO

const RESOURCES: Resource[] = [
  {
    name: "Covenant House Housing Assistance",
    lat: 37.2150,
    lng: -93.2780,
    category: "housing",
    distance_miles: 2.3,
    status: "Accepting applications",
  },
  {
    name: "Harvest Hope Food Pantry",
    lat: 37.2120,
    lng: -93.2850,
    category: "food",
    distance_miles: 0.8,
    status: "Open Tues/Thurs/Sat",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  housing: "#C75B39",
  medication: "#0D6E6E",
  food: "#D4A017",
};

export default function ResourceMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");
      leafletRef.current = L;

      // Fix default icon paths for webpack/next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [PATIENT_LOCATION.lat, PATIENT_LOCATION.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      mapInstanceRef.current = map;

      // CartoDB Positron - muted, desaturated basemap
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Patient location - pulsing teal dot
      const patientIcon = L.divIcon({
        className: "patient-marker",
        html: `<div style="
          width: 16px; height: 16px;
          background: #0D6E6E;
          border: 3px solid #FAFAF7;
          border-radius: 50%;
          box-shadow: 0 0 0 2px #0D6E6E;
          animation: marker-pulse 2s ease-in-out infinite;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([PATIENT_LOCATION.lat, PATIENT_LOCATION.lng], {
        icon: patientIcon,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: 'DM Sans', sans-serif; padding: 4px;">
            <strong style="color: #3D4F5F;">Maria Santos</strong><br/>
            <span style="font-family: 'DM Mono', monospace; font-size: 11px; color: #3D4F5F; opacity: 0.7;">Patient/maria-santos-12345</span>
          </div>`
        );

      // Resource markers with connecting lines
      RESOURCES.forEach((resource, index) => {
        const color = CATEGORY_COLORS[resource.category] || "#0D6E6E";

        const resourceIcon = L.divIcon({
          className: "resource-marker",
          html: `<div style="
            width: 12px; height: 12px;
            background: ${color};
            border: 2px solid #FAFAF7;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${color};
            animation: marker-fade-in 0.5s ease-out ${0.3 + index * 0.2}s both;
          "></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([resource.lat, resource.lng], {
          icon: resourceIcon,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'DM Sans', sans-serif; padding: 4px; min-width: 160px;">
              <strong style="color: #3D4F5F; font-size: 13px;">${resource.name}</strong><br/>
              <span style="font-size: 12px; color: #4A7C59;">${resource.status}</span>
              ${resource.distance_miles ? `<br/><span style="font-size: 11px; color: #3D4F5F; opacity: 0.6;">${resource.distance_miles} miles</span>` : ""}
            </div>`
          );

        // Dashed connection line
        L.polyline(
          [
            [PATIENT_LOCATION.lat, PATIENT_LOCATION.lng],
            [resource.lat, resource.lng],
          ],
          {
            color: "#0D6E6E",
            weight: 1.5,
            opacity: 0.35,
            dashArray: "6, 8",
          }
        ).addTo(map);
      });

      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css"
      />
      <style>{`
        @keyframes marker-pulse {
          0%, 100% { box-shadow: 0 0 0 2px #0D6E6E, 0 0 0 4px rgba(13, 110, 110, 0.3); }
          50% { box-shadow: 0 0 0 2px #0D6E6E, 0 0 0 8px rgba(13, 110, 110, 0); }
        }
        @keyframes marker-fade-in {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 4px !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12) !important;
          border: 1px solid #D4CFC7 !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
          border: 1px solid #D4CFC7 !important;
          border-top: none !important;
          border-left: none !important;
        }
      `}</style>

      <div
        ref={mapRef}
        className="w-full h-[320px] rounded-[4px] border border-border"
        style={{ background: "#E0F2F1" }}
      />

      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-teal-light rounded-[4px]">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-teal animate-pulse" />
            <span className="font-sans text-sm text-slate/70">Loading map...</span>
          </div>
        </div>
      )}

      {/* Map legend */}
      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal border-2 border-white shadow-[0_0_0_1px_#0D6E6E]" />
          <span className="font-sans text-xs text-slate/60">Patient</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
          <span className="font-sans text-xs text-slate/60">Housing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber" />
          <span className="font-sans text-xs text-slate/60">Food</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal" />
          <span className="font-sans text-xs text-slate/60">Medication</span>
        </div>
      </div>
    </div>
  );
}
