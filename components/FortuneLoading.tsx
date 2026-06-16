'use client';

import { useState, useEffect, useCallback } from 'react';

const LOADING_MESSAGES = [
  '천기(天氣)를 살피고 있습니다...',
  '사주팔자(四柱八字)를 분석하고 있습니다...',
  '오행(五行)의 기운을 읽고 있습니다...',
  '천간지지(天干地支)를 대조하고 있습니다...',
  '오늘의 일진(日辰)을 확인하고 있습니다...',
  '운명의 실타래를 풀어가고 있습니다...',
  '오늘의 운세가 펼쳐지고 있습니다...',
];

interface FortuneLoadingProps {
  name: string;
  onComplete: () => void;
}

export default function FortuneLoading({ name, onComplete }: FortuneLoadingProps) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  const complete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let current = 0;
    const total = LOADING_MESSAGES.length;

    // 진행 바 업데이트
    setProgress(Math.round(((current + 1) / total) * 100));

    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        current++;
        if (current >= total) {
          clearInterval(interval);
          complete();
        } else {
          setMsgIndex(current);
          setProgress(Math.round(((current + 1) / total) * 100));
          setVisible(true);
        }
      }, 350);
    }, 850);

    return () => clearInterval(interval);
  }, [complete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 page-enter">
      {/* 히어로 이미지 */}
      <div className="w-full max-w-sm mb-6">
        <img
          src="/images/main-hero.png"
          alt="오늘의 운세"
          className="w-full hero-pulse"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(44,44,44,0.2))' }}
        />
      </div>

      {/* 이름 */}
      <p
        className="text-sm tracking-widest mb-6"
        style={{ color: 'var(--hwangto)', fontWeight: 600 }}
      >
        {name}님의 운세를 읽는 중
      </p>

      {/* 로딩 메시지 */}
      <div className="h-8 flex items-center justify-center mb-6">
        <p
          key={msgIndex}
          className="loading-message text-center text-base font-medium"
          style={{
            color: 'var(--meok)',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.35s ease',
          }}
        >
          {LOADING_MESSAGES[msgIndex]}
        </p>
      </div>

      {/* 진행 바 */}
      <div className="w-64">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p
          className="text-xs text-center mt-2"
          style={{ color: '#A89878' }}
        >
          {progress}%
        </p>
      </div>

      {/* 장식 */}
      <p
        className="mt-8 text-xs tracking-widest"
        style={{ color: '#C8A87A' }}
      >
        ✦ &nbsp; 천 지 인 의 &nbsp; 기 운 &nbsp; ✦
      </p>
    </div>
  );
}
