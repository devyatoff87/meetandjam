export const CATEGORY_SLUGS = [
  "jam",
  "word",
  "theater",
  "standup",
  "dance",
  "another",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
