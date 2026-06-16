export interface UserProfile {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // 'YYYY-MM-DD' solar
  createdAt: string;
}

export type OhaengElement = '목' | '화' | '토' | '금' | '수';
export type AgeGroup = '20s' | '30s' | '40s' | '50s+';

export interface FortuneCategory {
  score: number; // 1–5
  text: string;
}

export interface DailyFortune {
  date: string;
  overall: FortuneCategory;
  money: FortuneCategory;
  success: FortuneCategory;
  career: FortuneCategory;
  love: FortuneCategory;
  health: FortuneCategory;
  luckyElement: OhaengElement;
  luckyColor: string;
  luckyColorName: string;
  outfitTip: string;
  dayPillar: string;
  personalElement: OhaengElement;
}
