const STORAGE_KEY = "random_character_device_id";
let cachedId: string | null = null;

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId;
  if (typeof window === "undefined") {
    cachedId = createId();
    return cachedId;
  }
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) {
    cachedId = existing;
    return existing;
  }
  const newId = createId();
  window.localStorage.setItem(STORAGE_KEY, newId);
  cachedId = newId;
  return newId;
}
