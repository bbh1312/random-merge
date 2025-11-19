
export function makePartsKey(parts: string[]): string {
  return parts.slice().sort().join("|");
}
