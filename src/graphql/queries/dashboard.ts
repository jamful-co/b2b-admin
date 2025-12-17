import { gql } from 'graphql-request';

/**
 * 회원 통계 조회 Query
 */
export const GET_MEMBER_STATS = gql`
  query GetMemberStats($companyId: Int!) {
    getMemberStats(companyId: $companyId) {
      totalApprovedMembers
      subscribingMembers
      subscriptionRate
    }
  }
`;

/**
 * 월간 평균 잼 사용량 조회 Query
 */
export const GET_MONTHLY_JAM_USAGE = gql`
  query GetMonthlyJamUsage($companyId: Int!, $months: Int) {
    getMonthlyJamUsage(companyId: $companyId, months: $months) {
      monthlyUsage {
        yearMonth
        totalUsage
        activeEmployeeCount
        averageUsage
      }
      overallAverageUsage
      totalUsage
    }
  }
`;

/**
 * 최신 리뷰 조회 Query
 */
export const GET_RECENT_REVIEWS = gql`
  query GetRecentReviews($companyId: Int!, $days: Int, $limit: Int) {
    getRecentReviews(companyId: $companyId, days: $days, limit: $limit) {
      reviews {
        review
        rating
        providerName
        createdAt
      }
      totalCount
      averageRating
    }
  }
`;

/**
 * B2B 크레딧 요약 조회 Query
 */
export const GET_B2B_CREDIT_SUMMARY = gql`
  query GetB2bCreditSummary($companyId: Int!) {
    getB2bCreditSummary(companyId: $companyId) {
      totalCharged
      totalBalance
      usageRate
      expiringSoon {
        amount
        expiryDate
        daysUntilExpiry
      }
      credits {
        b2bCreditId
        name
        note
        totalCredits
        balance
        expiryDate
        createdAt
        isExpired
        daysUntilExpiry
      }
    }
  }
`;

