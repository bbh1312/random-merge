import db from "./db";

export interface UserProfile {
  deviceId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

const getStmt = db.prepare("SELECT deviceId, nickname, createdAt, updatedAt FROM users WHERE deviceId = ?");
const insertStmt = db.prepare(
  "INSERT INTO users (deviceId, nickname, createdAt, updatedAt) VALUES (@deviceId, @nickname, @createdAt, @updatedAt)"
);
const updateStmt = db.prepare(
  "UPDATE users SET nickname = @nickname, updatedAt = @updatedAt WHERE deviceId = @deviceId"
);

export function getUserProfile(deviceId: string): UserProfile | null {
  const profile = getStmt.get(deviceId) as UserProfile | undefined;
  return profile ?? null;
}

export function upsertUserProfile(deviceId: string, nickname: string): UserProfile {
  const existing = getUserProfile(deviceId);
  const now = new Date().toISOString();

  if (existing) {
    updateStmt.run({ nickname, updatedAt: now, deviceId });
    return { ...existing, nickname, updatedAt: now };
  }

  insertStmt.run({ deviceId, nickname, createdAt: now, updatedAt: now });
  return {
    deviceId,
    nickname,
    createdAt: now,
    updatedAt: now,
  };
}
