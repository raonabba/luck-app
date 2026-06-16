import type { UserProfile, DailyFortune, FortuneCategory, OhaengElement, AgeGroup } from './types';
import { getDayPillar, getYearPillar } from './ganjy';
import {
  GENERATES,
  OVERCOMES,
  getElementRelationship,
  RELATIONSHIP_MODIFIERS,
  ELEMENT_COLORS,
} from './ohaeng';

// ─── 나이 계산 ───────────────────────────────────────────────
export function calculateAge(birthDate: string, today: string): number {
  const b = new Date(birthDate);
  const t = new Date(today);
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
}

export function getAgeGroup(age: number): AgeGroup {
  if (age < 30) return '20s';
  if (age < 40) return '30s';
  if (age < 50) return '40s';
  return '50s+';
}

export function formatKoreanDate(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${days[date.getDay()]}요일`;
}

// ─── 결정론적 RNG ──────────────────────────────────────────────
function hashCode(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

function makeLCG(seed: number) {
  let s = seed >>> 0;
  return function (max: number): number {
    s = ((s * 1664525 + 1013904223) >>> 0);
    return s % max;
  };
}

// ─── 운세 텍스트 ───────────────────────────────────────────────
const AGE_INTRO: Record<AgeGroup, string> = {
  '20s': '젊은 기운이 넘치는 지금, ',
  '30s': '원숙함이 빛나는 오늘, ',
  '40s': '경험과 지혜가 쌓인 지금, ',
  '50s+': '삶의 깊이가 느껴지는 오늘, ',
};

type TextBank = {
  male: string[];
  female: string[];
};

const FORTUNE_TEXTS: Record<
  'money' | 'success' | 'career' | 'love' | 'health' | 'overall',
  Record<1 | 2 | 3 | 4 | 5, TextBank>
> = {
  money: {
    1: {
      male: [
        '오늘은 지갑을 굳게 닫아두십시오. 예상치 못한 지출이 발생할 수 있습니다.',
        '금전 거래는 삼가는 것이 현명합니다. 충동적인 소비를 경계하십시오.',
        '재물운이 매우 약합니다. 큰 지출이나 투자는 다음으로 미루십시오.',
      ],
      female: [
        '오늘은 지갑을 굳게 닫아두세요. 예상치 못한 지출이 생길 수 있습니다.',
        '금전 거래는 피하는 것이 좋습니다. 충동구매를 조심하세요.',
        '재물운이 매우 약한 날입니다. 큰 지출은 다음으로 미루세요.',
      ],
    },
    2: {
      male: [
        '재물운이 다소 약합니다. 불필요한 지출을 줄이고 절약에 힘쓰십시오.',
        '소소한 금전 손실에 주의하십시오. 분실물이 생길 수 있습니다.',
        '투자보다는 저축에 집중하는 것이 유리한 날입니다.',
      ],
      female: [
        '재물운이 다소 약한 편입니다. 불필요한 지출을 줄여보세요.',
        '소소한 금전 손실에 주의하세요. 분실물이 생길 수 있어요.',
        '투자보다는 저축에 집중하는 것이 좋은 날이에요.',
      ],
    },
    3: {
      male: [
        '평범한 금전운의 날입니다. 무난하게 수입과 지출의 균형을 유지하십시오.',
        '큰 이익은 없으나 손해도 없습니다. 안정적인 하루가 될 것입니다.',
        '소소한 재미가 있는 하루입니다. 작은 행운의 기운이 흐릅니다.',
      ],
      female: [
        '평범한 금전운의 날이에요. 수입과 지출의 균형을 유지하세요.',
        '큰 이익은 없지만 손해도 없어요. 안정적인 하루가 될 거예요.',
        '소소한 재미가 있는 하루예요. 작은 행운의 기운이 흐릅니다.',
      ],
    },
    4: {
      male: [
        '재물운이 좋습니다. 신중한 투자나 거래에 긍정적인 결과가 따를 것입니다.',
        '뜻밖의 수입이 생길 수 있는 좋은 날입니다. 기회를 놓치지 마십시오.',
        '금전적 여유가 생기는 날입니다. 미래를 위한 계획을 세워보십시오.',
      ],
      female: [
        '재물운이 좋아요. 신중한 투자나 거래에 좋은 결과가 따를 거예요.',
        '뜻밖의 수입이 생길 수 있어요. 기회를 놓치지 마세요.',
        '금전적 여유가 생기는 날이에요. 미래를 위한 계획을 세워보세요.',
      ],
    },
    5: {
      male: [
        '재물운이 크게 열립니다! 과감한 투자나 새로운 수익 기회를 잡으십시오.',
        '금전적 행운이 최고조에 달합니다. 중요한 거래를 오늘 진행하십시오.',
        '돈이 들어오는 강한 기운이 감돕니다. 자신감을 갖고 도전하십시오.',
      ],
      female: [
        '재물운이 크게 열립니다! 과감한 투자나 새로운 수익 기회를 잡으세요.',
        '금전적 행운이 최고조에 달해요. 중요한 거래를 오늘 진행해보세요.',
        '돈이 들어오는 강한 기운이 감돌아요. 자신감을 갖고 도전하세요.',
      ],
    },
  },
  success: {
    1: {
      male: [
        '오늘은 성공의 기운이 약합니다. 새로운 시작보다는 현재를 점검하는 날로 삼으십시오.',
        '계획한 일이 뜻대로 되지 않을 수 있습니다. 조급함을 내려놓으십시오.',
        '성과가 더딘 날입니다. 차분히 기다리는 지혜가 필요합니다.',
      ],
      female: [
        '오늘은 성공의 기운이 약해요. 새로운 시작보다는 현재를 점검하세요.',
        '계획한 일이 뜻대로 되지 않을 수 있어요. 조급함을 내려놓으세요.',
        '성과가 더딘 날이에요. 차분히 기다리는 지혜가 필요해요.',
      ],
    },
    2: {
      male: [
        '성공의 기운이 다소 약합니다. 무리한 도전보다 안전한 선택을 하십시오.',
        '작은 실수가 생길 수 있습니다. 꼼꼼하게 확인하는 습관을 들이십시오.',
        '결과보다 과정에 집중하는 하루입니다. 기초를 다지는 데 힘쓰십시오.',
      ],
      female: [
        '성공의 기운이 다소 약해요. 무리한 도전보다 안전한 선택을 해요.',
        '작은 실수가 생길 수 있어요. 꼼꼼하게 확인하는 습관을 들이세요.',
        '결과보다 과정에 집중하는 하루예요. 기초를 다지는 데 힘써요.',
      ],
    },
    3: {
      male: [
        '평범한 성공운의 날입니다. 꾸준함이 빛을 발하는 하루가 될 것입니다.',
        '특별한 성과는 없으나 안정적으로 목표를 향해 나아가는 날입니다.',
        '작은 성취들이 모여 큰 결실을 이루는 과정입니다.',
      ],
      female: [
        '평범한 성공운의 날이에요. 꾸준함이 빛을 발하는 하루가 될 거예요.',
        '특별한 성과는 없지만 안정적으로 목표를 향해 나아가는 날이에요.',
        '작은 성취들이 모여 큰 결실을 이루는 과정이에요.',
      ],
    },
    4: {
      male: [
        '성공의 기운이 강합니다! 오랫동안 준비해온 일을 실행에 옮기십시오.',
        '당신의 능력이 빛을 발하는 날입니다. 자신감 있게 앞으로 나아가십시오.',
        '좋은 기회가 찾아올 수 있습니다. 주변의 변화에 주의를 기울이십시오.',
      ],
      female: [
        '성공의 기운이 강해요! 오랫동안 준비해온 일을 실행에 옮겨보세요.',
        '당신의 능력이 빛을 발하는 날이에요. 자신감 있게 나아가세요.',
        '좋은 기회가 찾아올 수 있어요. 주변의 변화에 주의를 기울이세요.',
      ],
    },
    5: {
      male: [
        '성공의 기운이 최고조입니다! 중요한 결정과 도전을 오늘 실행하십시오.',
        '모든 것이 뜻대로 이루어지는 길운의 날입니다. 과감히 나아가십시오.',
        '하늘이 돕는 날입니다. 오랜 꿈을 향해 힘차게 날아오르십시오.',
      ],
      female: [
        '성공의 기운이 최고조예요! 중요한 결정과 도전을 오늘 실행해보세요.',
        '모든 것이 뜻대로 이루어지는 길운의 날이에요. 과감히 나아가세요.',
        '하늘이 돕는 날이에요. 오랜 꿈을 향해 힘차게 날아오르세요.',
      ],
    },
  },
  career: {
    1: {
      male: [
        '직업운이 약한 날입니다. 직장에서 불필요한 충돌을 피하십시오.',
        '업무에서 어려움이 예상됩니다. 도움을 구하는 것을 두려워하지 마십시오.',
        '상사나 동료와의 관계에 주의가 필요합니다. 언행을 신중히 하십시오.',
      ],
      female: [
        '직업운이 약한 날이에요. 직장에서 불필요한 충돌을 피하세요.',
        '업무에서 어려움이 예상돼요. 도움을 구하는 것을 두려워하지 마세요.',
        '동료와의 관계에 주의가 필요해요. 언행을 신중히 하세요.',
      ],
    },
    2: {
      male: [
        '직업운이 다소 침체된 날입니다. 새로운 시도보다 기존 업무에 집중하십시오.',
        '오해가 생길 수 있는 날입니다. 의사소통을 명확히 하십시오.',
        '결과보다 과정을 다지는 날입니다. 실력을 키우는 데 집중하십시오.',
      ],
      female: [
        '직업운이 다소 침체된 날이에요. 새로운 시도보다 기존 업무에 집중하세요.',
        '오해가 생길 수 있어요. 의사소통을 명확히 하세요.',
        '결과보다 과정을 다지는 날이에요. 실력을 키우는 데 집중하세요.',
      ],
    },
    3: {
      male: [
        '평범하게 업무를 이어가는 날입니다. 성실함이 최고의 무기입니다.',
        '큰 변화는 없으나 꾸준히 성장하고 있는 날입니다.',
        '동료들과 협력하여 좋은 결과를 만들어가는 하루입니다.',
      ],
      female: [
        '평범하게 업무를 이어가는 날이에요. 성실함이 최고의 무기예요.',
        '큰 변화는 없지만 꾸준히 성장하고 있는 날이에요.',
        '동료들과 협력하여 좋은 결과를 만들어가는 하루예요.',
      ],
    },
    4: {
      male: [
        '직업운이 상승합니다! 평소 인정받지 못했던 능력이 빛을 발할 것입니다.',
        '중요한 프로젝트나 협상에서 좋은 결과가 기대됩니다.',
        '리더십을 발휘하기 좋은 날입니다. 팀을 이끄는 데 자신감을 가지십시오.',
      ],
      female: [
        '직업운이 상승해요! 평소 인정받지 못했던 능력이 빛을 발할 거예요.',
        '중요한 프로젝트나 협상에서 좋은 결과가 기대돼요.',
        '리더십을 발휘하기 좋은 날이에요. 팀을 이끄는 데 자신감을 가지세요.',
      ],
    },
    5: {
      male: [
        '직업운이 최상입니다! 승진, 이직, 새로운 기회 모두 긍정적입니다.',
        '당신의 능력이 높게 평가받는 날입니다. 원하는 것을 당당히 요청하십시오.',
        '커리어의 전환점이 될 수 있는 날입니다. 중요한 결정을 내리십시오.',
      ],
      female: [
        '직업운이 최상이에요! 승진, 이직, 새로운 기회 모두 긍정적이에요.',
        '당신의 능력이 높게 평가받는 날이에요. 원하는 것을 당당히 요청하세요.',
        '커리어의 전환점이 될 수 있어요. 중요한 결정을 내려보세요.',
      ],
    },
  },
  love: {
    1: {
      male: [
        '애정운이 약한 날입니다. 연인과의 다툼을 조심하고 양보를 실천하십시오.',
        '감정이 예민해지는 날입니다. 상대방의 말에 과민반응하지 마십시오.',
        '오해가 생기기 쉬운 날입니다. 중요한 대화는 다른 날로 미루십시오.',
      ],
      female: [
        '애정운이 약한 날이에요. 연인과의 다툼을 조심하고 양보를 실천해요.',
        '감정이 예민해지는 날이에요. 상대방의 말에 과민반응하지 마세요.',
        '오해가 생기기 쉬운 날이에요. 중요한 대화는 다른 날로 미루세요.',
      ],
    },
    2: {
      male: [
        '애정운이 다소 흐린 날입니다. 상대방에게 먼저 다가가는 노력이 필요합니다.',
        '작은 갈등이 생길 수 있습니다. 경청하고 이해하는 자세를 유지하십시오.',
        '솔직한 감정 표현이 관계를 회복시킬 것입니다.',
      ],
      female: [
        '애정운이 다소 흐린 날이에요. 상대방에게 먼저 다가가는 노력이 필요해요.',
        '작은 갈등이 생길 수 있어요. 경청하고 이해하는 자세를 유지하세요.',
        '솔직한 감정 표현이 관계를 회복시킬 거예요.',
      ],
    },
    3: {
      male: [
        '평온한 애정운의 날입니다. 소소한 일상을 함께 나누며 정을 쌓으십시오.',
        '특별한 이벤트보다 따뜻한 말 한마디가 더 큰 힘이 되는 날입니다.',
        '편안하고 안정적인 관계가 지속되는 하루입니다.',
      ],
      female: [
        '평온한 애정운의 날이에요. 소소한 일상을 함께 나누며 정을 쌓으세요.',
        '특별한 이벤트보다 따뜻한 말 한마디가 더 큰 힘이 되는 날이에요.',
        '편안하고 안정적인 관계가 지속되는 하루예요.',
      ],
    },
    4: {
      male: [
        '애정운이 상승합니다! 좋아하는 사람에게 마음을 표현할 좋은 기회입니다.',
        '연인과 특별한 시간을 보내기 좋은 날입니다. 로맨틱한 계획을 세우십시오.',
        '설레는 인연이 찾아올 수 있는 날입니다. 새로운 만남을 두려워하지 마십시오.',
      ],
      female: [
        '애정운이 상승해요! 좋아하는 사람에게 마음을 표현할 좋은 기회예요.',
        '연인과 특별한 시간을 보내기 좋은 날이에요. 로맨틱한 계획을 세워보세요.',
        '설레는 인연이 찾아올 수 있는 날이에요. 새로운 만남을 두려워하지 마세요.',
      ],
    },
    5: {
      male: [
        '최고의 애정운입니다! 고백이나 프로포즈, 중요한 감정 표현에 최적의 날입니다.',
        '운명적인 인연이 찾아올 수 있습니다. 모든 만남을 소중히 여기십시오.',
        '사랑의 기운이 넘치는 날입니다. 진심을 다해 사랑을 표현하십시오.',
      ],
      female: [
        '최고의 애정운이에요! 고백이나 프로포즈, 중요한 감정 표현에 최적의 날이에요.',
        '운명적인 인연이 찾아올 수 있어요. 모든 만남을 소중히 여기세요.',
        '사랑의 기운이 넘치는 날이에요. 진심을 다해 사랑을 표현하세요.',
      ],
    },
  },
  health: {
    1: {
      male: [
        '건강운이 약합니다. 무리한 운동이나 야식을 삼가고 충분한 휴식을 취하십시오.',
        '몸의 이상 신호에 주의하십시오. 작은 증상도 가볍게 여기지 마십시오.',
        '피로가 누적되기 쉬운 날입니다. 오늘은 쉬는 것이 최선입니다.',
      ],
      female: [
        '건강운이 약해요. 무리한 운동이나 야식을 삼가고 충분한 휴식을 취하세요.',
        '몸의 이상 신호에 주의하세요. 작은 증상도 가볍게 여기지 마세요.',
        '피로가 누적되기 쉬운 날이에요. 오늘은 쉬는 것이 최선이에요.',
      ],
    },
    2: {
      male: [
        '건강운이 다소 약합니다. 과로를 피하고 균형 잡힌 식사를 하십시오.',
        '스트레스 관리에 신경 쓰십시오. 가벼운 산책이 도움이 됩니다.',
        '수면의 질이 중요한 날입니다. 일찍 잠자리에 드는 것을 권합니다.',
      ],
      female: [
        '건강운이 다소 약해요. 과로를 피하고 균형 잡힌 식사를 하세요.',
        '스트레스 관리에 신경 쓰세요. 가벼운 산책이 도움이 돼요.',
        '수면의 질이 중요한 날이에요. 일찍 잠자리에 드는 것을 권해요.',
      ],
    },
    3: {
      male: [
        '평범한 건강운의 날입니다. 규칙적인 생활 패턴을 유지하십시오.',
        '큰 문제는 없으나 자기 관리를 게을리하지 마십시오.',
        '충분한 수분 섭취와 가벼운 스트레칭으로 활력을 유지하십시오.',
      ],
      female: [
        '평범한 건강운의 날이에요. 규칙적인 생활 패턴을 유지하세요.',
        '큰 문제는 없지만 자기 관리를 게을리하지 마세요.',
        '충분한 수분 섭취와 가벼운 스트레칭으로 활력을 유지하세요.',
      ],
    },
    4: {
      male: [
        '건강운이 좋습니다! 오늘 시작한 운동이나 건강 관리가 큰 효과를 발휘합니다.',
        '몸과 마음이 조화를 이루는 날입니다. 활기차게 하루를 보내십시오.',
        '긍정적인 에너지가 넘치는 날입니다. 새로운 건강 루틴을 시작하기 좋습니다.',
      ],
      female: [
        '건강운이 좋아요! 오늘 시작한 운동이나 건강 관리가 큰 효과를 발휘해요.',
        '몸과 마음이 조화를 이루는 날이에요. 활기차게 하루를 보내세요.',
        '긍정적인 에너지가 넘치는 날이에요. 새로운 건강 루틴을 시작하기 좋아요.',
      ],
    },
    5: {
      male: [
        '건강운이 최상입니다! 몸과 마음 모두 최고의 컨디션으로 하루를 보내십시오.',
        '활력이 넘치는 날입니다. 운동, 여행 등 활동적인 계획을 실행하십시오.',
        '건강의 기운이 충만합니다. 오래 미뤄온 건강 검진이나 활동을 시작하십시오.',
      ],
      female: [
        '건강운이 최상이에요! 몸과 마음 모두 최고의 컨디션으로 하루를 보내세요.',
        '활력이 넘치는 날이에요. 운동, 여행 등 활동적인 계획을 실행해보세요.',
        '건강의 기운이 충만해요. 오래 미뤄온 건강 검진이나 활동을 시작해보세요.',
      ],
    },
  },
  overall: {
    1: {
      male: [
        '오늘은 삼가고 내실을 다지는 날입니다. 작은 것에 감사하며 하루를 보내십시오.',
        '역경도 때로는 축복입니다. 오늘의 어려움이 내일의 발판이 될 것입니다.',
        '모든 일에 신중을 기하는 날입니다. 급하게 움직이면 실수가 생깁니다.',
      ],
      female: [
        '오늘은 삼가고 내실을 다지는 날이에요. 작은 것에 감사하며 보내세요.',
        '역경도 때로는 축복이에요. 오늘의 어려움이 내일의 발판이 될 거예요.',
        '모든 일에 신중을 기하는 날이에요. 급하게 움직이면 실수가 생겨요.',
      ],
    },
    2: {
      male: [
        '오늘은 새로운 도전보다 현재 상황을 정비하는 날로 활용하십시오.',
        '인내가 필요한 날입니다. 때를 기다리는 지혜를 발휘하십시오.',
        '작은 불편함이 있을 수 있으나 큰 문제로 이어지지는 않을 것입니다.',
      ],
      female: [
        '오늘은 새로운 도전보다 현재 상황을 정비하는 날로 활용하세요.',
        '인내가 필요한 날이에요. 때를 기다리는 지혜를 발휘하세요.',
        '작은 불편함이 있을 수 있지만 큰 문제로 이어지지는 않을 거예요.',
      ],
    },
    3: {
      male: [
        '평온하고 안정적인 하루가 될 것입니다. 꾸준함이 가장 큰 힘입니다.',
        '오늘은 평범하지만 소중한 일상이 이어집니다. 감사함을 잃지 마십시오.',
        '하늘의 기운이 균형을 이루는 날입니다. 편안하게 하루를 즐기십시오.',
      ],
      female: [
        '평온하고 안정적인 하루가 될 거예요. 꾸준함이 가장 큰 힘이에요.',
        '오늘은 평범하지만 소중한 일상이 이어져요. 감사함을 잃지 마세요.',
        '하늘의 기운이 균형을 이루는 날이에요. 편안하게 하루를 즐기세요.',
      ],
    },
    4: {
      male: [
        '좋은 기운이 감도는 날입니다! 오늘 시작하는 일은 좋은 결실을 맺을 것입니다.',
        '하늘이 당신을 돕는 날입니다. 자신감을 갖고 앞으로 나아가십시오.',
        '모든 일이 순조롭게 흘러가는 길일입니다. 적극적으로 행동하십시오.',
      ],
      female: [
        '좋은 기운이 감도는 날이에요! 오늘 시작하는 일은 좋은 결실을 맺을 거예요.',
        '하늘이 당신을 돕는 날이에요. 자신감을 갖고 앞으로 나아가세요.',
        '모든 일이 순조롭게 흘러가는 길일이에요. 적극적으로 행동하세요.',
      ],
    },
    5: {
      male: [
        '최고의 길운입니다! 오늘 하루 모든 일이 뜻대로 이루어질 것입니다. 과감히 나아가십시오.',
        '하늘과 땅과 사람의 기운이 모두 당신 편인 날입니다. 큰 뜻을 품으십시오.',
        '천재일우(千載一遇)의 기회가 찾아올 수 있습니다. 눈을 크게 뜨고 하루를 맞이하십시오.',
      ],
      female: [
        '최고의 길운이에요! 오늘 하루 모든 일이 뜻대로 이루어질 거예요. 과감히 나아가세요.',
        '하늘과 땅과 사람의 기운이 모두 당신 편인 날이에요. 큰 뜻을 품으세요.',
        '천재일우(千載一遇)의 기회가 찾아올 수 있어요. 눈을 크게 뜨고 하루를 맞이하세요.',
      ],
    },
  },
};

// ─── 메인 운세 생성 함수 ───────────────────────────────────────
export function generateDailyFortune(user: UserProfile, today: Date): DailyFortune {
  const birthDate = new Date(user.birthDate);
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // 1. 개인 오행 (생년 천간 기준)
  const yearPillar = getYearPillar(birthDate.getFullYear());
  const personalElement: OhaengElement = yearPillar.stemElement;

  // 2. 오늘의 일진
  const dayPillar = getDayPillar(today);
  const todayElement: OhaengElement = dayPillar.stemElement;

  // 3. 행운 오행 = 나의 오행을 생해주는 오행 (사람마다 다름)
  // 수생목, 목생화, 화생토, 토생금, 금생수
  const GENERATED_BY: Record<OhaengElement, OhaengElement> = {
    '목': '수', '화': '목', '토': '화', '금': '토', '수': '금',
  };
  const luckyElement: OhaengElement = GENERATED_BY[personalElement];

  // 4. 결정론적 시드
  const seed = hashCode(user.birthDate + dateStr + user.id);
  const rng = makeLCG(seed);

  // 5. 오행 상성 관계
  const relationship = getElementRelationship(personalElement, todayElement);
  const baseModifier = RELATIONSHIP_MODIFIERS[relationship];

  // 6. 나이대
  const age = calculateAge(user.birthDate, dateStr);
  const ageGroup = getAgeGroup(age);

  // 7. 카테고리별 운세
  const categories: Array<'money' | 'success' | 'career' | 'love' | 'health'> = [
    'money', 'success', 'career', 'love', 'health',
  ];

  const results: Partial<DailyFortune> = {};

  for (const cat of categories) {
    let modifier = baseModifier;
    // 애정운은 지지 오행도 반영
    if (cat === 'love') {
      const branchRel = getElementRelationship(personalElement, dayPillar.branchElement);
      modifier = Math.round((baseModifier + RELATIONSHIP_MODIFIERS[branchRel]) / 2);
    }
    const jitter = rng(3) - 1; // -1, 0, +1
    const rawScore = 3 + modifier + jitter;
    const score = Math.min(5, Math.max(1, rawScore)) as 1 | 2 | 3 | 4 | 5;
    const variant = rng(3);
    const bank = FORTUNE_TEXTS[cat][score][user.gender];
    const baseText = bank[variant % bank.length];
    const text = score >= 3 ? AGE_INTRO[ageGroup] + baseText : baseText;
    (results as Record<string, FortuneCategory>)[cat] = { score, text };
  }

  // 8. 종합운
  const scores = categories.map(c => (results as Record<string, FortuneCategory>)[c].score);
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) as 1 | 2 | 3 | 4 | 5;
  const overallVariant = rng(3);
  const overallBank = FORTUNE_TEXTS.overall[avgScore][user.gender];
  results.overall = {
    score: avgScore,
    text: overallBank[overallVariant % overallBank.length],
  };

  // 9. 행운 색상
  const colorInfo = ELEMENT_COLORS[luckyElement];

  return {
    date: dateStr,
    overall: results.overall!,
    money: (results as Record<string, FortuneCategory>).money,
    success: (results as Record<string, FortuneCategory>).success,
    career: (results as Record<string, FortuneCategory>).career,
    love: (results as Record<string, FortuneCategory>).love,
    health: (results as Record<string, FortuneCategory>).health,
    luckyElement,
    luckyColor: colorInfo.hex,
    luckyColorName: colorInfo.name,
    outfitTip: colorInfo.tip,
    dayPillar: dayPillar.ganjji,
    personalElement,
  };
}

// 오늘 날짜 로컬 기준 Date 반환
export function getTodayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
