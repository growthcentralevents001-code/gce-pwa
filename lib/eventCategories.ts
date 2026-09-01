export const EVENT_CATEGORIES = [
  "Acoustic",
  "Adventure",
  "Bar Takeover",
  "Bike Riding",
  "Bollywood",
  "Brunch",
  "Business & Entrepreneurship",
  "Carnivals",
  "Celebrations",
  "Chess Matches",
  "Classical",
  "Clubbing",
  "Coffee Meetups",
  "Comedy",
  "Community Dining",
  "Community Meetups",
  "Concerts",
  "Conferences & Talks",
  "Cover & Tribute",
  "Cultural Fests",
  "DJ Nights",
  "Dance",
  "Dating & Singles",
  "Devotional",
  "Dramatic Play",
  "Drinks & Tastings",
  "EDM & Electronic",
  "Education",
  "F1 Screenings",
  "Father's Day",
  "Fests",
  "Fests & Fairs",
  "Fitness Events",
  "Fitness Fests",
  "Folk",
  "Food & Beverages Fests",
  "Food & Drinks",
  "Football Screenings",
  "Game Zones",
  "Ghazal & Qawwali",
  "Gourmet Experiences",
  "Grand Prix",
  "Half Marathon",
  "Healthcare",
  "Improv",
  "Indie",
  "Industry Networking",
  "Instrumental",
  "Interest-Based Communities",
  "Interest-Based Dating",
  "Jam Sessions",
  "Karaoke",
  "Kids",
  "Kids Fests & Carnivals",
  "Ladies Night",
  "Live Gigs",
  "Live Music",
  "Magic & Illusion",
  "Markets & Bazaars",
  "Movie Screenings",
  "Music",
  "Music Festivals",
  "Musical",
  "Nightlife",
  "Open Mics",
  "Open Mics & Jams",
  "Performances",
  "Pickleball Matches",
  "Poetry & Spoken Word",
  "Poetry Nights",
  "Pool Parties",
  "Pop",
  "Rage Rooms",
  "Rave & Underground",
  "Roasts",
  "Running",
  "Screenings",
  "Singles Mixer",
  "Social Experiences",
  "Social Games & Trivia",
  "Social Mixers",
  "Speed Dating",
  "Sports",
  "Standups",
  "Storytelling",
  "Sufi",
  "Sundowners",
  "Tech & Innovation",
  "Theatre",
  "Themed Parties",
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "date", label: "Date" },
  { value: "distance", label: "Distance: Near to Far" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export function categoryMatches(eventCategory: string | null | undefined, selected: string[]): boolean {
  if (selected.length === 0) return true;
  if (!eventCategory) return false;
  const normalized = eventCategory.trim().toLowerCase();
  return selected.some((cat) => cat.toLowerCase() === normalized);
}

export function eventMatchesCategories(
  event: { category?: string | null; genre?: string | null },
  selected: string[]
): boolean {
  if (selected.length === 0) return true;
  return categoryMatches(event.category, selected) || categoryMatches(event.genre, selected);
}
