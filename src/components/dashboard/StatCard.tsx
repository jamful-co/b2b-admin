import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { type Stat } from '@/api/entities';

interface StatCardProps {
  stat: Stat;
}

export default function StatCard({ stat }: StatCardProps) {
  // Logic for displaying change or percentage based on type
  const isSubscriber = stat.type === 'subscribers';
  const isTotal = stat.type === 'total_members';
  const isChargedJam = stat.type === 'total_charged_jam';

  // Badge Logic for Subscribers
  const getBadgeColor = (percent: number) => {
    if (percent >= 50) return "bg-green-100 text-green-600 hover:bg-green-100";
    return "bg-red-100 text-red-600 hover:bg-red-100";
  };

  return (
    <Card className="shadow-sm border-gray-100 h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {stat.label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2">
            {isChargedJam && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-yellow-400 font-bold text-sm shrink-0">
                J
              </div>
            )}
            <div className="text-3xl font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
          
          {isSubscriber && stat.percentage !== undefined && (
            <Badge className={`ml-2 ${getBadgeColor(stat.percentage)} border-0 px-2 py-0.5 text-xs font-semibold`}>
              {stat.percentage}%
            </Badge>
          )}

          {isTotal && stat.change !== undefined && stat.change !== 0 && (
            <Badge 
              className={`ml-2 border-0 px-2 py-0.5 text-xs font-semibold flex items-center gap-0.5 ${
                stat.change > 0 
                  ? "bg-green-100 text-green-600 hover:bg-green-100" 
                  : "bg-red-100 text-red-600 hover:bg-red-100"
              }`}
            >
              {stat.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {Math.abs(stat.change)}명
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}