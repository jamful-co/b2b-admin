import { EmployeeData, EmployeeTableData } from '@/graphql/types';

/**
 * GraphQL EmployeeData를 테이블 표시용 EmployeeTableData로 변환
 *
 * @param employee - GraphQL API에서 받은 임직원 데이터
 * @returns 테이블 컴포넌트에서 사용할 수 있는 형태로 변환된 데이터
 *
 * @example
 * ```typescript
 * const tableData = mapEmployeeToTableData(graphqlEmployee);
 * ```
 */
export function mapEmployeeToTableData(employee: EmployeeData): EmployeeTableData {
  return {
    id: employee.id,
    employeeNumber: employee.employeeNumber,
    name: employee.name,
    phoneNumber: employee.phoneNumber,
    email: employee.email,
    joinDate: employee.joinDate,
    leaveDate: employee.leaveDate,
    membershipStartDate: employee.membershipInfo?.startDate,
    status: employee.status,
    groupName: employee.group?.groupName || '',
    groupId: employee.group?.groupId,
    balanceJams: employee.jamInfo?.balanceJams || 0,
    totalJams: employee.jamInfo?.totalJams || 0,
    userId: employee.userId,
  };
}

/**
 * GraphQL EmployeeData 배열을 테이블 표시용 EmployeeTableData 배열로 변환
 * 
 * @param employees - GraphQL API에서 받은 임직원 데이터 배열
 * @returns 테이블 컴포넌트에서 사용할 수 있는 형태로 변환된 데이터 배열
 * 
 * @example
 * ```typescript
 * const tableDataList = mapEmployeesToTableData(graphqlEmployees);
 * ```
 */
export function mapEmployeesToTableData(employees: EmployeeData[]): EmployeeTableData[] {
  return employees.map(mapEmployeeToTableData);
}

