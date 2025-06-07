export const TAG_KEYWORDS = [
  "ansiedade",
  "tristeza",
  "medicação",
  "luto",
  "automutilação",
  "fobia",
  "abuso",
  "escola",
];

export function generateSessionSummary(text: string): string {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  return sentences.slice(0, 2).join(" ").trim();
}

export function extractSessionTags(text: string): string[] {
  const lower = text.toLowerCase();
  return TAG_KEYWORDS.filter((k) => lower.includes(k));
}
