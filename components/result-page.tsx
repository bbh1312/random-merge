'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CharacterResponse } from '@/lib/api-client';
import { Star, Heart, Share2 } from 'lucide-react';

export interface GeneratedCharacter extends CharacterResponse {
  parts: string[];
}

interface ResultPageProps {
  character: GeneratedCharacter;
  onSaveToCollection: () => void;
  onViewCollection: () => void;
  onPullAgain: () => void;
  isSaving: boolean;
  error?: string | null;
}

export default function ResultPage({
  character,
  onSaveToCollection,
  onViewCollection,
  onPullAgain,
  isSaving,
  error,
}: ResultPageProps) {
  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[480px] min-w-[320px] flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-1">새로운 캐릭터 등장!</h1>
          <p className="text-sm text-muted-foreground">획득한 캐릭터를 도감에 저장해보세요.</p>
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

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center mb-3">
              {error}
            </p>
          )}

          <div className="space-y-2 mt-auto">
            <Button
              onClick={onSaveToCollection}
              disabled={isSaving}
              className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 text-white font-bold rounded-lg disabled:opacity-60"
            >
              <Heart className="w-4 h-4 mr-2 fill-current" />
              {isSaving ? '저장 중...' : '도감에 저장'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onPullAgain} variant="outline" className="py-4 text-sm font-bold rounded-lg border-2">
                한 번 더 뽑기
              </Button>
              <Button onClick={onViewCollection} variant="outline" className="py-4 text-sm font-bold rounded-lg border-2">
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
    </div>
  );
}
