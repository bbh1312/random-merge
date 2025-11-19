
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
