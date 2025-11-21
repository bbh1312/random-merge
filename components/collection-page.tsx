import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CollectionItem } from '@/lib/api-client';
import { ArrowLeft, Star, Grid3x3 } from 'lucide-react';

interface CollectionPageProps {
  characters: CollectionItem[];
  onBack: () => void;
}

export default function CollectionPage({ characters, onBack }: CollectionPageProps) {
  const premiumCount = characters.filter((c) => c.premium).length;

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-[480px] min-w-[320px] flex flex-col gap-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>

        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Grid3x3 className="w-7 h-7" />
            캐릭터 도감
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            총 {characters.length}개 수집 ({premiumCount} 프리미엄)
          </p>
        </div>

        {characters.length === 0 ? (
          <Card className="p-8 text-center bg-white">
            <div className="text-5xl mb-3">📭</div>
            <h2 className="text-xl font-bold text-foreground mb-2">아직 캐릭터가 없어요!</h2>
            <p className="text-muted-foreground mb-6 text-sm">게임을 시작해서 첫 번째 캐릭터를 만들어보세요.</p>
            <Button onClick={onBack} className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg w-full">
              게임 시작
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {characters.map((character) => (
              <Card key={character.id} className="overflow-hidden bg-white">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img src={character.imageUrl || "/placeholder.svg"} alt={character.name} className="w-full h-48 object-cover" />
                  {character.premium && (
                    <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-1 shadow-md text-xs font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      프리미엄
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-foreground mb-1">{character.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{character.parts.join(' × ')}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{character.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {characters.length > 0 && (
          <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-xl font-bold text-primary">{characters.length}</p>
                <p className="text-muted-foreground">총 캐릭터</p>
              </div>
              <div>
                <p className="text-xl font-bold text-secondary">{premiumCount}</p>
                <p className="text-muted-foreground">프리미엄</p>
              </div>
              <div>
                <p className="text-xl font-bold text-accent">
                  {characters.length ? Math.round((premiumCount / characters.length) * 100) : 0}%
                </p>
                <p className="text-muted-foreground">희귀도</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
