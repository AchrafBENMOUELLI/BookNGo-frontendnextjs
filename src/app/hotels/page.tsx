"use client";

import { useState, useCallback } from "react";
import { useHotels } from "@/hooks/useHotels";
import { HotelCard } from "@/components/hotels/HotelCard";
import { HotelCardSkeleton } from "@/components/hotels/HotelCardSkeleton";
import { HotelFilters } from "@/components/hotels/HotelFilters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function HotelsPage() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching } = useHotels({
    search: debouncedSearch,
    categorie: categorie === "all" ? "" : categorie,
    page,
  });

  const handleReset = useCallback(() => {
    setSearch("");
    setCategorie("");
    setPage(1);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Hôtels en Tunisie</h1>
        <p className="text-muted-foreground">
          {data?.total ?? "..."} hôtels disponibles
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <HotelFilters
          search={search}
          categorie={categorie}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          onCategorieChange={(v) => { setCategorie(v); setPage(1); }}
          onReset={handleReset}
        />
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <HotelCardSkeleton key={i} />
            ))
          : data?.data.length === 0
          ? (
            <div className="col-span-3 text-center py-20 text-muted-foreground">
              Aucun hôtel trouvé. Essayez d'autres filtres.
            </div>
          )
          : data?.data.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
      </div>

      {/* Pagination */}
      {data && data.last_page > 1 && (
        <div className="flex items-center justify-center gap-3 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === page ? "default" : "ghost"}
                onClick={() => setPage(p)}
                className="w-9"
              >
                {p}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.last_page}
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
