const CITY_ALIASES: Record<string, string> = {
  amritsar: "amritsar",
  asr: "amritsar",
  "1001": "amritsar",
  "new amritsar": "amritsar",
  ludhiana: "ludhiana",
  chandigarh: "chandigarh",
  mumbai: "mumbai",
  bombay: "mumbai",
  bom: "mumbai",
  delhi: "delhi",
  "new delhi": "delhi",
  bangalore: "bangalore",
  bengaluru: "bangalore",
  blr: "bangalore",
  pune: "pune",
  batala: "batala",
  bathinda: "bathinda",
  ambala: "ambala",
  pathankot: "pathankot",
  barnala: "barnala",
};

export function normalizeCityForMatch(city: string | null | undefined): string {
  if (!city) return "";
  const key = city.trim().toLowerCase();
  return CITY_ALIASES[key] || key;
}

export function citiesMatch(
  eventCity: string | null | undefined,
  filterCity: string | null | undefined
): boolean {
  if (!filterCity) return true;
  return normalizeCityForMatch(eventCity) === normalizeCityForMatch(filterCity);
}

export function matchToDatabaseCity(detected: string, dbCities: string[]): string | null {
  const normalized = normalizeCityForMatch(detected);

  const exact = dbCities.find((c) => normalizeCityForMatch(c) === normalized);
  if (exact) return exact;

  const partial = dbCities.find((c) => {
    const db = normalizeCityForMatch(c);
    return db.includes(normalized) || normalized.includes(db);
  });
  if (partial) return partial;

  return null;
}

const CITY_DISPLAY_NAMES: Record<string, string> = {
  amritsar: "Amritsar",
  asr: "Amritsar",
  ludhiana: "Ludhiana",
  chandigarh: "Chandigarh",
  mumbai: "Mumbai",
  delhi: "Delhi",
  bangalore: "Bangalore",
  pune: "Pune",
  batala: "Batala",
  bathinda: "Bathinda",
  ambala: "Ambala",
  pathankot: "Pathankot",
  barnala: "Barnala",
};

export function formatCityLabel(city: string): string {
  const key = city.trim().toLowerCase();
  return CITY_DISPLAY_NAMES[key] || city.charAt(0).toUpperCase() + city.slice(1);
}
