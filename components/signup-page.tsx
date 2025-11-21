'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, UserPlus } from 'lucide-react';

interface SignupPageProps {
  onSignup: (nickname: string) => void;
  onBack?: () => void;
  loading?: boolean;
  error?: string | null;
}

export default function SignupPage({ onSignup, onBack, loading, error }: SignupPageProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (!trimmed) return;
    onSignup(trimmed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-orange-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-white">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 animate-bounce">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">닉네임만 정하면 시작!</h2>
          <p className="text-muted-foreground mt-2">초등 친구들도 쉽고 빠르게 가입할 수 있어요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname" className="text-foreground font-semibold">
              닉네임
            </Label>
            <Input
              id="nickname"
              placeholder="예: 뽀짝캣, 큐브달팽이"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="rounded-xl border-2 border-primary/20 focus:border-primary h-12 bg-white"
              maxLength={20}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-60"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {loading ? '가입 중...' : '가입하고 시작하기'}
          </Button>
        </form>

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
