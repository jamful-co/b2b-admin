/**
 * 로컬 스토리지 유틸리티
 * 
 * - 앱별 prefix 자동 추가 (jamful_b2b_)
 * - 타입 안전성 보장
 * - JSON 자동 직렬화/역직렬화
 * - 에러 처리 통합
 */

// 앱 prefix - 다른 앱과의 충돌 방지
const STORAGE_PREFIX = 'jamful_b2b_';

// 스토리지 키 타입 정의
export type StorageKey = 
  | 'token'
  | 'user'
  | 'isAuthenticated'
  | 'companyId'
  | 'supportTypes';

/**
 * prefix가 추가된 실제 스토리지 키를 반환
 */
const getPrefixedKey = (key: StorageKey): string => {
  return `${STORAGE_PREFIX}${key}`;
};

/**
 * 로컬 스토리지에 값을 저장
 * 객체/배열은 자동으로 JSON.stringify 처리
 * 
 * @param key - 저장할 키
 * @param value - 저장할 값 (string, number, boolean, object, array)
 */
export const set = <T>(key: StorageKey, value: T): void => {
  try {
    const prefixedKey = getPrefixedKey(key);
    const serializedValue = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    localStorage.setItem(prefixedKey, serializedValue);
  } catch (error) {
    console.error(`Failed to set storage key "${key}":`, error);
  }
};

/**
 * 로컬 스토리지에서 값을 가져옴
 * JSON 문자열은 자동으로 파싱
 * 
 * @param key - 가져올 키
 * @returns 저장된 값 또는 null
 */
export const get = <T = string>(key: StorageKey): T | null => {
  try {
    const prefixedKey = getPrefixedKey(key);
    const value = localStorage.getItem(prefixedKey);
    
    if (value === null) {
      return null;
    }

    // JSON 파싱 시도
    try {
      return JSON.parse(value) as T;
    } catch {
      // JSON이 아닌 경우 원본 문자열 반환
      return value as T;
    }
  } catch (error) {
    console.error(`Failed to get storage key "${key}":`, error);
    return null;
  }
};

/**
 * 로컬 스토리지에서 값을 제거
 * 
 * @param key - 제거할 키
 */
export const remove = (key: StorageKey): void => {
  try {
    const prefixedKey = getPrefixedKey(key);
    localStorage.removeItem(prefixedKey);
  } catch (error) {
    console.error(`Failed to remove storage key "${key}":`, error);
  }
};

/**
 * 앱의 모든 로컬 스토리지 데이터를 제거
 * prefix가 있는 키만 제거
 */
export const clear = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    // prefix가 있는 모든 키 찾기
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    // 찾은 키들 제거
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
};

/**
 * 특정 키가 존재하는지 확인
 * 
 * @param key - 확인할 키
 * @returns 존재 여부
 */
export const has = (key: StorageKey): boolean => {
  try {
    const prefixedKey = getPrefixedKey(key);
    return localStorage.getItem(prefixedKey) !== null;
  } catch (error) {
    console.error(`Failed to check storage key "${key}":`, error);
    return false;
  }
};

// 기본 export
export const storage = {
  set,
  get,
  remove,
  clear,
  has,
};

export default storage;

