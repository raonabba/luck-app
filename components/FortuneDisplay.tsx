import type { DailyFortune, UserProfile } from '@/lib/types';
import { ELEMENT_NAMES } from '@/lib/ohaeng';
import { formatKoreanDate } from '@/lib/fortune';
import StarRating from './StarRating';
import FortuneCategoryCard from './FortuneCategory';
import ColorOutfit from './ColorOutfit';
import Link from 'next/link';

interface FortuneDisplayProps {
  fortune: DailyFortune;
  user: UserProfile;
}

export default function FortuneDisplay({ fortune, user }: FortuneDisplayProps) {
  const today = new Date(fortune.date + 'T00:00:00');
  const koreanDate = formatKoreanDate(today);

  const categories = [
    { key: 'money',   icon: '💰', label: '금전운' },
    { key: 'success', icon: '🌟', label: '성공운' },
    { key: 'career',  icon: '💼', label: '직업운' },
    { key: 'love',    icon: '❤️', label: '애정운' },
    { key: 'health',  icon: '🌿', label: '건강운' },
  ] as const;

  return (
    <div className="min-h-screen px-4 py-6 page-enter">
      <div className="max-w-xl mx-auto space-y-4">

        {/* 뒤로가기 */}
        <Link href="/" className="inline-flex items-center gap-1 text-sm" style={{ color: 'var(--hwangto)' }}>
          ← 목록으로
        </Link>

        {/* 헤더 카드 */}
        <div className="talisman-card p-5 text-center">
          <p className="text-xs tracking-widest mb-1" style={{ color: 'var(--hwangto)' }}>
            ✦ 오늘의 운세 ✦
          </p>
          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--meok)' }}>
            {user.name}님
          </h1>
          <p className="text-sm" style={{ color: '#8A7A68' }}>{koreanDate}</p>

          <hr className="divider-traditional my-3" />

          {/* 오행 정보 */}
          <div className="flex justify-center gap-3 text-sm flex-wrap">
            <span
              className="px-3 py-1 rounded-full border text-xs"
              style={{
                borderColor: 'var(--hwangto)',
                color: 'var(--hwangto)',
                background: 'rgba(200,134,10,0.08)',
              }}
            >
              일진 · {fortune.dayPillar}
            </span>
            <span
              className="px-3 py-1 rounded-full border text-xs"
              style={{
                borderColor: 'var(--dancheong)',
                color: 'var(--dancheong)',
                background: 'rgba(27,94,138,0.08)',
              }}
            >
              나의 오행 · {ELEMENT_NAMES[fortune.personalElement]}
            </span>
          </div>

          {/* 종합운 */}
          <div className="mt-4 p-4 rounded" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)' }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--gold)' }}>
              종합운
            </p>
            <StarRating score={fortune.overall.score} size="lg" />
            <p className="text-sm mt-2 leading-relaxed" style={{ color: '#4A3F35' }}>
              {fortune.overall.text}
            </p>
          </div>
        </div>

        {/* 카테고리 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(({ key, icon, label }) => (
            <FortuneCategoryCard
              key={key}
              icon={icon}
              label={label}
              category={fortune[key]}
            />
          ))}
        </div>

        {/* 행운 색상 & 옷 추천 */}
        <ColorOutfit
          element={fortune.luckyElement}
          color={fortune.luckyColor}
          colorName={fortune.luckyColorName}
          tip={fortune.outfitTip}
        />

        {/* 하단 장식 */}
        <div className="text-center py-4">
          <p className="text-xs tracking-widest" style={{ color: '#C8A87A' }}>
            ✦ &nbsp; 운 명 은 &nbsp; 스 스 로 &nbsp; 개 척 하 는 &nbsp; 것 &nbsp; ✦
          </p>
        </div>

      </div>
    </div>
  );
}
