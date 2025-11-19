
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "device_id";

let cachedDeviceId: string | null = null;

function randomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) {
    cachedDeviceId = stored;
    return stored;
  }

  const newId = randomId();
  await AsyncStorage.setItem(STORAGE_KEY, newId);
  cachedDeviceId = newId;
  return newId;
}
