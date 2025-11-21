export interface CharacterResponse {
  name: string;
  description: string;
  imageUrl: string;
  premium?: boolean;
  soundUrl?: string;
}

export interface GenerateOptions {
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API request failed (${res.status})`);
  }

  return res.json();
}

export async function apiGenerateCharacter(parts: string[], options: GenerateOptions = {}) {
  return request<CharacterResponse>("/generate-character", {
    method: "POST",
    body: JSON.stringify({
      parts,
      premium: options.premium ?? false,
      deviceId: options.deviceId,
      adToken: options.adToken,
    }),
  });
}

export async function apiSaveCollectionItem(
  deviceId: string,
  character: CharacterResponse,
  parts: string[]
) {
  return request<{ item: CollectionItem; slots: SlotsResponse }>("/collection", {
    method: "POST",
    body: JSON.stringify({ deviceId, character, parts }),
  });
}
