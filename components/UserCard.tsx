'use client';

import Link from 'next/link';
import type { UserProfile } from '@/lib/types';
import { calculateAge } from '@/lib/fortune';

interface UserCardProps {
  user: UserProfile;
  onDelete: (id: string) => void;
}

export default function UserCard({ user, onDelete }: UserCardProps) {
  const today = new Date().toISOString().split('T')[0];
  const age = calculateAge(user.birthDate, today);

  function handleDelete() {
    if (confirm(`${user.name}님의 정보를 삭제하시겠습니까?`)) {
      onDelete(user.id);
    }
  }

  return (
    <div className="talisman-card p-5 flex flex-col gap-3">
      {/* 이름 + 배지 */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-black" style={{ color: 'var(--meok)' }}>
            {user.name}
          </h2>
          <div className="flex gap-2 mt-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: user.gender === 'male' ? 'rgba(27,94,138,0.12)' : 'rgba(196,30,58,0.1)',
                color: user.gender === 'male' ? 'var(--dancheong)' : 'var(--jinhong)',
                border: `1px solid ${user.gender === 'male' ? 'rgba(27,94,138,0.3)' : 'rgba(196,30,58,0.25)'}`,
              }}
            >
              {user.gender === 'male' ? '남성' : '여성'}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(200,134,10,0.1)',
                color: 'var(--hwangto)',
                border: '1px solid rgba(200,134,10,0.3)',
              }}
            >
              {age}세
            </span>
          </div>
        </div>

        {/* 수정/삭제 */}
        <div className="flex gap-1">
          <Link
            href={`/users/${user.id}/edit`}
            className="text-xs px-2 py-1"
            style={{ color: '#8A7A68', border: '1px solid rgba(138,122,104,0.3)' }}
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="text-xs px-2 py-1"
            style={{ color: 'var(--jinhong)', border: '1px solid rgba(196,30,58,0.3)' }}
          >
            삭제
          </button>
        </div>
      </div>

      {/* 생년월일 */}
      <p className="text-sm" style={{ color: '#8A7A68' }}>
        {(() => { const [y,m,d] = user.birthDate.split('-'); return `${y}년 ${m}월 ${d}일 (양력)`; })()}
      </p>

      <hr className="divider-traditional" />

      {/* 운세 보기 버튼 */}
      <Link
        href={`/users/${user.id}`}
        className="btn-primary text-center block"
        style={{ textDecoration: 'none' }}
      >
        오늘의 운세 보기 →
      </Link>
    </div>
  );
}
