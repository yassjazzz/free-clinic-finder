import { Clinic } from "@/data/clinics";
import { MapPin, Phone, Clock, ExternalLink, Footprints } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClinicCardProps {
  clinic: Clinic;
  compact?: boolean;
  onSelect?: (clinic: Clinic) => void;
}

const statusConfig = {
  open: { label: "Open Now", className: "bg-clinic-open text-primary-foreground" },
  closed: { label: "Closed", className: "bg-clinic-closed text-primary-foreground" },
  limited: { label: "Limited Hours", className: "bg-clinic-limited text-primary-foreground" },
};

const ClinicCard = ({ clinic, compact = false, onSelect }: ClinicCardProps) => {
  const status = statusConfig[clinic.status];

  return (
    <div
      onClick={() => onSelect?.(clinic)}
      className={`group rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:shadow-[var(--card-shadow-hover)] ${
        onSelect ? "cursor-pointer" : ""
      } ${compact ? "p-3" : "p-5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className={`font-semibold text-card-foreground ${compact ? "text-sm" : "text-base"}`}>
            {clinic.name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-sm">
              {clinic.address}, {clinic.city}, {clinic.state}
            </span>
          </div>
        </div>
        <Badge className={`shrink-0 text-xs ${status.className}`}>{status.label}</Badge>
      </div>

      {!compact && (
        <>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{clinic.description}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {clinic.services.map((service) => (
              <Badge key={service} variant="secondary" className="text-xs font-normal">
                {service}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              {clinic.phone}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {clinic.hours}
            </span>
            {clinic.walkIn && (
              <span className="flex items-center gap-1.5 text-secondary-foreground">
                <Footprints className="h-3.5 w-3.5" />
                Walk-ins Welcome
              </span>
            )}
          </div>

          {clinic.website && (
            <a
              href={clinic.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default ClinicCard;
