import type { Metadata } from 'next';
import { Noto_Serif_KR } from 'next/font/google';
import './globals.css';

const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '오늘의 운세 — 사주팔자로 보는 하루',
  description: '이름과 생년월일을 입력하고 오늘의 운세와 행운 색상 코디를 확인하세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSerifKR.className}>
      <body>
        <div id="app-root" className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
