
import type { GeneratedCharacter } from "./generators/characterGenerator";

const cache = new Map<string, GeneratedCharacter>();

export function getFromCache(key: string): GeneratedCharacter | undefined {
  return cache.get(key);
}

export function setToCache(key: string, value: GeneratedCharacter): void {
  cache.set(key, value);
}
