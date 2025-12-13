import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function AvailableJamCard() {
  const total = 150000;
  const current = 101250;
  const percentage = (current / total) * 100;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">사용 가능한 잼</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-white font-bold text-sm">
            J
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {current.toLocaleString()}{' '}
            <span className="text-gray-300 font-normal">/ {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="relative mb-2">
          <Progress
            value={percentage}
            className="h-3 bg-gray-100"
            indicatorClassName="bg-yellow-400"
          />
          <span className="absolute right-0 -top-6 text-sm font-bold text-gray-900">
            {percentage.toFixed(1)}%
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-4">2026.5.9일까지 사용 가능</p>
      </CardContent>
    </Card>
  );
}
