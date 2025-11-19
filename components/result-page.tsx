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
          className={`max-w-md w-full transition-all duration-700 ${
            showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="text-center mb-8 pt-8 animate-bounce-slow">
            <h1 className="text-4xl font-bold text-foreground mb-2">축하합니다!</h1>
            <p className="text-muted-foreground">새로운 캐릭터가 생겼어요!</p>
          </div>

          <Card className="p-8 bg-white border-4 border-primary/30 shadow-xl animate-scale-in">
            <div className="mb-6 perspective">
              <div className="animate-flip-in">
                <img
                  src={character.imageUrl || '/placeholder.svg?height=300&width=300&query=cute character'}
                  alt={character.name}
                  className="w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-character-float hover:scale-105 cursor-pointer"
                />
              </div>
            </div>

            {/* Character Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-foreground">
                  {character.name}
                </h2>
                {character.premium && (
                  <div className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold">프리미엄</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {character.parts.join(' × ')}
              </p>
              <p className="text-foreground leading-relaxed">
                {character.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-8 py-4 border-y border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🎨</div>
                <p className="text-xs text-muted-foreground">생성됨</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">⭐</div>
                <p className="text-xs text-muted-foreground">등급: S</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">💫</div>
                <p className="text-xs text-muted-foreground">독창성</p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onSaveToCollection}
                className="w-full py-6 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-transform duration-200 animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                <Heart className="w-5 h-5 mr-2 fill-current" />
                도감에 저장
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={onPullAgain}
                  variant="outline"
                  className="py-6 font-bold rounded-lg border-2 transform hover:scale-105 transition-transform duration-200 animate-slide-up"
                  style={{ animationDelay: '0.2s' }}
                >
                  한 번 더 뽑기
                </Button>
                <Button
                  onClick={onViewCollection}
                  variant="outline"
                  className="py-6 font-bold rounded-lg border-2 transform hover:scale-105 transition-transform duration-200 animate-slide-up"
                  style={{ animationDelay: '0.3s' }}
                >
                  도감 보기
                </Button>
              </div>

              <button
                className="w-full py-3 text-foreground/60 hover:text-foreground transition-colors flex items-center justify-center gap-2 animate-slide-up"
                style={{ animationDelay: '0.4s' }}
              >
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
