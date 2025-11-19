'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Heart, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ResultPageProps {
  character: {
    name: string;
    description: string;
    imageUrl: string;
    premium: boolean;
    parts: string[];
  };
  onSaveToCollection: () => void;
  onViewCollection: () => void;
  onPullAgain: () => void;
}

export default function ResultPage({
  character,
  onSaveToCollection,
  onViewCollection,
  onPullAgain,
}: ResultPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowContent(true), 100);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {isLoading && (
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">캐릭터 생성 중...</h2>
            <p className="text-muted-foreground">마법이 일어나고 있어요✨</p>
          </div>
        </div>
      )}

      {!isLoading && (
        <div
          className={`w-full max-w-[480px] min-w-[320px] flex-1 flex flex-col transition-all duration-700 ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-foreground mb-1">축하합니다!</h1>
            <p className="text-sm text-muted-foreground">새로운 캐릭터가 생겼어요!</p>
          </div>

          <Card className="flex flex-col flex-1 p-4 bg-white border-4 border-primary/30 shadow-xl">
            <div className="mb-4">
              <img
                src={character.imageUrl || '/placeholder.svg?height=280&width=280&query=cute character'}
                alt={character.name}
                className="w-full rounded-xl shadow-md"
              />
            </div>

            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-foreground">{character.name}</h2>
                {character.premium && (
                  <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" />
                    프리미엄
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{character.parts.join(' × ')}</p>
              <p className="text-sm text-foreground leading-relaxed">{character.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border text-center text-xs">
              <div>
                <div className="text-xl">🎨</div>
                <p className="text-muted-foreground">생성됨</p>
              </div>
              <div>
                <div className="text-xl">⭐</div>
                <p className="text-muted-foreground">등급 S</p>
              </div>
              <div>
                <div className="text-xl">💫</div>
                <p className="text-muted-foreground">독창성</p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <Button
                onClick={onSaveToCollection}
                className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-lg"
              >
                <Heart className="w-4 h-4 mr-2 fill-current" />
                도감에 저장
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onPullAgain}
                  variant="outline"
                  className="py-4 text-sm font-bold rounded-lg border-2"
                >
                  한 번 더 뽑기
                </Button>
                <Button
                  onClick={onViewCollection}
                  variant="outline"
                  className="py-4 text-sm font-bold rounded-lg border-2"
                >
                  도감 보기
                </Button>
              </div>

              <button className="w-full py-3 text-xs text-foreground/60 hover:text-foreground transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" />
                공유하기
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
