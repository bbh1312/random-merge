'use client';

import { useCallback, useEffect, useState } from 'react';
import HomePage from '@/components/home-page';
import PartsSelectionPage from '@/components/parts-selection-page';
import ResultPage, { GeneratedCharacter } from '@/components/result-page';
import CollectionPage from '@/components/collection-page';
import SignupPage from '@/components/signup-page';
import {
  apiGenerateCharacter,
  apiGetUserProfile,
  apiSaveCollectionItem,
  apiUpsertUserProfile,
  CollectionItem,
  UserProfile,
} from '@/lib/api-client';
import { getDeviceId } from '@/lib/device-id';

type PageType = 'home' | 'parts' | 'result' | 'collection' | 'signup';

export default function Page() {
  const [currentPage, setCurrentPage] = useState<PageType>('signup');
  const [isPremium, setIsPremium] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<GeneratedCharacter | null>(null);
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    getDeviceId()
      .then(setDeviceId)
      .catch(() => setDeviceId(null));
  }, []);

  useEffect(() => {
    if (!deviceId) return;
    apiGetUserProfile(deviceId)
      .then((profile) => {
        setUser(profile);
      })
      .catch(() => {
        // ignore missing user
      });
  }, [deviceId]);

  useEffect(() => {
    if (user && currentPage === 'signup') {
      setCurrentPage('home');
    }
  }, [user, currentPage]);

  const ensureDeviceId = useCallback(async () => {
    const id = deviceId ?? (await getDeviceId());
    setDeviceId(id);
    return id;
  }, [deviceId]);

  const handleStartPull = (premium: boolean) => {
    setIsPremium(premium);
    setGeneratedCharacter(null);
    setGenerateError(null);
    setCurrentPage('parts');
  };

  const handlePartsSelected = async (parts: string[]) => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const id = await ensureDeviceId();
      const character = await apiGenerateCharacter(parts, { premium: isPremium, deviceId: id });
      setGeneratedCharacter({
        ...character,
        premium: character.premium ?? isPremium,
        parts,
      });
      setCurrentPage('result');
    } catch (err) {
      console.error(err);
      setGenerateError(err instanceof Error ? err.message : '캐릭터 생성 중 오류가 발생했어요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToCollection = async () => {
    if (!generatedCharacter) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const id = await ensureDeviceId();
      const { item } = await apiSaveCollectionItem(id, generatedCharacter, generatedCharacter.parts);
      setCollection((prev) => [item, ...prev]);
      setCurrentPage('home');
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : '도감 저장에 실패했어요.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToHome = () => {
    setGenerateError(null);
    setCurrentPage('home');
  };

  const handleSignup = (nickname: string) => {
    setIsSigningUp(true);
    setSignupError(null);
    ensureDeviceId()
      .then((id) => apiUpsertUserProfile(id, nickname.trim()))
      .then((profile) => {
        setUser(profile);
        setCurrentPage('home');
      })
      .catch((err) => {
        console.error(err);
        setSignupError(err instanceof Error ? err.message : '회원가입에 실패했어요.');
      })
      .finally(() => setIsSigningUp(false));
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
          recentCharacter={collection[0] || null}
          collectionCount={collection.length}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onBack={user ? handleBackToHome : undefined}
          loading={isSigningUp}
          error={signupError}
        />
      )}
      {currentPage === 'parts' && (
        <PartsSelectionPage
          onPartsSelected={handlePartsSelected}
          onBack={handleBackToHome}
          isPremium={isPremium}
          isLoading={isGenerating}
          error={generateError}
        />
      )}
      {currentPage === 'result' && generatedCharacter && (
        <ResultPage
          character={generatedCharacter}
          onSaveToCollection={handleSaveToCollection}
          onViewCollection={() => setCurrentPage('collection')}
          onPullAgain={() => handleStartPull(isPremium)}
          isSaving={isSaving}
          error={saveError}
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
