/**
 * GraphQL 타입 정의
 */

/**
 * 사용자 정보
 */
export interface User {
  userId: string;
  email: string;
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
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 지원하는 멤버십 타입 목록
   */
  supportTypes: string[];
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
 * 임직원 정보 (GraphQL API 응답)
 */
export interface EmployeeData {
  /**
   * 임직원 ID (UUID)
   */
  id: string;
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
   * 퇴사일
   */
  leaveDate?: string;
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
  /**
   * 유저 ID
   */
  userId?: number;
}

/**
 * 테이블 표시용 임직원 정보
 * GraphQL EmployeeData를 테이블 컴포넌트에서 사용하기 쉬운 형태로 변환한 타입
 */
export interface EmployeeTableData {
  /**
   * 임직원 ID (UUID)
   */
  id: string;
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
   * 퇴사일
   */
  leaveDate?: string;
  /**
   * 멤버십 개시일
   */
  membershipStartDate?: string;
  /**
   * 재직상태
   */
  status: string;
  /**
   * 그룹명
   */
  groupName: string;
  /**
   * 그룹 ID
   */
  groupId?: number;
  /**
   * 잼 잔여량
   */
  balanceJams: number;
  /**
   * 잼 총량
   */
  totalJams: number;
  /**
   * 유저 ID
   */
  userId?: number;  
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

// ============================================
// 임직원 상태 변경 관련 타입 정의
// ============================================

/**
 * 임직원 상태 액션
 */
export enum EmployeeStatusAction {
  /** 승인 */
  APPROVE = 'APPROVE',
  /** 거절 */
  REJECT = 'REJECT',
  /** 퇴사 예정 */
  SCHEDULE_LEAVE = 'SCHEDULE_LEAVE',
  /** 퇴사 처리 */
  LEAVE = 'LEAVE',
}

/**
 * 승인자 유형
 */
export enum ApproverType {
  /** 관리자 */
  ADMIN = 'COMPANY_ADMIN',
  /** 시스템 */
  SYSTEM = 'SYSTEM',
}

/**
 * 임직원 상태 변경 입력
 */
export interface UpdateEmployeeStatusInput {
  /**
   * 회사 ID
   */
  companyId: number;  
  /**
   * 임직원 ID (UUID)
   */
  id: string;
  /**
   * 수행할 액션
   */
  action: EmployeeStatusAction;
  /**
   * 승인자 유형
   */
  approverType: ApproverType;
  /**
   * 승인자 ID
   */
  approverId?: number;
  /**
   * 거절 사유 (REJECT 액션 시 필수)
   */
  rejectionReason?: string;
  /**
   * 퇴사 날짜 (SCHEDULE_LEAVE, LEAVE 액션 시 필수, YYYY-MM-DD)
   */
  leaveDate?: string;
  /**
   * 그룹 ID (APPROVE 시 함께 그룹 할당)
   */
  employeeGroupId?: number;
}

/**
 * 임직원 상태 변경 응답
 */
export interface UpdateEmployeeStatusResponse {
  /**
   * 성공 여부
   */
  success: boolean;
  /**
   * 메시지
   */
  message: string;
  /**
   * 임직원 ID
   */
  employeeId: string;
}

/**
 * 임직원 상태 변경 변수
 */
export interface UpdateEmployeeStatusVariables {
  input: UpdateEmployeeStatusInput;
}

// ============================================
// 임직원 그룹 관련 타입 정의
// ============================================

/**
 * 갱신 주기 타입
 */
export enum RenewalPeriodType {
  /** 월 단위 */
  MONTHLY = 'MONTHLY',
  /** 분기 단위 */
  QUARTERLY = 'QUARTERLY',
  /** 연 단위 */
  YEARLY = 'YEARLY',
}

/**
 * 임직원 그룹 데이터
 */
export interface EmployeeGroupData {
  /**
   * 그룹 ID
   */
  employeeGroupId: number;
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 그룹명
   */
  name: string;
  /**
   * 활성화 여부
   */
  isActive: boolean;
  /**
   * 월간 지급 크레딧
   */
  credits: number;
  /**
   * 크레딧 갱신일 (0은 월말)
   */
  renewDate: number;
  /**
   * 크레딧 이월 비율 (0-100)
   */
  rolloverPercentage: number;
  /**
   * 갱신 주기 타입
   */
  renewalPeriodType: RenewalPeriodType;
  /**
   * 그룹 인원 수
   */
  employeeCount: number;
  /**
   * 생성일
   */
  createdAt: string;
  /**
   * 수정일
   */
  updatedAt: string;
}

/**
 * 임직원 그룹 생성 입력
 */
export interface CreateEmployeeGroupInput {
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 그룹명
   */
  name: string;
  /**
   * 월간 지급 크레딧
   */
  credits: number;
  /**
   * 크레딧 갱신일 (0은 월말)
   */
  renewDate: number;
  /**
   * 크레딧 이월 비율 (0-100)
   */
  rolloverPercentage?: number;
  /**
   * 갱신 주기 타입
   */
  renewalPeriodType?: RenewalPeriodType;
}

/**
 * 임직원 그룹 생성 변수
 */
export interface CreateEmployeeGroupVariables {
  input: CreateEmployeeGroupInput;
}

/**
 * 임직원 그룹 수정 입력
 */
export interface UpdateEmployeeGroupInput {
  /**
   * 그룹 ID
   */
  employeeGroupId: number;
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 그룹명
   */
  name?: string;
  /**
   * 월간 지급 크레딧
   */
  credits?: number;
  /**
   * 크레딧 갱신일 (0은 월말)
   */
  renewDate?: number;
  /**
   * 크레딧 이월 비율 (0-100)
   */
  rolloverPercentage?: number;
  /**
   * 갱신 주기 타입
   */
  renewalPeriodType?: RenewalPeriodType;
  /**
   * 활성화 여부
   */
  isActive?: boolean;
}

/**
 * 임직원 그룹 수정 변수
 */
export interface UpdateEmployeeGroupVariables {
  input: UpdateEmployeeGroupInput;
}

/**
 * 임직원을 그룹에 할당 입력
 */
export interface AssignEmployeeToGroupInput {
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 임직원 ID (B2bEmployee.id)
   */
  employeeId: string;
  /**
   * 그룹 ID
   */
  employeeGroupId: number;
}

/**
 * 임직원을 그룹에 할당 변수
 */
export interface AssignEmployeeToGroupVariables {
  input: AssignEmployeeToGroupInput;
}

/**
 * 임직원 그룹 해제 입력
 */
export interface UnassignEmployeeFromGroupInput {
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 임직원 ID (B2bEmployee.id)
   */
  employeeId: string;
}

/**
 * 임직원 그룹 해제 변수
 */
export interface UnassignEmployeeFromGroupVariables {
  input: UnassignEmployeeFromGroupInput;
}

/**
 * 임직원 그룹 삭제 입력
 */
export interface DeleteEmployeeGroupInput {
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 그룹 ID
   */
  employeeGroupId: number;
}

/**
 * 임직원 그룹 삭제 변수
 */
export interface DeleteEmployeeGroupVariables {
  input: DeleteEmployeeGroupInput;
}

/**
 * 임직원 그룹 목록 응답
 */
export interface EmployeeGroupsResponse {
  /**
   * 그룹 목록
   */
  groups: EmployeeGroupData[];
  /**
   * 총 개수
   */
  totalCount: number;
}

/**
 * 임직원 그룹 목록 조회 변수
 */
export interface GetEmployeeGroupsVariables {
  companyId: number;
}

// ============================================
// 크레딧 할당 관련 타입 정의
// ============================================

/**
 * 크레딧 할당 입력
 */
export interface AllocateCreditsInput {
  /**
   * 회사 ID
   */
  companyId: number;
  /**
   * 할당 대상 유저 ID 목록
   */
  userIds: number[];
  /**
   * 유저당 할당할 크레딧 수
   */
  creditsPerUser: number;
  /**
   * 크레딧 만료일
   */
  expireDate: Date;
  /**
   * 롤오버 비율 (0-100)
   */
  rolloverPercentage?: number;
  /**
   * 설명
   */
  description?: string;
  /**
   * 할당 실행자 유저 ID
   */
  initiatedByUserId?: number;
}

/**
 * 개별 할당 결과
 */
export interface AllocationResultItem {
  /**
   * 유저 ID
   */
  userId: number;
  /**
   * 성공 여부
   */
  success: boolean;
  /**
   * 실패 사유
   */
  error?: string;
}

/**
 * 크레딧 할당 출력
 */
export interface AllocateCreditsOutput {
  /**
   * 전체 성공 여부
   */
  success: boolean;
  /**
   * 성공 건수
   */
  successCount: number;
  /**
   * 실패 건수
   */
  failedCount: number;
  /**
   * 개별 결과 목록
   */
  results: AllocationResultItem[];
}

/**
 * 크레딧 할당 변수
 */
export interface AllocateCreditsVariables {
  input: AllocateCreditsInput;
}
