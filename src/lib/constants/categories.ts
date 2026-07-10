// Single source of truth for partner business categories in this app.
// Must stay in sync with the backend enum in api-kubi `src/models/Partner.ts`
// and the commission floors in api-kubi `src/config/commission.ts`.

export const PARTNER_CATEGORIES = [
  "restaurant",
  "bar",
  "cafe",
  "club",
  "store",
  "spa",
  "gym",
  "beauty",
  "hotel",
  "pharmacy",
  "tour",
  "other",
] as const;

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number];

export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  restaurant: "Restaurante",
  bar: "Bar / Cantina",
  cafe: "Café / Cafetería",
  club: "Antro / Club",
  store: "Tienda",
  spa: "Spa",
  gym: "Gimnasio",
  beauty: "Belleza",
  hotel: "Hotel",
  pharmacy: "Farmacia",
  tour: "Tour / Experiencia",
  other: "Otro",
};

/** value/label pairs for <select> option lists. */
export const CATEGORY_OPTIONS: { value: PartnerCategory; label: string }[] =
  PARTNER_CATEGORIES.map((value) => ({
    value,
    label: PARTNER_CATEGORY_LABELS[value],
  }));
