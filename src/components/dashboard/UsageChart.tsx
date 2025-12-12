import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: '11월', value: 1000 },
  { name: '12월', value: 0 },
  { name: '1월', value: 0 },
  { name: '2월', value: 0 },
  { name: '3월', value: 0 },
  { name: '4월', value: 0 },
  { name: '5월', value: 0 },
  { name: '6월', value: 0 },
  { name: '7월', value: 0 },
  { name: '8월', value: 0 },
];

export default function UsageChart() {
  const currentMonth = '11월';

  return (
    <Card className="shadow-sm border-gray-100 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold text-gray-900">월 평균 사용 잼</CardTitle>
          <p className="text-2xl font-bold text-gray-900">1,000잼</p>
        </div>
        <p className="text-xs text-gray-400">2025.11.13 4:35PM</p>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === currentMonth ? '#FDE047' : '#F3F4F6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}