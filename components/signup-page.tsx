import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, UserPlus } from 'lucide-react';

interface SignupPageProps {
  onSignup: (nickname: string) => void;
  onBack?: () => void;
}

export default function SignupPage({ onSignup, onBack }: SignupPageProps) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname && email && password) {
      onSignup(nickname);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-bounce">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">모험 시작하기</h2>
          <p className="text-muted-foreground mt-2">나만의 캐릭터를 만들 준비가 되셨나요?</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-foreground font-semibold">닉네임</Label>
            <Input
              id="nickname"
              placeholder="멋진 이름을 지어주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="rounded-xl border-2 border-primary/20 focus:border-primary h-12 bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-semibold">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border-2 border-primary/20 focus:border-primary h-12 bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-semibold">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border-2 border-primary/20 focus:border-primary h-12 bg-white"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            가입하고 시작하기
          </Button>
        </form>

        {/* Footer */}
        {onBack && (
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
