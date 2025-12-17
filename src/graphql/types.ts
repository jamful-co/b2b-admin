/**
 * GraphQL 타입 정의
 */

/**
 * 사용자 정보
 */
export interface User {
  userId: string;
  companyId: number;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  /**
   * JWT 토큰
   */
  token: string;
  /**
   * 사용자 정보
   */
  user: User;
}

/**
 * 로그인 요청 변수
 */
export interface LoginVariables {
  /**
   * 이메일
   */
  email: string;
  /**
   * 패스워드
   */
  password: string;
}

// ============================================
// 대시보드 관련 타입 정의
// ============================================

/**
 * 회원 통계
 */
export interface MemberStats {
  /**
   * 총 승인된 회원 수
   */
  totalApprovedMembers: number;
  /**
   * 구독 중인 회원 수
   */
  subscribingMembers: number;
  /**
   * 구독률 (%)
   */
  subscriptionRate: number;
}

/**
 * 월간 사용량 데이터
 */
export interface MonthlyUsageData {
  /**
   * 년월 (YYYY-MM 형식)
   */
  yearMonth: string;
  /**
   * 총 사용량
   */
  totalUsage: number;
  /**
   * 활성 직원 수
   */
  activeEmployeeCount: number;
  /**
   * 평균 사용량
   */
  averageUsage: number;
}

/**
 * 월간 잼 사용량
 */
export interface MonthlyJamUsage {
  /**
   * 월별 사용량 배열
   */
  monthlyUsage: MonthlyUsageData[];
  /**
   * 전체 평균 사용량
   */
  overallAverageUsage: number;
  /**
   * 총 사용량
   */
  totalUsage: number;
}

/**
 * 리뷰 데이터
 */
export interface ReviewData {
  /**
   * 리뷰 내용
   */
  review: string;
  /**
   * 평점
   */
  rating: number;
  /**
   * 제공자 이름
   */
  providerName: string;
  /**
   * 생성일시
   */
  createdAt: string;
}

/**
 * 최신 리뷰
 */
export interface RecentReviews {
  /**
   * 리뷰 목록
   */
  reviews: ReviewData[];
  /**
   * 총 리뷰 수
   */
  totalCount: number;
  /**
   * 평균 평점
   */
  averageRating: number;
}

/**
 * 만료 예정 크레딧
 */
export interface ExpiringSoonCredit {
  /**
   * 금액
   */
  amount: number;
  /**
   * 만료일
   */
  expiryDate: string;
  /**
   * 만료까지 남은 일수
   */
  daysUntilExpiry: number;
}

/**
 * B2B 크레딧 상세
 */
export interface B2bCredit {
  /**
   * B2B 크레딧 ID
   */
  b2bCreditId: number;
  /**
   * 이름
   */
  name: string;
  /**
   * 메모
   */
  note?: string;
  /**
   * 총 크레딧
   */
  totalCredits: number;
  /**
   * 잔액
   */
  balance: number;
  /**
   * 만료일
   */
  expiryDate: string;
  /**
   * 생성일
   */
  createdAt: string;
  /**
   * 만료 여부
   */
  isExpired: boolean;
  /**
   * 만료까지 남은 일수
   */
  daysUntilExpiry: number;
}

/**
 * B2B 크레딧 요약
 */
export interface B2bCreditSummary {
  /**
   * 총 충전 금액
   */
  totalCharged: number;
  /**
   * 총 잔액
   */
  totalBalance: number;
  /**
   * 사용률 (%)
   */
  usageRate: number;
  /**
   * 만료 예정 크레딧
   */
  expiringSoon?: ExpiringSoonCredit;
  /**
   * 크레딧 목록
   */
  credits: B2bCredit[];
}

// ============================================
// GraphQL 쿼리 변수 타입
// ============================================

/**
 * 회원 통계 조회 변수
 */
export interface GetMemberStatsVariables {
  companyId: number;
}

/**
 * 월간 잼 사용량 조회 변수
 */
export interface GetMonthlyJamUsageVariables {
  companyId: number;
  months?: number;
}

/**
 * 최신 리뷰 조회 변수
 */
export interface GetRecentReviewsVariables {
  companyId: number;
  days?: number;
  limit?: number;
}

/**
 * B2B 크레딧 요약 조회 변수
 */
export interface GetB2bCreditSummaryVariables {
  companyId: number;
}

// ============================================
// 임직원 관련 타입 정의
// ============================================

/**
 * 잼 정보
 */
export interface JamInfo {
  /**
   * 총 잼
   */
  totalJams: number;
  /**
   * 잔여 잼
   */
  balanceJams: number;
}

/**
 * 멤버십 정보
 */
export interface MembershipInfo {
  /**
   * 시작일
   */
  startDate: string;
}

/**
 * 그룹 정보
 */
export interface EmployeeGroup {
  /**
   * 그룹 ID
   */
  groupId: number;
  /**
   * 그룹명
   */
  groupName: string;
}

/**
 * 임직원 정보
 */
export interface EmployeeData {
  /**
   * 사번
   */
  employeeNumber: string;
  /**
   * 이름
   */
  name: string;
  /**
   * 전화번호
   */
  phoneNumber: string;
  /**
   * 이메일
   */
  email: string;
  /**
   * 입사일
   */
  joinDate: string;
  /**
   * 상태
   */
  status: string;
  /**
   * 잼 정보
   */
  jamInfo: JamInfo;
  /**
   * 멤버십 정보
   */
  membershipInfo: MembershipInfo;
  /**
   * 그룹 정보
   */
  group: EmployeeGroup;
}

/**
 * 임직원 목록 응답
 */
export interface EmployeeListResponse {
  /**
   * 임직원 목록
   */
  employees: EmployeeData[];
  /**
   * 총 개수
   */
  totalCount: number;
}

/**
 * 임직원 목록 조회 변수
 */
export interface GetEmployeeListVariables {
  companyId: number;
}

