import { pgPool } from "./db";

export interface UserProfile {
  deviceId: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
}

type UserRow = {
  device_id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
};

let initPromise: Promise<void> | null = null;

function mapRow(row: UserRow): UserProfile {
  return {
    deviceId: row.device_id,
    nickname: row.nickname,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function ensureInitialized() {
  if (!initPromise) {
    initPromise = pgPool
      .query(`
        CREATE TABLE IF NOT EXISTS users (
          device_id TEXT PRIMARY KEY,
          nickname TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `)
      .then(() => undefined);
  }
  return initPromise;
}

export async function getUserProfile(deviceId: string): Promise<UserProfile | null> {
  await ensureInitialized();
  const result = await pgPool.query<UserRow>(
    "SELECT device_id, nickname, created_at, updated_at FROM users WHERE device_id = $1",
    [deviceId]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function upsertUserProfile(deviceId: string, nickname: string): Promise<UserProfile> {
  const now = new Date().toISOString();

  await ensureInitialized();
  const result = await pgPool.query<UserRow>(
    `
      INSERT INTO users (device_id, nickname, created_at, updated_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (device_id)
      DO UPDATE SET
        nickname = EXCLUDED.nickname,
        updated_at = EXCLUDED.updated_at
      RETURNING device_id, nickname, created_at, updated_at
    `,
    [deviceId, nickname, now, now]
  );
  return mapRow(result.rows[0]);
}
