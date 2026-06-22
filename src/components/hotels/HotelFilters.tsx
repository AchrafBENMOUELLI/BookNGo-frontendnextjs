"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface HotelFiltersProps {
  search: string;
  categorie: string;
  onSearchChange: (val: string) => void;
  onCategorieChange: (val: string) => void;
  onReset: () => void;
}

export function HotelFilters({
  search,
  categorie,
  onSearchChange,
  onCategorieChange,
  onReset,
}: HotelFiltersProps) {
  const hasFilters = search || categorie;

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un hôtel..."
          className="pl-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Categorie */}
      <Select value={categorie} onValueChange={onCategorieChange}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="Étoiles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes</SelectItem>
          {[5, 4, 3, 2, 1].map((s) => (
            <SelectItem key={s} value={String(s)}>
              {"⭐".repeat(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="gap-1 shrink-0"
        >
          <X className="w-4 h-4" />
          Reset
        </Button>
      )}
    </div>
  );
}
