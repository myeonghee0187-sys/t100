// The design supplies month/day and aggregate counts, not individual sessions.
// These six aggregate rows use 2026 and noon in Korea to keep the displayed dates
// stable. Settings without a saved preference use the editable prototype default.
export const seedRecords = [
  {
    id: "seed-butterfly-pea",
    teaId: "butterfly-pea",
    brewedAt: "2026-06-22T12:00:00+09:00",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 150,
    count: 1,
  },
  {
    id: "seed-green-tea",
    teaId: "green-tea",
    brewedAt: "2026-08-24T12:00:00+09:00",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 120,
    count: 24,
  },
  {
    id: "seed-hibiscus",
    teaId: "hibiscus",
    brewedAt: "2026-07-27T12:00:00+09:00",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 300,
    count: 3,
  },
  {
    id: "seed-barley",
    teaId: "barley",
    brewedAt: "2026-07-27T12:00:00+09:00",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 150,
    count: 12,
  },
  {
    id: "seed-peppermint",
    teaId: "peppermint",
    brewedAt: "2026-08-14T12:00:00+09:00",
    drinkMode: "iced" as const,
    waterSource: "boiled" as const,
    duration: 240,
    count: 6,
  },
  {
    id: "seed-chamomile",
    teaId: "chamomile",
    brewedAt: "2026-08-21T12:00:00+09:00",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 210,
    count: 17,
  },
];

export const seedPreferences = [
  {
    teaId: "green-tea",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 120,
  },
  {
    teaId: "chamomile",
    drinkMode: "hot" as const,
    waterSource: "purified" as const,
    duration: 210,
  },
  {
    teaId: "peppermint",
    drinkMode: "iced" as const,
    waterSource: "boiled" as const,
    duration: 240,
  },
];
