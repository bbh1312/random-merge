
import { openai } from "../openaiClient";
import { makePartsKey } from "../utils/partsKey";
import { getFromCache, setToCache } from "../cache";

export interface GeneratedCharacter {
  name: string;
  description: string;
  imageUrl: string;
}

interface LlmCharacter {
  name: string;
  description: string;
  image_prompt: string;
}

export interface GenerateOptions {
  premium?: boolean;
}

async function generateCharacterMeta(parts: string[]): Promise<LlmCharacter> {
  const systemPrompt = `
너는 2D 캐릭터 게임의 크리에이티브 디자이너야.

입력으로 동물, 과일, 사물 등의 파츠 목록을 받으면,
아래 형식의 JSON만 출력해야 한다.

- name: 한국어로 된 짧고 귀여운 캐릭터 이름 (10자 이내)
- description: 한국어로 2~4문장 설명. 어린이 동화 같은 느낌, 귀엽고 약간 웃기게.
- image_prompt: 영어로 된 이미지 생성 프롬프트. 
  2D 게임용 캐릭터, 단색 배경, 심플한 라인아트, 귀엽고 밝은 느낌을 반드시 포함할 것.

항상 JSON 형식만 출력해.
추가 설명, 마크다운, 코드 블록 없이 오직 JSON만!
  `.trim();

  const userPrompt = `
파츠 목록: ${JSON.stringify(parts, null, 2)}

위 파츠를 조합한 단 하나의 캐릭터를 만들어줘.
JSON 키는 name, description, image_prompt만 포함해야 해.
  `.trim();

  if (!openai) {
    throw new Error("OpenAI client not configured");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-5.1-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content from OpenAI");
  }

  const parsed = JSON.parse(content) as LlmCharacter;
  if (!parsed.name || !parsed.description || !parsed.image_prompt) {
    throw new Error("Invalid LLM response shape");
  }

  return parsed;
}

async function generateImageUrl(imagePrompt: string): Promise<string> {
  if (!openai) {
    throw new Error("OpenAI client not configured");
  }

  const img = await openai.images.generate({
    model: "gpt-image-1",
    prompt: imagePrompt,
    size: "512x512",
    n: 1,
  });

  const url = img.data[0]?.url;
  if (!url) {
    throw new Error("No image URL from OpenAI");
  }
  return url;
}

// 간단한 프리셋 예시
const PRESET_CHARACTERS: Record<string, GeneratedCharacter> = {
  "고양이|비둘기": {
    name: "고둘기",
    description:
      "고양이와 비둘기가 합쳐진 도시의 수상한 관찰자. 낮에는 잠만 자지만, 밤이 되면 골목길을 어슬렁거리며 빵 부스러기를 모은다.",
    imageUrl: "https://placekitten.com/400/400"
  }
};

export async function generateCharacter(
  parts: string[],
  options: GenerateOptions = {}
): Promise<GeneratedCharacter> {
  const { premium = false } = options;
  const key = makePartsKey(parts);

  // 프리셋 우선
  if (PRESET_CHARACTERS[key]) {
    return PRESET_CHARACTERS[key];
  }

  // 무료 모드일 때는 캐시 먼저 확인
  if (!premium) {
    const cached = getFromCache(key);
    if (cached) return cached;
  }

  // AI 시도
  try {
    const meta = await generateCharacterMeta(parts);
    const imageUrl = await generateImageUrl(meta.image_prompt);

    const result: GeneratedCharacter = {
      name: meta.name,
      description: meta.description,
      imageUrl,
    };

    setToCache(key, result);
    return result;
  } catch (err) {
    console.error("AI generation failed, using fallback:", err);

    // fallback: 단순 조합
    const fallback: GeneratedCharacter = {
      name: parts.join(""),
      description: `${parts.join(" + ")}가(이) 합쳐진 임시 캐릭터입니다. 서버에서 AI 생성에 실패해서 기본 설명을 사용합니다.`,
      imageUrl: "https://placekitten.com/512/512",
    };

    setToCache(key, fallback);
    return fallback;
  }
}
