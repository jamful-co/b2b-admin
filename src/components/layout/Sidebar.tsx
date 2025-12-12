import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Users, List, Receipt, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentType = searchParams.get('dashboard_type') || 'subscription';

  const menuItems = [
    { label: '홈', icon: Home, path: '/dashboard' },
    { label: '임직원 관리', icon: Users, path: '/employees' },
    { label: '그룹 관리', icon: List, path: '/groups' },
    { label: '정산 관리', icon: Receipt, path: '/settlements' },
  ];

  const handleTypeToggle = (checked) => {
    const newType = checked ? 'recharge' : 'subscription';
    const params = new URLSearchParams(searchParams);
    params.set('dashboard_type', newType);

    // Check if we are on dashboard, if not, go there
    if (!currentPath.includes('dashboard') && currentPath !== '/') {
      navigate(`/dashboard?${params.toString()}`);
    } else {
      navigate(`?${params.toString()}`);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <BarChart3 className="w-6 h-6" />
          <span className="text-gray-900">ByteDance</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
          // Preserve query params when navigating within dashboard
          const to =
            item.path === '/dashboard'
              ? createPageUrl(`dashboard?dashboard_type=${currentType}`)
              : createPageUrl(item.path.replace('/', ''));

          return (
            <Link
              key={item.path}
              to={to}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#FFF9C4] text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive ? 'text-gray-900' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="dashboard-mode" className="text-xs font-medium text-gray-500">
            {currentType === 'subscription' ? '구독형' : '충전형'}
          </Label>
          <Switch
            id="dashboard-mode"
            checked={currentType === 'recharge'}
            onCheckedChange={handleTypeToggle}
          />
        </div>
        <p className="text-[10px] text-gray-400">
          {currentType === 'subscription' ? '구독형 멤버십 이용중' : '충전형 멤버십 이용중'}
        </p>
      </div>
    </div>
  );
}
