/** Coerce paginated API / odd shapes into an array for .map-safe rendering. */
export function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}
