
export interface CharacterResponse {
  name: string;
  description: string;
  imageUrl: string;
  premium?: boolean;
  soundUrl?: string;
}

interface GenerateOptions {
  premium?: boolean;
  deviceId?: string;
  adToken?: string;
}

export interface SlotsResponse {
  baseSlots: number;
  extraSlots: number;
  maxSlots: number;
  used: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  premium?: boolean;
  soundUrl?: string;
  parts: string[];
  createdAt: string;
}

const API_BASE_URL = "http://localhost:4000"; // 개발 환경 기준

export async function generateCharacter(
  parts: string[],
  options: GenerateOptions = {}
): Promise<CharacterResponse> {
  const res = await fetch(`${API_BASE_URL}/generate-character`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      parts,
      premium: options.premium ?? false,
      deviceId: options.deviceId,
      adToken: options.adToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to generate character: ${res.status} ${text}`);
  }

  return res.json();
}

export async function getCollectionSlots(deviceId: string): Promise<SlotsResponse> {
  const url = `${API_BASE_URL}/collection/slots?deviceId=${encodeURIComponent(deviceId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch slots: ${res.status} ${text}`);
  }
  return res.json();
}

export async function claimCollectionSlots(deviceId: string): Promise<SlotsResponse> {
  const res = await fetch(`${API_BASE_URL}/ad/claim-collection-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to claim slots: ${res.status} ${text}`);
  }
  return res.json();
}

export async function saveCollectionItem(
  deviceId: string,
  character: CharacterResponse,
  parts: string[]
): Promise<{ item: CollectionItem; slots: SlotsResponse }> {
  const res = await fetch(`${API_BASE_URL}/collection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, character, parts }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to save collection: ${res.status} ${text}`);
  }
  return res.json();
}
