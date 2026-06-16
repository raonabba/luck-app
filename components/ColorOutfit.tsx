import type { OhaengElement } from '@/lib/types';
import { ELEMENT_COLORS, ELEMENT_NAMES } from '@/lib/ohaeng';

interface ColorOutfitProps {
  element: OhaengElement;
  color: string;
  colorName: string;
  tip: string;
}

export default function ColorOutfit({ element, color, colorName, tip }: ColorOutfitProps) {
  const info = ELEMENT_COLORS[element];

  return (
    <div className="talisman-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎨</span>
        <span className="font-bold text-sm tracking-widest" style={{ color: 'var(--meok)' }}>
          오늘의 행운 색상
        </span>
      </div>

      <hr className="divider-traditional mb-4" />

      <div className="flex items-center gap-5">
        {/* 색상 스와치 */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
            style={{
              background: `radial-gradient(circle at 35% 35%, ${info.secondary}, ${color})`,
              boxShadow: `0 4px 20px ${color}60, inset 0 0 0 3px rgba(255,255,255,0.2)`,
            }}
          >
            <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{info.emoji}</span>
          </div>
          <span
            className="text-sm font-bold"
            style={{ color }}
          >
            {colorName}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: color, background: `${color}15` }}
          >
            {ELEMENT_NAMES[element]}
          </span>
        </div>

        {/* 옷 추천 */}
        <div className="flex-1">
          <p className="text-sm leading-relaxed" style={{ color: '#4A3F35' }}>
            {tip}
          </p>

          {/* 보조 색상 바 */}
          <div className="flex gap-2 mt-3">
            <div
              className="h-6 flex-1 rounded"
              style={{ background: color, opacity: 1 }}
              title={colorName}
            />
            <div
              className="h-6 flex-1 rounded"
              style={{ background: info.secondary, opacity: 0.85 }}
              title="보조 색상"
            />
            <div
              className="h-6 flex-1 rounded"
              style={{ background: `${color}55` }}
              title="연한 색상"
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#8A7A68' }}>
            메인 · 포인트 · 베이스 색상
          </p>
        </div>
      </div>
    </div>
  );
}
