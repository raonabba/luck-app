import type { FortuneCategory } from '@/lib/types';
import StarRating from './StarRating';

interface FortuneCategoryProps {
  icon: string;
  label: string;
  category: FortuneCategory;
}

export default function FortuneCategoryCard({ icon, label, category }: FortuneCategoryProps) {
  const { score, text } = category;

  const scoreLabel =
    score === 1 ? '매우 약함' :
    score === 2 ? '약함' :
    score === 3 ? '보통' :
    score === 4 ? '좋음' :
    '매우 좋음';

  const scoreBg =
    score <= 2 ? 'bg-blue-50 border-blue-200' :
    score === 3 ? 'bg-amber-50 border-amber-200' :
    'bg-red-50 border-red-200';

  return (
    <div className="talisman-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-bold text-sm tracking-widest" style={{ color: 'var(--meok)' }}>
            {label}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 border rounded-full ${scoreBg}`}
          style={{ fontFamily: 'Noto Serif KR, serif' }}
        >
          {scoreLabel}
        </span>
      </div>

      <StarRating score={score} size="md" />

      <hr className="divider-traditional my-1" />

      <p className="text-sm leading-relaxed" style={{ color: '#4A3F35' }}>
        {text}
      </p>
    </div>
  );
}
