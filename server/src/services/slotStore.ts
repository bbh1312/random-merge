const BASE_SLOTS = 50;
const INCREMENT = 10;
const MAX_SLOTS = 100;

// key: deviceId -> extra slots (increments of 10)
const extraSlots = new Map<string, number>();

export function getBaseSlots(): number {
  return BASE_SLOTS;
}

export function getExtraSlots(deviceId: string): number {
  return extraSlots.get(deviceId) ?? 0;
}

export function getMaxSlots(deviceId: string): number {
  const max = BASE_SLOTS + getExtraSlots(deviceId);
  return Math.min(max, MAX_SLOTS);
}

export function claimSlots(deviceId: string): { maxSlots: number; extraSlots: number } {
  const currentExtra = getExtraSlots(deviceId);
  const currentMax = Math.min(BASE_SLOTS + currentExtra, MAX_SLOTS);
  if (currentMax >= MAX_SLOTS) {
    return { maxSlots: currentMax, extraSlots: currentExtra };
  }

  const nextExtra = Math.min(currentExtra + INCREMENT, MAX_SLOTS - BASE_SLOTS);
  extraSlots.set(deviceId, nextExtra);
  return { maxSlots: getMaxSlots(deviceId), extraSlots: nextExtra };
}
