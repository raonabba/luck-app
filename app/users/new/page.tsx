'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddUserForm from '@/components/AddUserForm';
import { createUser } from '@/lib/storage';
import type { UserProfile } from '@/lib/types';

export default function NewUserPage() {
  const router = useRouter();

  function handleSubmit(data: Omit<UserProfile, 'id' | 'createdAt'>) {
    createUser(data);
    router.push('/');
  }

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-md mx-auto">

        <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: 'var(--hwangto)' }}>
          ← 돌아가기
        </Link>

        <div className="talisman-card p-6">
          <div className="text-center mb-6">
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--hwangto)' }}>
              ✦ 새 사람 등록 ✦
            </p>
            <h1 className="text-xl font-black" style={{ color: 'var(--meok)' }}>
              운세 정보 입력
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8A7A68' }}>
              생년월일로 사주팔자를 분석합니다
            </p>
          </div>

          <hr className="divider-traditional mb-5" />

          <AddUserForm onSubmit={handleSubmit} mode="create" />
        </div>

        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: '#C8A87A' }}>
            ✦ &nbsp; 입력한 정보는 이 기기에만 저장됩니다 &nbsp; ✦
          </p>
        </div>

      </div>
    </div>
  );
}
