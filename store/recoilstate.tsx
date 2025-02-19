import { atom } from 'recoil';

// 리패치를 트리거하는 상태 (숫자형)
export const refreshTriggerState = atom<number>({
  key: 'refreshTriggerState', // 고유한 키
  default: 0, // 기본값 (초기값은 0)
});
