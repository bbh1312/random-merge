
// 무료 카테고리
export const ANIMALS = ["고양이", "강아지", "코끼리", "해마", "돌고래", "수달", "여우", "판다", "하마", "미어캣", "올빼미"];
export const INSECTS = ["딱정벌레", "사마귀", "잠자리", "무당벌레", "나비", "달팽이", "지렁이", "개미"];
export const FRUITS = ["딸기", "바나나", "사과", "포도", "수박", "파인애플", "망고", "블루베리", "키위"];
export const VEGGIES = ["당근", "브로콜리", "옥수수", "호박", "가지", "양배추", "콩나물", "버섯", "선인장", "해바라기"];
export const OBJECTS = ["망원경", "우산", "물총", "연필", "북", "탬버린", "종이비행기", "풍선", "찻주전자", "롤러 스케이트"];
export const NATURAL = ["구름", "별", "달", "돌멩이", "파도", "눈송이", "번개", "무지개", "불꽃"];
export const FANTASY = ["정령", "로봇", "요정", "슬라임", "작은 고블린", "미니 드래곤", "괴물", "심해생물"];

export function getRandomParts(count: number = 3): string[] {
  const pool = [...ANIMALS, ...INSECTS, ...FRUITS, ...VEGGIES, ...OBJECTS, ...NATURAL, ...FANTASY];
  const selected: string[] = [];
  while (selected.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    const candidate = pool[idx];
    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }
  return selected;
}
