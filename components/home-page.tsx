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
}

export default function HomePage({
  onStartFreePull,
  onStartPremiumPull,
  onViewCollection,
  onSignup,
  user,
  recentCharacter,
}: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* User Profile/Signup Button at top right */}
      <div className="absolute top-4 right-4">
        {user ? (
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
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

      {/* Header */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-5xl font-bold text-foreground mb-2">
          Character Mix
        </h1>
        <p className="text-lg text-muted-foreground">
          파츠를 섞어 독특한 캐릭터를 만들어보세요!
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full space-y-6">
        {/* Free Pull Button */}
        <button
          onClick={onStartFreePull}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-orange-500 p-1 transition-all hover:shadow-lg hover:shadow-primary/50"
        >
          <div className="relative bg-background px-8 py-6 rounded-2xl">
            <div className="flex items-center justify-center gap-3 text-center">
              <Sparkles className="w-6 h-6 text-primary" />
              <div>
                <p className="font-bold text-xl text-foreground">무료 뽑기</p>
                <p className="text-sm text-muted-foreground">매일 무제한</p>
              </div>
            </div>
          </div>
        </button>

        {/* Premium Pull Button */}
        <button
          onClick={onStartPremiumPull}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-purple-600 p-1 transition-all hover:shadow-lg hover:shadow-secondary/50"
        >
          <div className="relative bg-background px-8 py-6 rounded-2xl">
            <div className="flex items-center justify-center gap-3 text-center">
              <Star className="w-6 h-6 text-secondary" />
              <div>
                <p className="font-bold text-xl text-foreground">프리미엄 뽑기</p>
                <p className="text-sm text-muted-foreground">일일 5회 한정</p>
              </div>
            </div>
          </div>
        </button>

        {/* Recent Character */}
        {recentCharacter && (
          <Card className="p-6 bg-white border-2 border-primary/20">
            <p className="text-sm text-muted-foreground mb-3">최근 조합</p>
            <div className="flex items-center gap-4">
              <img
                src="/cute-character.png"
                alt={recentCharacter.name}
                className="w-20 h-20 rounded-lg"
              />
              <div className="flex-1">
                <p className="font-bold text-foreground">{recentCharacter.name}</p>
                <p className="text-sm text-muted-foreground">
                  {recentCharacter.parts.join(', ')}
                </p>
              </div>
              {recentCharacter.premium && (
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  프리미엄
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Collection Button */}
        <button
          onClick={onViewCollection}
          className="w-full py-4 rounded-xl border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 transition-colors"
        >
          도감 보기 ({recentCharacter ? '1' : '0'})
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="mt-16 text-center">
        <div className="inline-block text-6xl">🎨</div>
      </div>
    </div>
  );
}
