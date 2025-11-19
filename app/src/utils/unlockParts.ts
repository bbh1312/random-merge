import AsyncStorage from "@react-native-async-storage/async-storage";

export type CategoryKey =
  | "ANIMALS"
  | "INSECTS"
  | "FRUITS"
  | "VEGGIES"
  | "OBJECTS"
  | "NATURAL"
  | "FANTASY";

export const DEFAULT_UNLOCK = 30;
const INCREMENT = 10;
const STORAGE_KEY = "unlocked_parts_counts";

export type UnlockMap = Record<CategoryKey, number>;

function clampUnlock(total: number, desired: number): number {
  return Math.min(desired, total);
}

export async function getUnlockedCounts(
  deviceId: string,
  totals: Record<CategoryKey, number>
): Promise<UnlockMap> {
  const raw = await AsyncStorage.getItem(`${STORAGE_KEY}:${deviceId}`);
  const base: UnlockMap = {
    ANIMALS: clampUnlock(totals.ANIMALS, DEFAULT_UNLOCK),
    INSECTS: clampUnlock(totals.INSECTS, DEFAULT_UNLOCK),
    FRUITS: clampUnlock(totals.FRUITS, DEFAULT_UNLOCK),
    VEGGIES: clampUnlock(totals.VEGGIES, DEFAULT_UNLOCK),
    OBJECTS: clampUnlock(totals.OBJECTS, DEFAULT_UNLOCK),
    NATURAL: clampUnlock(totals.NATURAL, DEFAULT_UNLOCK),
    FANTASY: clampUnlock(totals.FANTASY, DEFAULT_UNLOCK),
  };

  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<UnlockMap>;
    const merged: UnlockMap = { ...base };
    (Object.keys(base) as CategoryKey[]).forEach((key) => {
      const val = parsed[key];
      if (typeof val === "number") {
        merged[key] = clampUnlock(totals[key], val);
      }
    });
    return merged;
  } catch {
    return base;
  }
}

export async function incrementUnlock(
  deviceId: string,
  category: CategoryKey,
  totals: Record<CategoryKey, number>
): Promise<UnlockMap> {
  const current = await getUnlockedCounts(deviceId, totals);
  const nextVal = clampUnlock(totals[category], current[category] + INCREMENT);
  const next: UnlockMap = { ...current, [category]: nextVal };
  await AsyncStorage.setItem(`${STORAGE_KEY}:${deviceId}`, JSON.stringify(next));
  return next;
}
