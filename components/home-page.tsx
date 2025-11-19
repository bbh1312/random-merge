import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Star, User } from 'lucide-react';

interface HomePageProps {
  onStartFreePull: () => void;
  onStartPremiumPull: () => void;
  onViewCollection: () => void;
  onSignup: () => void;
  user: { nickname: string } | null;
  recentCharacter: any | null;
  collectionCount: number;
}

export default function HomePage({
  onStartFreePull,
  onStartPremiumPull,
  onViewCollection,
  onSignup,
  user,
  recentCharacter,
  collectionCount,
}: HomePageProps) {
  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-b from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-lg flex flex-col gap-8">
        <div className="flex justify-end">
          {user ? (
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-white/50">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">{user.nickname}님</span>
            </div>
          ) : (
            <Button 
              onClick={onSignup}
              variant="outline" 
              className="rounded-full border-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              회원가입
            </Button>
          )}
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Character Mix</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            파츠를 섞어 독특한 캐릭터를 만들어보세요!
          </p>
        </div>

        <div className="w-full flex-1 space-y-4">
          <button
            onClick={onStartFreePull}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-orange-500 p-1 transition-all hover:shadow-lg hover:shadow-primary/50"
          >
            <div className="relative bg-background px-6 py-5 rounded-2xl">
              <div className="flex items-center justify-center gap-3 text-center">
                <Sparkles className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-bold text-lg text-foreground">무료 뽑기</p>
                  <p className="text-sm text-muted-foreground">매일 무제한</p>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={onStartPremiumPull}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-purple-600 p-1 transition-all hover:shadow-lg hover:shadow-secondary/50"
          >
            <div className="relative bg-background px-6 py-5 rounded-2xl">
              <div className="flex items-center justify-center gap-3 text-center">
                <Star className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-bold text-lg text-foreground">프리미엄 뽑기</p>
                  <p className="text-sm text-muted-foreground">일일 5회 한정</p>
                </div>
              </div>
            </div>
          </button>

          {recentCharacter && (
            <Card className="p-4 bg-white border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">최근 조합</p>
              <div className="flex items-center gap-3">
                <img
                  src="/cute-character.png"
                  alt={recentCharacter.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{recentCharacter.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {recentCharacter.parts.join(', ')}
                  </p>
                </div>
                {recentCharacter.premium && (
                  <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    프리미엄
                  </div>
                )}
              </div>
            </Card>
          )}

          <button
            onClick={onViewCollection}
            className="w-full py-3 rounded-xl border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors text-sm"
          >
            도감 보기 ({collectionCount})
          </button>
        </div>
      </div>
    </div>
  );
}
