'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserById, updateUser } from '@/lib/storage';
import type { UserProfile } from '@/lib/types';
import AddUserForm from '@/components/AddUserForm';

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const found = getUserById(id);
    if (!found) { router.push('/'); return; }
    setUser(found);
  }, [id, router]);

  function handleSubmit(data: Omit<UserProfile, 'id' | 'createdAt'>) {
    updateUser(id, data);
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-md mx-auto">

        <Link href="/" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: 'var(--hwangto)' }}>
          ← 돌아가기
        </Link>

        <div className="talisman-card p-6">
          <div className="text-center mb-6">
            <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--hwangto)' }}>
              ✦ 정보 수정 ✦
            </p>
            <h1 className="text-xl font-black" style={{ color: 'var(--meok)' }}>
              {user.name}님 정보 수정
            </h1>
          </div>

          <hr className="divider-traditional mb-5" />

          <AddUserForm initialValues={user} onSubmit={handleSubmit} mode="edit" />
        </div>

      </div>
    </div>
  );
}
