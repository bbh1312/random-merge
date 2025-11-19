import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Star, Grid3x3 } from 'lucide-react';

interface CollectionPageProps {
  characters: any[];
  onBack: () => void;
}

export default function CollectionPage({
  characters,
  onBack,
}: CollectionPageProps) {
  const premiumCount = characters.filter((c) => c.premium).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Grid3x3 className="w-8 h-8" />
              캐릭터 도감
            </h1>
            <p className="text-muted-foreground mt-2">
              총 {characters.length}개 수집 ({premiumCount} 프리미엄)
            </p>
          </div>
        </div>
      </div>

      {/* Collection Grid */}
      <div className="max-w-4xl mx-auto">
        {characters.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              아직 캐릭터가 없어요!
            </h2>
            <p className="text-muted-foreground mb-6">
              게임을 시작해서 첫 번째 캐릭터를 만들어보세요.
            </p>
            <Button
              onClick={onBack}
              className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg"
            >
              게임 시작
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all transform hover:scale-105 bg-white"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={character.imageUrl || "/placeholder.svg"}
                    alt={character.name}
                    className="w-full h-48 object-cover"
                  />
                  {character.premium && (
                    <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold">프리미엄</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    {character.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {character.parts.join(' × ')}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {character.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {characters.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {characters.length}
                </p>
                <p className="text-sm text-muted-foreground">총 캐릭터</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{premiumCount}</p>
                <p className="text-sm text-muted-foreground">프리미엄</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  {Math.round((premiumCount / characters.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">희귀도</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
