import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthlyJamUsage } from '@/hooks/useMonthlyJamUsage';
import { getCompanyId } from '@/lib/company';

export default function UsageChart() {
  const companyId = getCompanyId();

  // GraphQL로 월간 잼 사용량 조회
  const { data: usageData, isLoading } = useMonthlyJamUsage(companyId, 10);

  // 차트 데이터 변환
  const chartData = React.useMemo(() => {
    if (!usageData?.monthlyUsage) {
      return [];
    }

    // GraphQL 데이터를 차트 형식으로 변환
    return usageData.monthlyUsage.map((month) => {
      // YYYY-MM 형식을 M월 형식으로 변환
      const [year, monthNum] = month.yearMonth.split('-');
      const monthName = `${parseInt(monthNum)}월`;

      return {
        name: monthName,
        value: Math.round(month.averageUsage),
        yearMonth: month.yearMonth,
      };
    });
  }, [usageData]);

  // 현재 월 계산
  const currentMonth = React.useMemo(() => {
    const now = new Date();
    return `${now.getMonth() + 1}월`;
  }, []);

  // 평균 사용량 표시
  const averageUsage = usageData?.overallAverageUsage
    ? Math.round(usageData.overallAverageUsage).toLocaleString()
    : '0';

  // 마지막 업데이트 시간
  const lastUpdated = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, []);

  // 바 위 라벨 렌더링 (값을 보기 좋게 표시)
  const renderBarValueLabel = React.useCallback(
    (props: { x?: number; y?: number; width?: number; value?: number }) => {
      const { x = 0, y = 0, width = 0, value } = props;
      if (value == null) return null;
      if (Number(value) <= 0) return null;

      const label = Number(value).toLocaleString();
      return (
        <text
          x={x + width / 2}
          y={y - 8}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={12}
          fontWeight={500}
        >
          {label}
        </text>
      );
    },
    []
  );

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-gray-900">월 평균 사용 잼</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-center justify-center">
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-gray-900">월 평균 사용 잼</CardTitle>
        </div>
        <p className="text-xs text-gray-400">{lastUpdated}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {
            isLoading ? (
              <div className="h-[250px] w-full flex items-center justify-center">
                <p className="text-gray-400">데이터를 불러오는 중...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 24, right: 0, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    dy={10}
                  />
                        <CartesianGrid stroke="#E3E7EC" vertical={false} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                    <LabelList dataKey="value" position="top" content={renderBarValueLabel} />
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.name === currentMonth ? '#FDE047' : '#F3F4F6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
}
