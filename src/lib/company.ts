import storage from '@/lib/storage';

/**
 * 회사 ID 관련 유틸리티 함수
 */

/**
 * 현재 회사 ID를 가져오는 함수
 *
 * 우선순위:
 * 1. 로컬 스토리지 (로그인 시 저장된 companyId)
 * 2. 환경 변수 (VITE_COMPANY_ID)
 * 3. 기본값 (1)
 */
export const getCompanyId = (): number => {
  // 1. 로컬 스토리지에서 companyId 가져오기 (최우선)
  const storedCompanyId = storage.get<string>('companyId');
  if (storedCompanyId) {
    const parsed = parseInt(storedCompanyId, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // 2. 환경 변수에서 companyId 가져오기
  const envCompanyId = import.meta.env.VITE_COMPANY_ID;
  if (envCompanyId) {
    const parsed = parseInt(envCompanyId, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // 3. 기본값 반환
  return 1;
};

/**
 * 회사 ID를 로컬 스토리지에 저장하는 함수
 *
 * @param companyId - 저장할 회사 ID
 */
export const setCompanyId = (companyId: number): void => {
  storage.set('companyId', companyId.toString());
};

/**
 * 회사 ID를 로컬 스토리지에서 제거하는 함수
 */
export const clearCompanyId = (): void => {
  storage.remove('companyId');
};

