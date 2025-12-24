import React from 'react';
import { type Stat as StatType } from '@/api/entities';
import { Badge } from '@/components/ui/badge';
import StatCard from '../components/dashboard/StatCard';
import UsageChart from '../components/dashboard/UsageChart';
import ReviewList from '../components/dashboard/ReviewList';
import AvailableJamCard from '../components/dashboard/AvailableJamCard';
import JamGroupList from '../components/dashboard/JamGroupList';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMemberStats } from '@/hooks/useMemberStats';
import { useB2bCreditSummary } from '@/hooks/useB2bCreditSummary';
import { useEmployeeGroups } from '@/hooks/useEmployeeGroup';
import { getCompanyId } from '@/lib/company';
import { getDefaultDashboardType, isValidDashboardType } from '@/lib/dashboard';
import JamIcon from '@/assets/icons/jam.svg?react';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const companyId = getCompanyId();

  // Get dashboard type from URL or use default based on supportTypes
  const urlDashboardType = searchParams.get('dashboard_type');
  const defaultDashboardType = getDefaultDashboardType();
  const dashboardType = urlDashboardType || defaultDashboardType;

  // Validate and redirect if necessary
  React.useEffect(() => {
    if (urlDashboardType && !isValidDashboardType(urlDashboardType as 'subscription' | 'recharge')) {
      // If the URL dashboard type is invalid, redirect to default
      const params = new URLSearchParams(searchParams);
      params.set('dashboard_type', defaultDashboardType);
      navigate(`?${params.toString()}`, { replace: true });
    } else if (!urlDashboardType) {
      // If no dashboard type in URL, set the default
      const params = new URLSearchParams(searchParams);
      params.set('dashboard_type', defaultDashboardType);
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [urlDashboardType, defaultDashboardType, navigate, searchParams]);

  // GraphQL로 회원 통계 조회
  const { data: memberStats } = useMemberStats(companyId);

  // GraphQL로 B2B 크레딧 요약 조회 (충전형 대시보드용)
  const { data: creditSummary } = useB2bCreditSummary(companyId);

  // GraphQL로 임직원 그룹 조회 (충전형 대시보드용)
  const { data: employeeGroupsData } = useEmployeeGroups(companyId);

  // GraphQL 데이터로 통계 카드 생성
  const graphqlStats = React.useMemo(() => {
    if (dashboardType === 'subscription' && memberStats) {
      // 구독형 대시보드
      return [
        {
          id: 'gql-total-members',
          type: 'total_members',
          label: '총 가입 회원',
          value: `${memberStats.totalApprovedMembers}명`,
          dashboard_type: 'subscription',
        },
        {
          id: 'gql-subscribers',
          type: 'subscribers',
          label: '구독중인 임직원',
          value: `${memberStats.subscribingMembers}명`,
          percentage: memberStats.subscriptionRate,
          dashboard_type: 'subscription',
        },
      ];
    } else if (dashboardType === 'recharge' && creditSummary && memberStats) {
      // 충전형 대시보드 - totalCharged 및 memberStats 데이터 사용
      return [
        {
          id: 'gql-total-participants',
          type: 'total_participants',
          label: '총 참여인원',
          value: `${memberStats.totalApprovedMembers}명`,
          dashboard_type: 'recharge',
        },
        {
          id: 'gql-total-charged-jam',
          type: 'total_charged_jam',
          label: '총 충전 잼',
          value: creditSummary.totalCharged.toLocaleString(),
          dashboard_type: 'recharge',
        },
      ];
    }
    return [];
  }, [memberStats, creditSummary, dashboardType]);

  // GraphQL 데이터만 사용
  const mergedStats = React.useMemo(() => {
    return graphqlStats;
  }, [graphqlStats]);

  const sortedStats = React.useMemo(() => {
    const order: Record<string, number> =
      dashboardType === 'recharge'
        ? { total_participants: 1, total_charged_jam: 2, payment_date: 3 }
        : { total_members: 1, subscribers: 2, payment_date: 3 };
    return [...mergedStats].sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99));
  }, [mergedStats, dashboardType]);

  // Convert Stat to StatCard props
  const convertStatToCardProps = (stat: StatType) => {
    const isChargedJam = stat.type === 'total_charged_jam';

    // Create value with Jam icon if needed
    const value = isChargedJam ? (
      <div className="flex items-center gap-2">
        <JamIcon className="w-7 h-7 shrink-0" />
        <span>{stat.value}</span>
      </div>
    ) : stat.value;

    // Convert badge if exists
    let badge = undefined;
    if (stat.badge) {
      badge = {
        type: stat.badge.color === '#16A34A' ? 'success' as const : 'warn' as const,
        text: stat.badge.text,
        showArrow: stat.badge.showArrow
      };
    } else if (stat.change !== undefined && stat.change !== 0) {
      // Legacy: convert change to badge
      badge = {
        type: stat.change > 0 ? 'success' as const : 'warn' as const,
        text: `${stat.change > 0 ? '+' : ''}${stat.change}명`,
        showArrow: true
      };
    } else if (stat.percentage !== undefined) {
      // Legacy: convert percentage to badge
      badge = {
        type: stat.percentage >= 50 ? 'success' as const : 'warn' as const,
        text: `${stat.percentage}%`,
        showArrow: false
      };
    }

    return {
      label: stat.label,
      value,
      badge
    };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <h1 style={{ fontSize: '22px', fontWeight: 600 }}>12월 잼플 복지 운영 현황</h1>
        <Badge
          className="text-gray-900 hover:bg-[var(--lemon-lemon-300,#FFFA97)] border-0"
          style={{
            fontSize: '14px',
            fontWeight: 600,
            background: 'var(--lemon-lemon-300, #FFFA97)',
            padding: '4px 12px',
            borderRadius: '9999px'
          }}
        >
          {dashboardType === 'recharge' ? '충전형 멤버십 이용중' : '구독형 멤버십 이용중'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Column: Stats + Available Jam + Chart */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedStats.map((stat) => {
              const cardProps = convertStatToCardProps(stat);
              return (
                <div key={stat.id} className="h-32">
                  <StatCard {...cardProps} />
                </div>
              );
            })}
          </div>

          {/* Recharge Only: Available Jam Card */}
          {dashboardType === 'recharge' && <AvailableJamCard />}

          {/* Chart Section */}
          <div className="h-[400px]">
            <UsageChart />
          </div>
        </div>

        {/* Right Column: Jam Groups + Reviews */}
        <div className="lg:col-span-1 h-full flex flex-col gap-4 overflow-hidden">
          {/* Recharge Only: Jam Group List */}
          {dashboardType === 'recharge' && (
            <div className="shrink-0">
              <JamGroupList groups={employeeGroupsData?.groups} />
            </div>
          )}

          {/* Reviews Section - Fills remaining height */}
          <div className="flex-1 min-h-0">
            <ReviewList />
          </div>
        </div>
      </div>
    </div>
  );
}
