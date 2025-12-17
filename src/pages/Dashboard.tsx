import React from 'react';
import { Stat, type Stat as StatType } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import StatCard from '../components/dashboard/StatCard';
import UsageChart from '../components/dashboard/UsageChart';
import ReviewList from '../components/dashboard/ReviewList';
import AvailableJamCard from '../components/dashboard/AvailableJamCard';
import JamGroupList from '../components/dashboard/JamGroupList';
import { useSearchParams } from 'react-router-dom';
import { useMemberStats } from '@/hooks/useMemberStats';
import { getCompanyId } from '@/lib/company';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const dashboardType = searchParams.get('dashboard_type') || 'subscription';
  const companyId = getCompanyId();

  // GraphQL로 회원 통계 조회
  const { data: memberStats } = useMemberStats(companyId);

  const { data: stats = [] } = useQuery<StatType[]>({
    queryKey: ['stats'],
    queryFn: () => Stat.list(),
    initialData: [],
  });

  const filteredStats = React.useMemo(() => {
    return stats.filter((stat) => {
      const statType = stat.dashboard_type || 'subscription';
      return statType === dashboardType;
    });
  }, [stats, dashboardType]);

  // GraphQL 데이터로 통계 카드 생성 (구독형 대시보드용)
  const graphqlStats = React.useMemo(() => {
    if (dashboardType !== 'subscription' || !memberStats) {
      return [];
    }

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
  }, [memberStats, dashboardType]);

  // GraphQL 데이터와 기존 데이터 병합
  const mergedStats = React.useMemo(() => {
    if (dashboardType === 'subscription' && graphqlStats.length > 0) {
      // GraphQL 데이터가 있으면 GraphQL 데이터 사용, 나머지는 기존 데이터에서 가져오기
      const paymentDateStat = filteredStats.find((s) => s.type === 'payment_date');
      return paymentDateStat ? [...graphqlStats, paymentDateStat] : graphqlStats;
    }
    return filteredStats;
  }, [graphqlStats, filteredStats, dashboardType]);

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
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-yellow-400 font-bold text-sm shrink-0">
          J
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Column: Stats + Available Jam + Chart */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="lg:col-span-1 h-full flex flex-col gap-6 overflow-hidden">
          {/* Recharge Only: Jam Group List */}
          {dashboardType === 'recharge' && (
            <div className="shrink-0">
              <JamGroupList />
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
