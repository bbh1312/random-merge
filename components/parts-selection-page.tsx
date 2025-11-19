'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

const CATEGORIES = {
  animals: { name: '동물', parts: ['고양이','강아지','코끼리','해마','돌고래','수달','여우','판다'], emoji: '🐱' },
  insects: { name: '곤충', parts: ['딱정벌레','사마귀','잠자리','무당벌레','나비','달팽이','지렁이','개미'], emoji: '🦋' },
  fruits: { name: '과일', parts: ['딸기','바나나','사과','포도','수박','파인애플','망고','블루베리'], emoji: '🍓' },
  plants: { name: '식물', parts: ['당근','브로콜리','옥수수','호박','가지','양배추','콩나물','버섯'], emoji: '🥕' },
  objects: { name: '사물', parts: ['망원경','우산','물총','연필','북','탬버린','종이비행기','풍선'], emoji: '🎈' },
  nature: { name: '자연', parts: ['구름','별','달','돌멩이','파도','눈송이','번개','무지개'], emoji: '⭐' },
};

type CategoryKey = keyof typeof CATEGORIES;

interface PartsSelectionPageProps {
  onPartsSelected: (parts: string[]) => void;
  onBack: () => void;
  isPremium: boolean;
}

export default function PartsSelectionPage({ onPartsSelected, onBack }: PartsSelectionPageProps) {
  const entries = Object.entries(CATEGORIES);
  const defaultCategory = entries[0]?.[0] as CategoryKey | undefined;
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | undefined>(defaultCategory);

  const handleSelectPart = (part: string) => {
    setSelectedParts((prev) => {
      if (prev.includes(part)) return prev.filter((p) => p !== part);
      if (prev.length >= 2) return prev;
      return [...prev, part];
    });
  };

  const handleGenerate = () => {
    if (selectedParts.length === 2) {
      onPartsSelected(selectedParts);
    }
  };

  const currentCategory = activeCategory ? CATEGORIES[activeCategory] : undefined;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-[480px] min-w-[320px] flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" /> 홈으로
          </button>
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-purple-100 text-sm font-bold text-primary">
            {selectedParts.length} / 2 선택됨
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">{currentCategory?.name ?? '파츠 선택'}</h1>
        <p className="text-muted-foreground mb-6">마음에 드는 파츠를 선택해주세요</p>

        <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-purple-100 flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">선택된 파츠:</span>
          {selectedParts.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {selectedParts.map((part) => (
                <span key={part} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  {part}
                  <button onClick={() => handleSelectPart(part)} className="hover:text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">아직 선택된 파츠가 없어요</span>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex-1 flex flex-col">
          <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
            {entries.map(([key, category]) => {
              const active = key === activeCategory;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as CategoryKey)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold whitespace-nowrap transition-colors ${
                    active ? 'bg-primary text-white border-primary' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{category.emoji}</span>
                  {category.name}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(currentCategory?.parts ?? []).map((part) => {
              const active = selectedParts.includes(part);
              return (
                <button
                  key={part}
                  onClick={() => handleSelectPart(part)}
                  className={`py-4 px-4 rounded-xl font-bold transition-all transform hover:scale-105 relative ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {part}
                  {active && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full mt-8">
          <Button
            onClick={handleGenerate}
            disabled={selectedParts.length !== 2}
            className="w-full py-6 text-lg font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-orange-500 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
          >
            {selectedParts.length === 2 ? '캐릭터 생성하기 ✨' : `${2 - selectedParts.length}개 더 선택해주세요`}
          </Button>
        </div>
      </div>
    </div>
  );
}
