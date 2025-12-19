import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import {
  CREATE_EMPLOYEE_GROUP,
  UPDATE_EMPLOYEE_GROUP,
  ASSIGN_EMPLOYEE_TO_GROUP,
  UNASSIGN_EMPLOYEE_FROM_GROUP,
  DELETE_EMPLOYEE_GROUP,
} from '@/graphql/mutations/employee';
import { GET_EMPLOYEE_GROUPS } from '@/graphql/queries/employeeGroup';
import {
  EmployeeGroupData,
  EmployeeGroupsResponse,
  GetEmployeeGroupsVariables,
  CreateEmployeeGroupVariables,
  UpdateEmployeeGroupVariables,
  AssignEmployeeToGroupVariables,
  UnassignEmployeeFromGroupVariables,
  DeleteEmployeeGroupVariables,
} from '@/graphql/types';

/**
 * 임직원 그룹 목록을 조회하는 함수
 */
const fetchEmployeeGroups = async (
  variables: GetEmployeeGroupsVariables
): Promise<EmployeeGroupsResponse> => {
  const data = await graphqlClient.request<{ getEmployeeGroups: EmployeeGroupsResponse }>(
    GET_EMPLOYEE_GROUPS,
    variables
  );
  return data.getEmployeeGroups;
};

/**
 * 임직원 그룹을 생성하는 함수
 */
const createEmployeeGroup = async (
  variables: CreateEmployeeGroupVariables
): Promise<EmployeeGroupData> => {
  const data = await graphqlClient.request<{ createEmployeeGroup: EmployeeGroupData }>(
    CREATE_EMPLOYEE_GROUP,
    variables
  );
  return data.createEmployeeGroup;
};

/**
 * 임직원 그룹을 수정하는 함수
 */
const updateEmployeeGroup = async (
  variables: UpdateEmployeeGroupVariables
): Promise<EmployeeGroupData> => {
  const data = await graphqlClient.request<{ updateEmployeeGroup: EmployeeGroupData }>(
    UPDATE_EMPLOYEE_GROUP,
    variables
  );
  return data.updateEmployeeGroup;
};

/**
 * 임직원을 그룹에 할당하는 함수
 */
const assignEmployeeToGroup = async (
  variables: AssignEmployeeToGroupVariables
): Promise<boolean> => {
  const data = await graphqlClient.request<{ assignEmployeeToGroup: boolean }>(
    ASSIGN_EMPLOYEE_TO_GROUP,
    variables
  );
  return data.assignEmployeeToGroup;
};

/**
 * 임직원 그룹을 해제하는 함수
 */
const unassignEmployeeFromGroup = async (
  variables: UnassignEmployeeFromGroupVariables
): Promise<boolean> => {
  const data = await graphqlClient.request<{ unassignEmployeeFromGroup: boolean }>(
    UNASSIGN_EMPLOYEE_FROM_GROUP,
    variables
  );
  return data.unassignEmployeeFromGroup;
};

/**
 * 임직원 그룹을 삭제하는 함수
 */
const deleteEmployeeGroup = async (
  variables: DeleteEmployeeGroupVariables
): Promise<boolean> => {
  const data = await graphqlClient.request<{ deleteEmployeeGroup: boolean }>(
    DELETE_EMPLOYEE_GROUP,
    variables
  );
  return data.deleteEmployeeGroup;
};

/**
 * 임직원 그룹 생성 훅
 *
 * @example
 * ```tsx
 * const { mutate: createGroup, isPending } = useCreateEmployeeGroup();
 *
 * createGroup({
 *   input: {
 *     companyId: 1,
 *     name: '개발팀',
 *     credits: 100000,
 *     renewDate: 1,
 *     rolloverPercentage: 50,
 *   }
 * });
 * ```
 */
export const useCreateEmployeeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<EmployeeGroupData, Error, CreateEmployeeGroupVariables>({
    mutationFn: createEmployeeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

/**
 * 임직원 그룹 수정 훅
 *
 * @example
 * ```tsx
 * const { mutate: updateGroup, isPending } = useUpdateEmployeeGroup();
 *
 * updateGroup({
 *   input: {
 *     employeeGroupId: 1,
 *     name: '개발팀 (수정)',
 *     credits: 150000,
 *   }
 * });
 * ```
 */
export const useUpdateEmployeeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<EmployeeGroupData, Error, UpdateEmployeeGroupVariables>({
    mutationFn: updateEmployeeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

/**
 * 임직원을 그룹에 할당하는 훅
 *
 * @example
 * ```tsx
 * const { mutate: assignToGroup, isPending } = useAssignEmployeeToGroup();
 *
 * assignToGroup({
 *   input: {
 *     employeeId: 'employee-uuid',
 *     employeeGroupId: 1,
 *   }
 * });
 * ```
 */
export const useAssignEmployeeToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, AssignEmployeeToGroupVariables>({
    mutationFn: assignEmployeeToGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeList'] });
      queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
    },
  });
};

/**
 * 임직원 그룹을 해제하는 훅
 *
 * @example
 * ```tsx
 * const { mutate: unassignFromGroup, isPending } = useUnassignEmployeeFromGroup();
 *
 * unassignFromGroup({
 *   input: {
 *     companyId: 1,
 *     employeeId: 'employee-uuid',
 *   }
 * });
 * ```
 */
export const useUnassignEmployeeFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, UnassignEmployeeFromGroupVariables>({
    mutationFn: unassignEmployeeFromGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeList'] });
      queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
    },
  });
};

/**
 * 임직원 그룹 삭제 훅
 *
 * @example
 * ```tsx
 * const { mutate: deleteGroup, isPending } = useDeleteEmployeeGroup();
 *
 * deleteGroup({
 *   input: {
 *     employeeGroupId: 1,
 *   }
 * });
 * ```
 */
export const useDeleteEmployeeGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, DeleteEmployeeGroupVariables>({
    mutationFn: deleteEmployeeGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employeeGroups'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};

/**
 * 임직원 그룹 목록을 조회하는 훅
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useEmployeeGroups(companyId);
 *
 * if (isLoading) return <Loading />;
 * if (error) return <Error />;
 *
 * return (
 *   <ul>
 *     {data?.groups.map(group => (
 *       <li key={group.employeeGroupId}>{group.name}</li>
 *     ))}
 *   </ul>
 * );
 * ```
 */
export const useEmployeeGroups = (companyId: number) => {
  return useQuery<EmployeeGroupsResponse, Error>({
    queryKey: ['employeeGroups', companyId],
    queryFn: () => fetchEmployeeGroups({ companyId }),
    enabled: !!companyId,
  });
};
