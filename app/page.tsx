'use client';

import { useState } from 'react';
import HomePage from '@/components/home-page';
import PartsSelectionPage from '@/components/parts-selection-page';
import ResultPage from '@/components/result-page';
import CollectionPage from '@/components/collection-page';
import SignupPage from '@/components/signup-page';

type PageType = 'home' | 'parts' | 'result' | 'collection' | 'signup';

interface GeneratedCharacter {
  name: string;
  description: string;
  imageUrl: string;
  premium: boolean;
  parts: string[];
}

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('signup');
  const [isPremium, setIsPremium] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<GeneratedCharacter | null>(null);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [collection, setCollection] = useState<GeneratedCharacter[]>([]);
  const [user, setUser] = useState<{ nickname: string } | null>(null);

  const handleStartPull = (premium: boolean) => {
    setIsPremium(premium);
    setSelectedParts([]);
    setCurrentPage('parts');
  };

  const handlePartsSelected = (parts: string[]) => {
    setSelectedParts(parts);
    // Simulate API call to generate character
    const mockCharacter: GeneratedCharacter = {
      name: `${parts.join('')} 친구`,
      description: `이것은 ${parts.join('과 ')}가 합쳐진 귀여운 캐릭터입니다. 매우 독특한 매력을 가지고 있어요!`,
      imageUrl: '/cute-character-combination.jpg',
      premium: isPremium,
      parts: parts,
    };
    setGeneratedCharacter(mockCharacter);
    setCurrentPage('result');
  };

  const handleSaveToCollection = () => {
    if (generatedCharacter) {
      setCollection([...collection, generatedCharacter]);
    }
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleSignup = (nickname: string) => {
    setUser({ nickname });
    setCurrentPage('home');
  };

  return (
    <>
      {currentPage === 'home' && (
        <HomePage
          onStartFreePull={() => handleStartPull(false)}
          onStartPremiumPull={() => handleStartPull(true)}
          onViewCollection={() => setCurrentPage('collection')}
          onSignup={() => setCurrentPage('signup')}
          user={user}
          recentCharacter={collection[collection.length - 1] || null}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onBack={user ? handleBackToHome : undefined}
        />
      )}
      {currentPage === 'parts' && (
        <PartsSelectionPage
          onPartsSelected={handlePartsSelected}
          onBack={handleBackToHome}
          isPremium={isPremium}
        />
      )}
      {currentPage === 'result' && generatedCharacter && (
        <ResultPage
          character={generatedCharacter}
          onSaveToCollection={handleSaveToCollection}
          onViewCollection={() => setCurrentPage('collection')}
          onPullAgain={() => handleStartPull(isPremium)}
        />
      )}
      {currentPage === 'collection' && (
        <CollectionPage
          characters={collection}
          onBack={handleBackToHome}
        />
      )}
    </>
  );
}
