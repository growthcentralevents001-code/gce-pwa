"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const genres = [
  "Adventure", "Arcades", "Bike Riding", "Bowling", "Clubbing", "Comedy",
  "Concerts", "Cricket Matches", "DJ Nights", "EDM & Electronic", "Food & Drinks",
  "Game Zones", "Heritage Walks", "Historical Tours", "Laser Tag", "Music",
  "Music Festivals", "Nightlife", "Open Mics", "Open Mics & Jams", "Pop",
  "Sports", "Theme Parks", "Tours", "Trampoline Parks", "Travel", "Walks"
];

const sortOptions = [
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "date", label: "Date" },
  { value: "distance", label: "Distance: Near to Far" },
];

export default function FilterModal({ isOpen, onClose, onApply, currentFilters }) {
  const [selectedGenres, setSelectedGenres] = useState(currentFilters?.genres || []);
  const [sortBy, setSortBy] = useState(currentFilters?.sortBy || "popularity");

  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(currentFilters?.genres || []);
      setSortBy(currentFilters?.sortBy || "popularity");
    }
  }, [isOpen, currentFilters]);

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApply({ genres: selectedGenres, sortBy });
    onClose();
  };

  const handleClear = () => {
    setSelectedGenres([]);
    setSortBy("popularity");
    onApply({ genres: [], sortBy: "popularity" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filter by</h2>
          <button onClick={onClose} className="p-1"><X size={24} /></button>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Sort By</h3>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="sort" value={option.value} checked={sortBy === option.value} onChange={(e) => setSortBy(e.target.value)} className="cursor-pointer" />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Genres</h3>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border p-2 rounded">
            {genres.map(genre => (
              <label key={genre} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => handleGenreToggle(genre)} className="cursor-pointer" />
                <span className="text-sm">{genre}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={handleClear} className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition">Clear filters</button>
          <button onClick={handleApply} className="flex-1 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition">Apply Filters</button>
        </div>
      </div>
    </div>
  );
}
