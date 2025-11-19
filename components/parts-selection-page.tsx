'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';

const CATEGORIES = {
  animals: {
    name: '동물',
    parts: ['고양이', '강아지', '코끼리', '해마', '돌고래', '수달', '여우', '판다'],
    emoji: '🐱',
    color: 'bg-orange-100 text-orange-600',
  },
  insects: {
    name: '곤충',
    parts: ['딱정벌레', '사마귀', '잠자리', '무당벌레', '나비', '달팽이', '지렁이', '개미'],
    emoji: '🦋',
    color: 'bg-green-100 text-green-600',
  },
  fruits: {
    name: '과일',
    parts: ['딸기', '바나나', '사과', '포도', '수박', '파인애플', '망고', '블루베리'],
    emoji: '🍓',
    color: 'bg-red-100 text-red-600',
  },
  plants: {
    name: '식물',
    parts: ['당근', '브로콜리', '옥수수', '호박', '가지', '양배추', '콩나물', '버섯'],
    emoji: '🥕',
    color: 'bg-emerald-100 text-emerald-600',
  },
  objects: {
    name: '사물',
    parts: ['망원경', '우산', '물총', '연필', '북', '탐버린', '종이비행기', '풍선'],
    emoji: '🎈',
    color: 'bg-blue-100 text-blue-600',
  },
  nature: {
    name: '자연',
    parts: ['구름', '별', '달', '돌멩이', '파도', '눈송이', '번개', '무지개'],
    emoji: '⭐',
    color: 'bg-purple-100 text-purple-600',
  },
};

interface PartsSelectionPageProps {
  onPartsSelected: (parts: string[]) => void;
  onBack: () => void;
  isPremium: boolean;
}

export default function PartsSelectionPage({
  onPartsSelected,
  onBack,
  isPremium,
}: PartsSelectionPageProps) {
  const categoryEntries = Object.entries(CATEGORIES);
  const defaultCategory = categoryEntries[0]?.[0] ?? null;
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(defaultCategory);

  const handleSelectPart = (part: string) => {
    setSelectedParts((prev) => {
      if (prev.includes(part)) {
        return prev.filter((p) => p !== part);
      } else if (prev.length < 2) {
        return [...prev, part];
      }
      return prev;
    });
  };

  const handleGenerate = () => {
    if (selectedParts.length === 2) {
      onPartsSelected(selectedParts);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-pink-50 p-4 flex flex-col">
      {/* Header */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            홈으로
          </button>
          <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-purple-100">
            <p className="text-sm font-bold text-primary">
              {selectedParts.length} / 2 선택됨
            </p>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {CATEGORIES[activeCategory as keyof typeof CATEGORIES]?.name ?? '파츠 선택'}
        </h1>
        <p className="text-muted-foreground">
          마음에 드는 파츠를 선택해주세요
        </p>
      </div>

      {/* Selected Parts Preview Bar */}
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="bg-white/60 backdrop-blur p-4 rounded-xl border border-purple-100 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">선택된 파츠:</span>
          {selectedParts.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {selectedParts.map((part) => (
                <span key={part} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  {part}
                  <button 
                    onClick={() => handleSelectPart(part)}
                    className="hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">아직 선택된 파츠가 없어요</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto w-full flex-1">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50">
         <div className="flex gap-3 overflow-x-auto pb-4 mb-4">
            {categoryEntries.map(([key, category]) => {
              const isActive = key === activeCategory;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors whitespace-nowrap ${
                    isActive ? 'bg-primary text-white border-primary' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xl">{category.emoji}</span>
                  {category.name}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {activeCategory && CATEGORIES[activeCategory as keyof typeof CATEGORIES].parts.map((part) => {
              const isSelected = selectedParts.includes(part);
              return (
                <button
                  key={part}
                  onClick={() => handleSelectPart(part)}
                  className={`py-4 px-4 rounded-xl font-bold transition-all transform hover:scale-105 relative overflow-hidden ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {part}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Generate Button - Fixed at bottom or below content */}
      <div className="max-w-2xl mx-auto w-full mt-8 mb-4">
        <Button
          onClick={handleGenerate}
          disabled={selectedParts.length !== 2}
          className="w-full py-7 text-xl font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-primary to-orange-500 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1"
        >
          {selectedParts.length === 2 ? '캐릭터 생성하기 ✨' : `${2 - selectedParts.length}개 더 선택해주세요`}
        </Button>
      </div>
    </div>
  );
}
