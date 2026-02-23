import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List, Info, Heart } from "lucide-react";
import ClinicMap from "@/components/ClinicMap";
import ClinicCard from "@/components/ClinicCard";
import SearchFilter from "@/components/SearchFilter";
import { clinics, Clinic } from "@/data/clinics";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("All Services");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [activeTab, setActiveTab] = useState("map");

  const filtered = useMemo(() => {
    return clinics.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase());
      const matchService =
        selectedService === "All Services" || c.services.includes(selectedService);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchService && matchStatus;
    });
  }, [search, selectedService, statusFilter]);

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setActiveTab("map");
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FreeClinics</h1>
            <p className="text-sm text-muted-foreground">
              Find free healthcare near you
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span> clinics found
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container flex-1 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="map" className="gap-1.5">
              <MapPin className="h-4 w-4" /> Map
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1.5">
              <List className="h-4 w-4" /> List
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-1.5">
              <Info className="h-4 w-4" /> About
            </TabsTrigger>
          </TabsList>

          {/* Filters (shared for map & list) */}
          {activeTab !== "about" && (
            <SearchFilter
              search={search}
              onSearchChange={setSearch}
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />
          )}

          <TabsContent value="map" className="mt-0">
            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
              <div className="h-[60vh] min-h-[400px] overflow-hidden rounded-lg border border-border shadow-sm">
                <ClinicMap
                  clinics={filtered}
                  selectedClinic={selectedClinic}
                  onSelectClinic={setSelectedClinic}
                />
              </div>
              <div className="space-y-3 overflow-y-auto lg:max-h-[60vh]">
                <h2 className="text-sm font-medium text-muted-foreground">Nearby Clinics</h2>
                {filtered.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    compact
                    onSelect={handleSelectClinic}
                  />
                ))}
                {filtered.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No clinics match your filters.
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} onSelect={handleSelectClinic} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-full py-12 text-center text-muted-foreground">
                  No clinics match your filters.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="mx-auto max-w-2xl space-y-6 py-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-card-foreground">
                  About FreeClinics
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  FreeClinics is a community resource that helps you find free and low-cost
                  healthcare clinics in your area. We believe everyone deserves access to quality
                  healthcare regardless of their insurance status or ability to pay.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-card-foreground">How to Use</h3>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Use the <strong>Map</strong> tab to explore clinics visually and click markers for details.
                  </li>
                  <li className="flex gap-2">
                    <List className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Use the <strong>List</strong> tab to browse all clinics with full details.
                  </li>
                  <li className="flex gap-2">
                    <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Filter by services, status, or search by name and location.
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold text-card-foreground">Status Guide</h3>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-clinic-open" />
                    <strong>Open</strong> — Currently accepting patients
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-clinic-limited" />
                    <strong>Limited</strong> — Reduced capacity or hours
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-clinic-closed" />
                    <strong>Closed</strong> — Temporarily or permanently closed
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
