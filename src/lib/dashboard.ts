/**
 * Dashboard 타입 관련 유틸리티 함수
 */

export type DashboardType = 'subscription' | 'recharge';

// 지원 타입 상수
export const SUPPORT_TYPE_B2B_CREDIT = 'B2B_CREDIT';
export const SUPPORT_TYPE_SUBSCRIPTION_SUBSIDY = 'SUBSCRIPTION_SUBSIDY';
export const SUPPORT_TYPE_PERIODIC_GRANT = 'PERIODIC_GRANT';

/**
 * 로컬 스토리지에서 supportTypes를 가져오는 함수
 */
export const getSupportTypes = (): string[] => {
  const supportTypesStr = localStorage.getItem('supportTypes');
  if (supportTypesStr) {
    try {
      return JSON.parse(supportTypesStr) as string[];
    } catch (error) {
      console.error('Failed to parse supportTypes:', error);
      return [];
    }
  }
  return [];
};

/**
 * supportTypes를 로컬 스토리지에 저장하는 함수
 */
export const setSupportTypes = (supportTypes: string[]): void => {
  localStorage.setItem('supportTypes', JSON.stringify(supportTypes));
};

/**
 * supportTypes를 로컬 스토리지에서 제거하는 함수
 */
export const clearSupportTypes = (): void => {
  localStorage.removeItem('supportTypes');
};

/**
 * supportTypes에 B2B_CREDIT이 포함되어 있는지 확인
 */
export const hasB2bCreditSupport = (): boolean => {
  const supportTypes = getSupportTypes();
  return supportTypes.includes(SUPPORT_TYPE_B2B_CREDIT);
};

/**
 * supportTypes에 구독형이 포함되어 있는지 확인
 * (SUBSCRIPTION_SUBSIDY 또는 PERIODIC_GRANT가 있으면 구독형으로 간주)
 */
export const hasSubscriptionSupport = (): boolean => {
  const supportTypes = getSupportTypes();
  return supportTypes.includes(SUPPORT_TYPE_SUBSCRIPTION_SUBSIDY) ||
         supportTypes.includes(SUPPORT_TYPE_PERIODIC_GRANT);
};

/**
 * 사용자가 두 가지 타입을 모두 지원하는지 확인
 */
export const hasBothDashboardTypes = (): boolean => {
  return hasB2bCreditSupport() && hasSubscriptionSupport();
};

/**
 * supportTypes를 기반으로 기본 대시보드 타입을 결정하는 함수
 *
 * 로직:
 * 1. SUBSCRIPTION_SUBSIDY 또는 PERIODIC_GRANT가 있으면 -> 'subscription' (구독형)
 * 2. B2B_CREDIT만 있으면 -> 'recharge' (충전형)
 * 3. 둘 다 있으면 -> 'subscription' (구독형 우선)
 */
export const getDefaultDashboardType = (): DashboardType => {
  const supportTypes = getSupportTypes();

  if (supportTypes.length === 0) {
    // supportTypes가 없으면 기본값으로 구독형 반환
    return 'subscription';
  }

  const hasCredit = supportTypes.includes(SUPPORT_TYPE_B2B_CREDIT);
  const hasSubscription = supportTypes.includes(SUPPORT_TYPE_SUBSCRIPTION_SUBSIDY) ||
                          supportTypes.includes(SUPPORT_TYPE_PERIODIC_GRANT);

  // 구독형 타입이 있으면 구독형 우선 (둘 다 있어도 구독형)
  if (hasSubscription) {
    return 'subscription';
  }

  // B2B_CREDIT만 있으면 충전형
  if (hasCredit) {
    return 'recharge';
  }

  // 그 외의 경우 구독형 (기본값)
  return 'subscription';
};

/**
 * 현재 대시보드 타입이 유효한지 확인
 * (사용자의 supportTypes에 해당 타입이 포함되어 있는지 확인)
 */
export const isValidDashboardType = (dashboardType: DashboardType): boolean => {
  const supportTypes = getSupportTypes();

  if (supportTypes.length === 0) {
    // supportTypes가 없으면 모든 타입 허용
    return true;
  }

  if (dashboardType === 'recharge') {
    // 충전형: B2B_CREDIT이 있어야 함
    return supportTypes.includes(SUPPORT_TYPE_B2B_CREDIT);
  } else {
    // 구독형: SUBSCRIPTION_SUBSIDY 또는 PERIODIC_GRANT가 있어야 함
    return supportTypes.includes(SUPPORT_TYPE_SUBSCRIPTION_SUBSIDY) ||
           supportTypes.includes(SUPPORT_TYPE_PERIODIC_GRANT);
  }
};

