import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'sonner';
import { auth } from '@/api/auth';
import { getLogoUrlFromSubdomain } from '@/utils';

export default function WelcomePage() {
  const logoImageUrl = useMemo(() => getLogoUrlFromSubdomain(), []);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await auth.login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      // GraphQL 에러에서 메시지 추출
      let errorMessage = '로그인에 실패했습니다.';
      
      // graphql-request의 GraphQLError 형식 처리
      if (error?.response?.errors && Array.isArray(error.response.errors) && error.response.errors.length > 0) {
        // GraphQL 에러 형식: { response: { errors: [{ message: "..." }] } }
        errorMessage = error.response.errors[0].message || errorMessage;
      } else if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        // 직접 errors 배열이 있는 경우
        errorMessage = error.errors[0].message || errorMessage;
      } else if (error?.message) {
        // 일반 에러 메시지
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const canLogin = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="min-h-screen bg-white relative w-full">
      {/* 상단 헤더 바 */}
      <div className="absolute top-0 right-0 h-[42px] w-full bg-[#FBFBFB] border-b border-[#F1F1F0] flex items-center justify-end px-6">
        <div className="w-8 h-8 relative overflow-hidden">
          <User className="w-full h-full text-[#2E3A49]" />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="absolute top-[42px] left-0 w-full min-h-[calc(100vh-42px)] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-full max-w-[600px] flex flex-col gap-11">
          {/* 로고, 제목 및 입력 필드 영역 */}
          <div className="flex flex-col gap-8 w-full">
            {/* 로고 */}
            <div className="relative">
              <img
                src={logoImageUrl}
                alt="Logo"
                className="max-w-[200px] h-auto object-contain"
                onError={(e) => {
                  // 로고 이미지 로드 실패 시 텍스트로 대체
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (!target.parentElement?.querySelector('.logo-text')) {
                    const textDiv = document.createElement('div');
                    textDiv.className = 'logo-text text-[#141414] font-semibold text-xl';
                    textDiv.textContent = 'Logo';
                    target.parentElement?.appendChild(textDiv);
                  }
                }}
              />
            </div>

            {/* 제목 */}
            <h1 className="text-[22px] font-semibold text-[#141414] leading-[1.4]">
              로그인
            </h1>

            {/* 입력 필드 */}
            <div className="flex flex-col gap-4 w-full">
              {/* 이메일 입력 */}
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email" className="text-sm font-semibold text-[#141414]">
                  이메일
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 px-3 border-[#2E3A49] focus-visible:ring-1 focus-visible:ring-[#2E3A49] rounded-sm"
                    placeholder=""
                    required
                  />
                  {email && (
                    <button
                      type="button"
                      onClick={() => setEmail('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#AEB5BD] hover:text-[#6C7885]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="password" className="text-sm font-semibold text-[#141414]">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 px-3 pr-10 border-[#E3E7EC] focus-visible:ring-1 focus-visible:ring-[#2E3A49] rounded-sm"
                    placeholder=""
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#AEB5BD] hover:text-[#6C7885]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <form onSubmit={handleLogin} className="w-full">
            <Button
              type="submit"
              disabled={isLoading || !canLogin}
              variant={canLogin ? 'active' : 'inactive'}
              className="w-full h-11 px-6 py-3 rounded-[4px] text-sm font-semibold"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
