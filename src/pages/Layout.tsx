import React, { useEffect, useState, ReactNode } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { UserCircle, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, User } from '@/api/auth';
import { Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isWelcomePage = location.pathname === '/welcome';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await auth.isAuthenticated();
        if (isAuth) {
          const user = await auth.me();
          setCurrentUser(user);
        }

        if (!isAuth && !isWelcomePage) {
          navigate('/welcome');
        } else if (isAuth && isWelcomePage) {
          navigate('/dashboard');
        }
        setIsAuthenticated(isAuth);
      } catch (e) {
        if (!isWelcomePage) navigate('/welcome');
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [location.pathname, isWelcomePage, navigate]);

  if (isWelcomePage) {
    return <main>{children}</main>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top App Bar */}
        <header
          className="h-16 flex items-center justify-end px-8 z-10"
          style={{
            borderBottom: '1px solid var(--border-light, #F1F1F0)',
            background: 'var(--warm-neutral-25, #FBFBFB)'
          }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                title="User Menu"
              >
                <UserCircle className="w-8 h-8" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 정보</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-sm">
                <div className="font-medium text-gray-900">
                  {currentUser?.full_name || '사용자'}
                </div>
                <div className="text-xs text-gray-500 truncate">{currentUser?.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => auth.logout()}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto flex justify-center" style={{ background: '#FFFFFF' }}>
          <div className="w-full py-12" style={{ maxWidth: '1088px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
