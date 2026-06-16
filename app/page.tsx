'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUsers, deleteUser } from '@/lib/storage';
import type { UserProfile } from '@/lib/types';
import UserCard from '@/components/UserCard';
import { formatKoreanDate } from '@/lib/fortune';

export default function Home() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUsers(getUsers());
    setIsLoaded(true);
  }, []);

  function handleDelete(id: string) {
    deleteUser(id);
    setUsers(getUsers());
  }

  const today = new Date();
  const koreanDate = formatKoreanDate(today);

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-xl mx-auto">

        {/* 히어로 이미지 + 타이틀 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-sm">
            <img
              src="/images/main-hero.png"
              alt="오늘의 운세"
              className="w-full"
              style={{ filter: 'drop-shadow(0 8px 32px rgba(44,44,44,0.18))' }}
            />
          </div>

          <h1
            className="text-4xl font-black mt-2 tracking-widest"
            style={{ color: 'var(--meok)', letterSpacing: '0.15em' }}
          >
            오늘의 운세
          </h1>
          <p className="text-sm mt-1" style={{ color: '#8A7A68' }}>
            당신의 행운을 확인하세요
          </p>

          <hr className="divider-traditional w-full max-w-xs mt-4" />

          {/* 오늘 날짜 */}
          <p className="text-sm mt-2" style={{ color: 'var(--hwangto)', fontWeight: 600 }}>
            {koreanDate}
          </p>
        </div>

        {/* 로딩 스켈레톤 */}
        {!isLoaded && (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="talisman-card p-5 animate-pulse h-32" />
            ))}
          </div>
        )}

        {/* 사용자 카드 목록 */}
        {isLoaded && users.length > 0 && (
          <div className="space-y-4">
            {users.map(user => (
              <UserCard key={user.id} user={user} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* 빈 상태 */}
        {isLoaded && users.length === 0 && (
          <div className="talisman-card p-8 text-center">
            <p className="text-4xl mb-3">🔮</p>
            <p className="font-bold mb-1" style={{ color: 'var(--meok)' }}>
              아직 등록된 사람이 없습니다
            </p>
            <p className="text-sm mb-4" style={{ color: '#8A7A68' }}>
              이름과 생년월일을 등록하면<br />
              매일 운세를 확인할 수 있습니다
            </p>
          </div>
        )}

        {/* 추가 버튼 */}
        {isLoaded && (
          <div className="mt-6 text-center">
            <Link href="/users/new" className="btn-primary inline-block" style={{ textDecoration: 'none' }}>
              + 새 사람 추가하기
            </Link>
          </div>
        )}

        {/* 하단 장식 */}
        <div className="text-center mt-10 pb-4">
          <p className="text-xs tracking-widest" style={{ color: '#C8A87A' }}>
            ✦ &nbsp; 천 지 인 (天 地 人) &nbsp; ✦
          </p>
        </div>

      </div>
    </div>
  );
}
