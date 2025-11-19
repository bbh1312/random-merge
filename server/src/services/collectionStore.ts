import { getMaxSlots } from "./slotStore";

export interface StoredCharacter {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  premium?: boolean;
  soundUrl?: string;
  parts: string[];
  createdAt: string;
}

const collectionMap = new Map<string, StoredCharacter[]>();

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getCollection(deviceId: string): StoredCharacter[] {
  return collectionMap.get(deviceId) ?? [];
}

export function getCollectionCount(deviceId: string): number {
  return getCollection(deviceId).length;
}

export function addToCollection(
  deviceId: string,
  character: Omit<StoredCharacter, "id" | "createdAt">
): { item: StoredCharacter; maxSlots: number; used: number } {
  const current = getCollection(deviceId);
  const maxSlots = getMaxSlots(deviceId);
  if (current.length >= maxSlots) {
    throw new Error("COLLECTION_FULL");
  }

  const item: StoredCharacter = {
    ...character,
    id: newId(),
    createdAt: new Date().toISOString(),
  };

  collectionMap.set(deviceId, [item, ...current]);

  return { item, maxSlots, used: current.length + 1 };
}
