import { useMemo } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl, getLogoUrlFromSubdomain } from '@/utils';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { hasBothDashboardTypes, getDefaultDashboardType } from '@/lib/dashboard';
import HomeIcon from '@/assets/icons/home.svg';
import UsersIcon from '@/assets/icons/users.svg';
import GroupIcon from '@/assets/icons/group.svg';

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultDashboardType = getDefaultDashboardType();
  const currentType = searchParams.get('dashboard_type') || defaultDashboardType;
  const logoImageUrl = useMemo(() => getLogoUrlFromSubdomain(), []);

  // 사용자가 두 가지 대시보드 타입을 모두 지원하는지 확인
  const showDashboardSwitcher = hasBothDashboardTypes();

  const menuItems = [
    { label: '홈', icon: HomeIcon, path: '/dashboard' },
    { label: '임직원 관리', icon: UsersIcon, path: '/employees' },
    { label: '그룹 관리', icon: GroupIcon, path: '/groups' },
    // { label: '정산 관리', icon: Receipt, path: '/settlements' },
  ];

  const handleTypeToggle = (checked: boolean) => {
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
    <div
      className="h-full flex flex-col py-8 px-4"
      style={{
        width: '232px',
        borderRight: '1px solid var(--border-light, #F1F1F0)',
        background: 'var(--warm-neutral-25, #FBFBFB)'
      }}
    >
      <div className="mb-4">
        <img
          src={logoImageUrl}
          alt="Logo"
          className="max-w-[160px] h-auto object-contain"
          onError={(e) => {
            // 로고 이미지 로드 실패 시 텍스트로 대체
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (!target.parentElement?.querySelector('.logo-text')) {
              const textDiv = document.createElement('div');
              textDiv.className = 'logo-text text-gray-900 font-bold text-xl';
              textDiv.textContent = 'Logo';
              target.parentElement?.appendChild(textDiv);
            }
          }}
        />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
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
                'flex items-center gap-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-900'
              )}
              style={{
                padding: '14px 16px',
                borderRadius: '4px',
                backgroundColor: isActive
                  ? 'var(--lemon-lemon-300, #FFFA97)'
                  : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--lemon-lemon-50, #FFFDD2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Dashboard switcher - only show when user has both dashboard types */}
      {showDashboardSwitcher && (
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
      )}
    </div>
  );
}
