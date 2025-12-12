import React from 'react';
import { Stat } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import StatCard from '../components/dashboard/StatCard';
import UsageChart from '../components/dashboard/UsageChart';
import ReviewList from '../components/dashboard/ReviewList';
import AvailableJamCard from '../components/dashboard/AvailableJamCard';
import JamGroupList from '../components/dashboard/JamGroupList';
import { useSearchParams } from 'react-router-dom';

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const dashboardType = searchParams.get('dashboard_type') || 'subscription';

  const { data: stats } = useQuery({
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

  const sortedStats = React.useMemo(() => {
    const order = dashboardType === 'recharge' 
        ? { 'total_participants': 1, 'total_charged_jam': 2, 'payment_date': 3 }
        : { 'total_members': 1, 'subscribers': 2, 'payment_date': 3 };
    return [...filteredStats].sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99));
  }, [filteredStats, dashboardType]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">12월 잼플 복지 운영 현황</h1>
        <Badge className="bg-[#FFF9C4] text-gray-900 hover:bg-[#FFF9C4] border-0 text-sm font-medium px-3 py-1">
          {dashboardType === 'recharge' ? '충전형 멤버십 이용중' : '구독형 멤버십 이용중'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        {/* Left Column: Stats + Available Jam + Chart */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sortedStats.map((stat) => (
                    <div key={stat.id} className="h-32">
                        <StatCard stat={stat} />
                    </div>
                ))}
            </div>

            {/* Recharge Only: Available Jam Card */}
            {dashboardType === 'recharge' && (
                <AvailableJamCard />
            )}

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