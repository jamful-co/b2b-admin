import { gql } from 'graphql-request';

/**
 * 임직원 상태 변경 - 승인 (그룹 할당 없음)
 */
export const APPROVE_EMPLOYEE = gql`
  mutation ApproveEmployee($input: UpdateEmployeeStatusInputDto!) {
    updateEmployeeStatus(input: $input) {
      success
      message
      employeeId
    }
  }
`;

/**
 * 임직원 상태 변경 - 승인 + 그룹 할당 + 잼 지급
 */
export const APPROVE_EMPLOYEE_WITH_GROUP = gql`
  mutation ApproveEmployeeWithGroup($input: UpdateEmployeeStatusInputDto!) {
    updateEmployeeStatus(input: $input) {
      success
      message
      employeeId
    }
  }
`;

/**
 * 임직원 상태 변경 - 거절
 */
export const REJECT_EMPLOYEE = gql`
  mutation RejectEmployee($input: UpdateEmployeeStatusInputDto!) {
    updateEmployeeStatus(input: $input) {
      success
      message
      employeeId
    }
  }
`;

/**
 * 임직원 상태 변경 - 퇴사 예정
 */
export const SCHEDULE_EMPLOYEE_LEAVE = gql`
  mutation ScheduleEmployeeLeave($input: UpdateEmployeeStatusInputDto!) {
    updateEmployeeStatus(input: $input) {
      success
      message
      employeeId
    }
  }
`;

/**
 * 임직원 상태 변경 - 퇴사 처리
 */
export const PROCESS_EMPLOYEE_LEAVE = gql`
  mutation ProcessEmployeeLeave($input: UpdateEmployeeStatusInputDto!) {
    updateEmployeeStatus(input: $input) {
      success
      message
      employeeId
    }
  }
`;

// ============================================
// 임직원 그룹 관련 Mutations
// ============================================

/**
 * 임직원 그룹 생성
 */
export const CREATE_EMPLOYEE_GROUP = gql`
  mutation CreateEmployeeGroup($input: CreateEmployeeGroupInput!) {
    createEmployeeGroup(input: $input) {
      employeeGroupId
      companyId
      name
      isActive
      credits
      renewDate
      rolloverPercentage
      renewalPeriodType
      createdAt
      updatedAt
    }
  }
`;

/**
 * 임직원 그룹 수정
 */
export const UPDATE_EMPLOYEE_GROUP = gql`
  mutation UpdateEmployeeGroup($input: UpdateEmployeeGroupInput!) {
    updateEmployeeGroup(input: $input) {
      employeeGroupId
      companyId
      name
      isActive
      credits
      renewDate
      rolloverPercentage
      renewalPeriodType
      createdAt
      updatedAt
    }
  }
`;

/**
 * 임직원을 그룹에 할당
 */
export const ASSIGN_EMPLOYEE_TO_GROUP = gql`
  mutation AssignEmployeeToGroup($input: AssignEmployeeToGroupInput!) {
    assignEmployeeToGroup(input: $input)
  }
`;

/**
 * 임직원 그룹 해제
 */
export const UNASSIGN_EMPLOYEE_FROM_GROUP = gql`
  mutation UnassignEmployeeFromGroup($input: UnassignEmployeeFromGroupInput!) {
    unassignEmployeeFromGroup(input: $input)
  }
`;

/**
 * 임직원 그룹 삭제
 */
export const DELETE_EMPLOYEE_GROUP = gql`
  mutation DeleteEmployeeGroup($input: DeleteEmployeeGroupInput!) {
    deleteEmployeeGroup(input: $input)
  }
`;

// ============================================
// 크레딧 할당 관련 Mutations
// ============================================

/**
 * 크레딧 할당
 */
export const ALLOCATE_CREDITS = gql`
  mutation AllocateCredits($input: AllocateCreditsInputDto!) {
    allocateCredits(input: $input) {
      success
      successCount
      failedCount
      results {
        userId
        success
        error
      }
    }
  }
`;
