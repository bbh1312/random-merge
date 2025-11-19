
const MAX_DAILY_PREMIUM = 5;

// key: deviceId|YYYY-MM-DD
const usageMap = new Map<string, number>();

function getTodayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getPremiumUsage(deviceId: string): number {
  const key = `${deviceId}|${getTodayDateStr()}`;
  return usageMap.get(key) ?? 0;
}

export function canUsePremium(deviceId: string): boolean {
  return getPremiumUsage(deviceId) < MAX_DAILY_PREMIUM;
}

export function incrementPremiumUsage(deviceId: string): void {
  const date = getTodayDateStr();
  const key = `${deviceId}|${date}`;
  const current = usageMap.get(key) ?? 0;
  usageMap.set(key, current + 1);
}

export function getMaxDailyPremium(): number {
  return MAX_DAILY_PREMIUM;
}
