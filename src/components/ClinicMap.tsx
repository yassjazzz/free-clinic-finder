import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Clinic } from "@/data/clinics";
import ClinicCard from "./ClinicCard";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createClinicIcon = (status: Clinic["status"]) => {
  const colors = { open: "#2f9e6e", closed: "#e53e3e", limited: "#ed8936" };
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
      background: ${colors[status]}; transform: rotate(-45deg);
      border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "><div style="
      width: 10px; height: 10px; background: white; border-radius: 50%;
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    "></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface FlyToProps {
  clinic: Clinic | null;
}

const FlyToClinic = ({ clinic }: FlyToProps) => {
  const map = useMap();
  useEffect(() => {
    if (clinic) {
      map.flyTo([clinic.lat, clinic.lng], 14, { duration: 1 });
    }
  }, [clinic, map]);
  return null;
};

interface ClinicMapProps {
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  onSelectClinic: (clinic: Clinic) => void;
}

const ClinicMap = ({ clinics, selectedClinic, onSelectClinic }: ClinicMapProps) => {
  const center: [number, number] = [34.0522, -118.2437];

  return (
    <MapContainer
      center={center}
      zoom={10}
      className="h-full w-full rounded-lg"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToClinic clinic={selectedClinic} />
      {clinics.map((clinic) => (
        <Marker
          key={clinic.id}
          position={[clinic.lat, clinic.lng]}
          icon={createClinicIcon(clinic.status)}
          eventHandlers={{ click: () => onSelectClinic(clinic) }}
        >
          <Popup className="clinic-popup" maxWidth={320} minWidth={280}>
            <ClinicCard clinic={clinic} compact />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ClinicMap;
