'use client';

import { useState } from 'react';
import type { UserProfile } from '@/lib/types';

interface AddUserFormProps {
  initialValues?: Partial<UserProfile>;
  onSubmit: (data: Omit<UserProfile, 'id' | 'createdAt'>) => void;
  mode?: 'create' | 'edit';
}

export default function AddUserForm({ initialValues, onSubmit, mode = 'create' }: AddUserFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [gender, setGender] = useState<'male' | 'female'>(initialValues?.gender ?? 'male');
  const [birthDate, setBirthDate] = useState(initialValues?.birthDate ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('이름을 입력해주세요.'); return; }
    if (!birthDate)    { setError('생년월일을 입력해주세요.'); return; }

    const birth = new Date(birthDate);
    const now = new Date();
    if (birth >= now) { setError('생년월일은 오늘 이전이어야 합니다.'); return; }

    const age = now.getFullYear() - birth.getFullYear();
    if (age > 120) { setError('올바른 생년월일을 입력해주세요.'); return; }

    onSubmit({ name: name.trim(), gender, birthDate });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 이름 */}
      <div>
        <label className="block text-sm font-bold mb-1.5 tracking-widest" style={{ color: 'var(--meok)' }}>
          이름
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="예) 민우, 연경, 라온"
          maxLength={20}
          className="minhwa-input"
        />
      </div>

      {/* 성별 */}
      <div>
        <label className="block text-sm font-bold mb-1.5 tracking-widest" style={{ color: 'var(--meok)' }}>
          성별
        </label>
        <div className="flex gap-3">
          {(['male', 'female'] as const).map(g => (
            <label
              key={g}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 cursor-pointer transition-all"
              style={{
                borderColor: gender === g ? 'var(--jinhong)' : 'rgba(200,134,10,0.4)',
                background: gender === g ? 'rgba(196,30,58,0.08)' : 'transparent',
                color: gender === g ? 'var(--jinhong)' : 'var(--meok)',
                fontWeight: gender === g ? 700 : 400,
              }}
            >
              <input
                type="radio"
                name="gender"
                value={g}
                checked={gender === g}
                onChange={() => setGender(g)}
                className="sr-only"
              />
              <span>{g === 'male' ? '남성 ♂' : '여성 ♀'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 생년월일 */}
      <div>
        <label className="block text-sm font-bold mb-1.5 tracking-widest" style={{ color: 'var(--meok)' }}>
          생년월일 <span className="text-xs font-normal" style={{ color: '#8A7A68' }}>(양력)</span>
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
          className="minhwa-input"
        />
      </div>

      {/* 에러 */}
      {error && (
        <p className="text-sm text-center py-2 px-3" style={{ color: 'var(--jinhong)', background: 'rgba(196,30,58,0.08)', border: '1px solid rgba(196,30,58,0.2)' }}>
          {error}
        </p>
      )}

      {/* 제출 */}
      <button type="submit" className="btn-primary w-full">
        {mode === 'create' ? '운세 등록하기' : '수정 완료'}
      </button>
    </form>
  );
}
