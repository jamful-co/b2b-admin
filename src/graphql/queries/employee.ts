import { gql } from 'graphql-request';

/**
 * 임직원 목록 조회 Query
 */
export const GET_EMPLOYEE_LIST = gql`
  query GetEmployeeList($companyId: Int!) {
    getEmployeeList(companyId: $companyId) {
      employees {
        id
        employeeNumber
        name
        phoneNumber
        email
        joinDate
        leaveDate
        status
        jamInfo {
          totalJams
          balanceJams
        }
        membershipInfo {
          startDate
        }
        group {
          groupId
          groupName
        }
      }
      totalCount
    }
  }
`;

