import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JamIcon from '@/assets/icons/jam.svg?react';
import { EmployeeGroupData } from '@/graphql/types';

interface JamGroupListProps {
  groups?: EmployeeGroupData[];
}

const JamGroupList: React.FC<JamGroupListProps> = ({ groups = [] }) => {
  // 활성 그룹만 필터링하고 금액 내림차순으로 정렬
  const activeGroupsSorted = React.useMemo(() => {
    return groups
      .filter((group) => group.isActive)
      .sort((a, b) => b.credits - a.credits);
  }, [groups]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-gray-500">1인당 지급 잼</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeGroupsSorted.map((group) => (
            <div key={group.employeeGroupId} className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 font-medium">{group.name}</span>
              <div className="flex items-center gap-1.5">
                <JamIcon className="w-5 h-5" />
                <span className="text-xl font-bold text-gray-900">
                  {group.credits.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JamGroupList;
