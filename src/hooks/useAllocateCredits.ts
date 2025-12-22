import { useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { ALLOCATE_CREDITS } from '@/graphql/mutations/employee';
import {
  AllocateCreditsOutput,
  AllocateCreditsVariables,
} from '@/graphql/types';

/**
 * 크레딧 할당 함수
 */
const allocateCredits = async (
  variables: AllocateCreditsVariables
): Promise<AllocateCreditsOutput> => {
  const data = await graphqlClient.request<{ allocateCredits: AllocateCreditsOutput }>(
    ALLOCATE_CREDITS,
    variables
  );
  return data.allocateCredits;
};

/**
 * 크레딧 할당 커스텀 훅
 *
 * @example
 * ```tsx
 * const { mutate: allocate, isPending } = useAllocateCredits();
 *
 * allocate({
 *   input: {
 *     companyId: 1,
 *     userIds: [123, 456, 789],
 *     creditsPerUser: 50000,
 *     expireDate: new Date('2025-12-31'),
 *     rolloverPercentage: 50,
 *     description: '2025년 1분기 크레딧 할당',
 *     initiatedByUserId: 1,
 *   }
 * }, {
 *   onSuccess: (data) => {
 *     console.log(`성공: ${data.successCount}건, 실패: ${data.failedCount}건`);
 *   },
 *   onError: (error) => {
 *     console.error('크레딧 할당 실패:', error);
 *   }
 * });
 * ```
 */
export const useAllocateCredits = () => {
  const queryClient = useQueryClient();

  return useMutation<AllocateCreditsOutput, Error, AllocateCreditsVariables>({
    mutationFn: allocateCredits,
    onSuccess: () => {
      // 임직원 목록 캐시 무효화 (잼 잔액이 변경되었으므로)
      queryClient.invalidateQueries({ queryKey: ['employeeList'] });
      // B2B 크레딧 요약 캐시 무효화 (크레딧 잔액이 변경되었으므로)
      queryClient.invalidateQueries({ queryKey: ['b2bCreditSummary'] });
    },
  });
};

