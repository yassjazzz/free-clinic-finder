import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { serviceCategories } from "@/data/clinics";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedService: string;
  onServiceChange: (service: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const SearchFilter = ({
  search,
  onSearchChange,
  selectedService,
  onServiceChange,
  statusFilter,
  onStatusChange,
}: SearchFilterProps) => {
  const statuses = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "limited", label: "Limited" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clinics by name or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">Status:</span>
        {statuses.map((s) => (
          <Badge
            key={s.value}
            variant={statusFilter === s.value ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => onStatusChange(s.value)}
          >
            {s.label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {serviceCategories.map((service) => (
          <Badge
            key={service}
            variant={selectedService === service ? "default" : "outline"}
            className="cursor-pointer text-xs"
            onClick={() => onServiceChange(service)}
          >
            {service}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
