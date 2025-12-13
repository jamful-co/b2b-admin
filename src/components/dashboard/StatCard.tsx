import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface BadgeConfig {
  type: 'success' | 'warn';
  text: string;
  showArrow?: boolean;
}

interface StatCardProps {
  label: string;
  value: string | React.ReactNode;
  badge?: BadgeConfig;
}

const getBadgeStyles = (type: 'success' | 'warn') => {
  const styles = {
    success: {
      background: 'var(--badge-success-bg)',
      color: 'var(--badge-success-text)'
    },
    warn: {
      background: 'var(--badge-warn-bg)',
      color: 'var(--badge-warn-text)'
    }
  };
  return styles[type];
};

const getArrowDirection = (text: string): 'up' | 'down' | null => {
  // 숫자 앞에 + 또는 - 기호가 있는지 확인
  const match = text.match(/^([+-])/);
  if (!match) return null;
  return match[1] === '+' ? 'up' : 'down';
};

export default function StatCard({ label, value, badge }: StatCardProps) {
  const badgeStyles = badge ? getBadgeStyles(badge.type) : null;
  const arrowDirection = badge?.showArrow ? getArrowDirection(badge.text) : null;

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-[color:var(--text-secondary)]">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-[22px] font-bold text-[color:var(--text-primary)]">
            {value}
          </div>

          {badge && badgeStyles && (
            <Badge
              className="ml-2 border-0 text-xs font-semibold flex items-center gap-0.5"
              style={{
                padding: '4px 8px',
                borderRadius: '9999px',
                ...badgeStyles
              }}
            >
              {arrowDirection === 'up' && <ArrowUp className="w-3 h-3" />}
              {arrowDirection === 'down' && <ArrowDown className="w-3 h-3" />}
              {badge.text}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
