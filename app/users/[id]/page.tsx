'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUserById } from '@/lib/storage';
import { generateDailyFortune, getTodayLocal } from '@/lib/fortune';
import type { DailyFortune, UserProfile } from '@/lib/types';
import FortuneLoading from '@/components/FortuneLoading';
import FortuneDisplay from '@/components/FortuneDisplay';

export default function FortunePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<UserProfile | null>(null);
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const found = getUserById(id);
    if (!found) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    setUser(found);
  }, [id]);

  const handleLoadingComplete = useCallback(() => {
    if (!user) return;
    const result = generateDailyFortune(user, getTodayLocal());
    setFortune(result);
    setIsLoading(false);
  }, [user]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-4xl mb-3">😔</p>
        <p className="font-bold mb-4" style={{ color: 'var(--meok)' }}>사용자를 찾을 수 없습니다</p>
        <button onClick={() => router.push('/')} className="btn-secondary">
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (!user) return null;

  if (isLoading) {
    return <FortuneLoading name={user.name} onComplete={handleLoadingComplete} />;
  }

  if (!fortune) return null;

  return <FortuneDisplay fortune={fortune} user={user} />;
}
