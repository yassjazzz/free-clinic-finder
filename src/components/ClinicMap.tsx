import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clinic } from "@/data/clinics";

const statusColors = { open: "#2f9e6e", closed: "#e53e3e", limited: "#ed8936" };
const statusLabels = { open: "Open Now", closed: "Closed", limited: "Limited" };

const createIcon = (status: Clinic["status"]) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${statusColors[status]};transform:rotate(-45deg);
      border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.3);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:10px;height:10px;background:white;border-radius:50%;transform:rotate(45deg);"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
}

const ClinicMap = ({ clinics, selectedClinic, onSelectClinic }: ClinicMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current).setView([34.0522, -118.2437], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;
    markersRef.current.clearLayers();

    clinics.forEach((clinic) => {
      const marker = L.marker([clinic.lat, clinic.lng], { icon: createIcon(clinic.status) });
      marker.bindPopup(`
        <div style="font-family:inherit;min-width:220px;">
          <strong>${clinic.name}</strong>
          <div style="color:#666;font-size:13px;margin-top:4px;">${clinic.address}, ${clinic.city}</div>
          <div style="margin-top:6px;">
            <span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;color:white;background:${statusColors[clinic.status]}">
              ${statusLabels[clinic.status]}
            </span>
          </div>
          <div style="color:#666;font-size:12px;margin-top:6px;">${clinic.services.join(" · ")}</div>
        </div>
      `);
      marker.on("click", () => onSelectClinic(clinic));
      marker.addTo(markersRef.current!);
    });
  }, [clinics, onSelectClinic]);

  // Fly to selected
  useEffect(() => {
    if (selectedClinic && mapRef.current) {
      mapRef.current.flyTo([selectedClinic.lat, selectedClinic.lng], 14, { duration: 1 });
    }
  }, [selectedClinic]);

  return <div ref={containerRef} className="h-full w-full rounded-lg" />;
};

export default ClinicMap;
