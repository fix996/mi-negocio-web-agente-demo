import { validSearch, type SearchSpec } from './prospecto';

/** A small, explicit demo parser; no LLM or remote search is performed. */
export function parseSearch(
  input: string,
  defaultCount: number,
): SearchSpec | null {
  if (input.length > 300) return null;
  const match = input
    .trim()
    .match(
      /^(?:(?:busc[aá]|buscar|encontr[aá]|quiero)\s+)?(?:(\d+)\s+)?(.+?)\s+en\s+(.+?)[.!?]?$/i,
    );
  if (!match) return null;
  const result = {
    industry: match[2].trim(),
    place: match[3].trim(),
    count: match[1] ? Number(match[1]) : defaultCount,
  };
  return validSearch(result) ? result : null;
}
