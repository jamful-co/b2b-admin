import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import {
  APPROVE_EMPLOYEE,
  APPROVE_EMPLOYEE_WITH_GROUP,
  REJECT_EMPLOYEE,
  SCHEDULE_EMPLOYEE_LEAVE,
  PROCESS_EMPLOYEE_LEAVE,
} from '@/graphql/mutations/employee';
import {
  UpdateEmployeeStatusResponse,
  UpdateEmployeeStatusVariables,
  EmployeeStatusAction,
} from '@/graphql/types';

/**
 * 액션에 따라 적절한 mutation을 반환
 */
const getMutationByAction = (action: EmployeeStatusAction, hasGroup: boolean) => {
  switch (action) {
    case EmployeeStatusAction.APPROVE:
      return hasGroup ? APPROVE_EMPLOYEE_WITH_GROUP : APPROVE_EMPLOYEE;
    case EmployeeStatusAction.REJECT:
      return REJECT_EMPLOYEE;
    case EmployeeStatusAction.SCHEDULE_LEAVE:
      return SCHEDULE_EMPLOYEE_LEAVE;
    case EmployeeStatusAction.LEAVE:
      return PROCESS_EMPLOYEE_LEAVE;
    default:
      return APPROVE_EMPLOYEE;
  }
};

/**
 * 임직원 상태를 변경하는 함수
 */
const updateEmployeeStatus = async (
  variables: UpdateEmployeeStatusVariables
): Promise<UpdateEmployeeStatusResponse> => {
  const { action, employeeGroupId } = variables.input;
  const mutation = getMutationByAction(action, !!employeeGroupId);

  const data = await graphqlClient.request<{ updateEmployeeStatus: UpdateEmployeeStatusResponse }>(
    mutation,
    variables
  );
  return data.updateEmployeeStatus;
};

/**
 * 임직원 상태 변경 커스텀 훅
 *
 * @example
 * ```tsx
 * const { mutate: updateStatus, isPending } = useUpdateEmployeeStatus();
 *
 * // 승인
 * updateStatus({
 *   input: {
 *     id: 'employee-uuid',
 *     action: EmployeeStatusAction.APPROVE,
 *     approverType: ApproverType.ADMIN,
 *     approverId: 1,
 *   }
 * });
 *
 * // 승인 + 그룹 할당
 * updateStatus({
 *   input: {
 *     id: 'employee-uuid',
 *     action: EmployeeStatusAction.APPROVE,
 *     approverType: ApproverType.ADMIN,
 *     approverId: 1,
 *     employeeGroupId: 5,
 *   }
 * });
 *
 * // 거절
 * updateStatus({
 *   input: {
 *     id: 'employee-uuid',
 *     action: EmployeeStatusAction.REJECT,
 *     approverType: ApproverType.ADMIN,
 *     approverId: 1,
 *     rejectionReason: '서류 미비',
 *   }
 * });
 *
 * // 퇴사 예정
 * updateStatus({
 *   input: {
 *     id: 'employee-uuid',
 *     action: EmployeeStatusAction.SCHEDULE_LEAVE,
 *     approverType: ApproverType.ADMIN,
 *     approverId: 1,
 *     leaveDate: '2024-12-31',
 *   }
 * });
 * ```
 */
export const useUpdateEmployeeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateEmployeeStatusResponse, Error, UpdateEmployeeStatusVariables>({
    mutationFn: updateEmployeeStatus,
    onSuccess: () => {
      // 임직원 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['employeeList'] });
    },
  });
};

