import type { OhaengElement } from './types';

export const HEAVENLY_STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const EARTHLY_BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

export const STEM_ELEMENTS: OhaengElement[] = [
  '목', '목', '화', '화', '토', '토', '금', '금', '수', '수',
];

export const BRANCH_ELEMENTS: OhaengElement[] = [
  '수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수',
];

export interface GanjiEntry {
  ganjji: string;
  stem: string;
  branch: string;
  stemElement: OhaengElement;
  branchElement: OhaengElement;
  index: number;
}

export const GANJI_60: GanjiEntry[] = Array.from({ length: 60 }, (_, i) => ({
  ganjji: HEAVENLY_STEMS[i % 10] + EARTHLY_BRANCHES[i % 12],
  stem: HEAVENLY_STEMS[i % 10],
  branch: EARTHLY_BRANCHES[i % 12],
  stemElement: STEM_ELEMENTS[i % 10],
  branchElement: BRANCH_ELEMENTS[i % 12],
  index: i,
}));

// Reference: January 1, 1900 = 경자일 (index 36)
const REFERENCE_TIME = new Date('1900-01-01T00:00:00Z').getTime();
const REFERENCE_INDEX = 36;

export function getDayPillarIndex(date: Date): number {
  const utcDate = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((utcDate - REFERENCE_TIME) / 86400000);
  return ((days + REFERENCE_INDEX) % 60 + 60) % 60;
}

export function getDayPillar(date: Date): GanjiEntry {
  return GANJI_60[getDayPillarIndex(date)];
}

// Reference: 1900 = 경자년 (index 36)
export function getYearPillarIndex(year: number): number {
  return ((36 + (year - 1900)) % 60 + 60) % 60;
}

export function getYearPillar(year: number): GanjiEntry {
  return GANJI_60[getYearPillarIndex(year)];
}
