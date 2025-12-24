import { gql } from 'graphql-request';

/**
 * 임직원 그룹 목록 조회 Query
 */
export const GET_EMPLOYEE_GROUPS = gql`
  query GetEmployeeGroups($companyId: Int!) {
    getEmployeeGroups(companyId: $companyId) {
      groups {
        employeeGroupId
        name
        isActive
        credits
        renewDate
        rolloverPercentage
        renewalPeriodType
        createdAt
        employeeCount
      }
    }
  }
`;

