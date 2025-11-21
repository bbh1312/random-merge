export interface UserProfile {
  deviceId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

const userMap = new Map<string, UserProfile>();

export function getUserProfile(deviceId: string): UserProfile | null {
  return userMap.get(deviceId) ?? null;
}

export function upsertUserProfile(deviceId: string, nickname: string): UserProfile {
  const existing = userMap.get(deviceId);
  const now = new Date().toISOString();

  const profile: UserProfile = existing
    ? { ...existing, nickname, updatedAt: now }
    : {
        deviceId,
        nickname,
        createdAt: now,
        updatedAt: now,
      };

  userMap.set(deviceId, profile);
  return profile;
}
