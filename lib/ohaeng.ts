import type { OhaengElement } from './types';

// 상생 (generation): 목→화→토→금→수→목
export const GENERATES: Record<OhaengElement, OhaengElement> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목',
};

// 상극 (overcoming): 목→토, 화→금, 토→수, 금→목, 수→화
export const OVERCOMES: Record<OhaengElement, OhaengElement> = {
  '목': '토',
  '화': '금',
  '토': '수',
  '금': '목',
  '수': '화',
};

export type ElementRelationship =
  | 'generates'    // 내가 오늘을 생함 +2
  | 'generated_by' // 오늘이 나를 생함 +1
  | 'same'         // 같은 오행       +1
  | 'overcomes'    // 내가 오늘을 극함  0
  | 'overcome_by'; // 오늘이 나를 극함 -2

export function getElementRelationship(
  personal: OhaengElement,
  day: OhaengElement
): ElementRelationship {
  if (personal === day) return 'same';
  if (GENERATES[personal] === day) return 'generates';
  if (GENERATES[day] === personal) return 'generated_by';
  if (OVERCOMES[personal] === day) return 'overcomes';
  return 'overcome_by';
}

export const RELATIONSHIP_MODIFIERS: Record<ElementRelationship, number> = {
  generates: 2,
  generated_by: 1,
  same: 1,
  overcomes: 0,
  overcome_by: -2,
};

export const ELEMENT_COLORS: Record<
  OhaengElement,
  { hex: string; secondary: string; name: string; emoji: string; tip: string }
> = {
  '목': {
    hex: '#4A7C59',
    secondary: '#8BC34A',
    name: '청록색',
    emoji: '🌿',
    tip: '초록·청록 계열 의상이 행운을 부릅니다. 자연스러운 린넨 소재나 면 소재가 좋습니다.',
  },
  '화': {
    hex: '#C41E3A',
    secondary: '#E8622A',
    name: '진홍색',
    emoji: '🔥',
    tip: '붉은 계열 포인트 아이템으로 적극적인 에너지를 표현하세요. 스카프나 액세서리도 좋습니다.',
  },
  '토': {
    hex: '#C8860A',
    secondary: '#D4A853',
    name: '황토색',
    emoji: '🌾',
    tip: '따뜻한 베이지·황토색 계열이 안정감을 줍니다. 편안한 소재의 여유로운 실루엣을 추천합니다.',
  },
  '금': {
    hex: '#B8960C',
    secondary: '#F5F5F0',
    name: '황금색',
    emoji: '✨',
    tip: '흰색이나 골드 액세서리로 날카로운 직관력을 더하세요. 깔끔하고 정제된 스타일이 좋습니다.',
  },
  '수': {
    hex: '#1B5E8A',
    secondary: '#2C3E50',
    name: '남색',
    emoji: '🌊',
    tip: '깊은 남색이나 검은색 계열로 집중력과 지혜를 높이세요. 모던하고 세련된 스타일을 추천합니다.',
  },
};

export const ELEMENT_NAMES: Record<OhaengElement, string> = {
  '목': '목(木) 나무',
  '화': '화(火) 불',
  '토': '토(土) 흙',
  '금': '금(金) 쇠',
  '수': '수(水) 물',
};
