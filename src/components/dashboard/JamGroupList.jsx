import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JamGroup } from '@/api/entities';
import { useQuery } from '@tanstack/react-query';

export default function JamGroupList() {
  const { data: groups } = useQuery({
    queryKey: ['jamGroups'],
    queryFn: () => JamGroup.list(),
    initialData: [],
  });

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-500">
          1인당 지급 잼
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 font-medium">{group.name}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-yellow-400 font-bold text-xs">J</div>
                <span className="text-xl font-bold text-gray-900">{group.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}