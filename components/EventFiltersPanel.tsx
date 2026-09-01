"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { EVENT_CATEGORIES, SORT_OPTIONS } from "@/lib/eventCategories";

interface EventFiltersPanelProps {
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

export default function EventFiltersPanel({
  selectedCategories,
  onToggleCategory,
  priceRange,
  onPriceRangeChange,
  sortOption,
  onSortChange,
  onClear,
}: EventFiltersPanelProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);

  return (
    <div className="bg-card rounded-lg shadow border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Filter size={18} className="text-orange-500" /> Filters
        </h3>
        <button onClick={onClear} className="text-xs text-orange-600 hover:text-orange-700">
          Clear all
        </button>
      </div>

      <div className="mb-5">
        <button
          type="button"
          onClick={() => setCategoryOpen((open) => !open)}
          className="flex w-full items-center justify-between text-xs font-semibold text-muted-foreground mb-2"
        >
          <span>
            Category
            {selectedCategories.length > 0 && (
              <span className="ml-1 font-normal text-orange-600">({selectedCategories.length})</span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={`text-muted-foreground transition-transform ${categoryOpen ? "rotate-180" : ""}`}
          />
        </button>
        {categoryOpen && (
          <div className="max-h-52 overflow-y-auto rounded-lg border border-border p-2 space-y-1">
            {EVENT_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer py-0.5"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => onToggleCategory(cat)}
                  className="rounded border-border text-orange-600 focus:ring-orange-500"
                />
                <span className="leading-tight">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-5">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Price Range</h4>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
            className="w-full px-2 py-1 text-xs border border-input rounded bg-background text-foreground"
            placeholder="Min"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
            className="w-full px-2 py-1 text-xs border border-input rounded bg-background text-foreground"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground mb-2">Sort By</h4>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-2 py-1.5 text-xs border border-input rounded bg-background text-foreground"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
