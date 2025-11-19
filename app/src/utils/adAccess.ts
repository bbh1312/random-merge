import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "ad_access_expires_at";
const ACCESS_DURATION_MS = 60 * 60 * 1000; // 1시간

export interface AdAccessState {
  expiresAt: number | null;
  adToken: string | null;
}

export async function getAdAccessState(): Promise<AdAccessState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { expiresAt: null, adToken: null };
  const expiresAt = Number(raw);
  if (Number.isNaN(expiresAt)) return { expiresAt: null, adToken: null };
  if (expiresAt <= Date.now()) {
    await clearAdAccess();
    return { expiresAt: null, adToken: null };
  }
  return { expiresAt, adToken: makeAdToken(expiresAt) };
}

export async function grantAdAccess(): Promise<AdAccessState> {
  const expiresAt = Date.now() + ACCESS_DURATION_MS;
  await AsyncStorage.setItem(STORAGE_KEY, String(expiresAt));
  return { expiresAt, adToken: makeAdToken(expiresAt) };
}

export async function clearAdAccess(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function makeAdToken(expiresAt: number): string {
  // 간단한 로컬 토큰 (서버 연동 시 HMAC 등으로 대체)
  return `local-${expiresAt}`;
}

export function hasValidAdAccess(expiresAt: number | null): boolean {
  return !!expiresAt && expiresAt > Date.now();
}
