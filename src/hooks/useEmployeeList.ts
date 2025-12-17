import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_EMPLOYEE_LIST } from '@/graphql/queries/employee';
import { EmployeeListResponse, GetEmployeeListVariables } from '@/graphql/types';

/**
 * 임직원 목록을 조회하는 함수
 */
const fetchEmployeeList = async (variables: GetEmployeeListVariables): Promise<EmployeeListResponse> => {
  const data = await graphqlClient.request<{ getEmployeeList: EmployeeListResponse }>(
    GET_EMPLOYEE_LIST,
    variables
  );
  return data.getEmployeeList;
};

/**
 * 임직원 목록을 조회하는 훅
 */
export const useEmployeeList = (companyId: number) => {
  return useQuery<EmployeeListResponse, Error>({
    queryKey: ['employeeList', companyId],
    queryFn: () => fetchEmployeeList({ companyId }),
    enabled: !!companyId,
  });
};

