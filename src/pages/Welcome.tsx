import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { BarChart3, Mail, Lock } from 'lucide-react';
import { auth } from '@/api/auth';

export default function WelcomePage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Login with any email/password
            await auth.login(email, password);
            // Navigate to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 space-y-8">
                <div className="flex justify-center">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <BarChart3 className="w-10 h-10 text-indigo-600" />
                    </div>
                </div>

                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">ByteDance Admin</h1>
                    <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            이메일
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 h-12"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            비밀번호
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="비밀번호를 입력하세요"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 h-12"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>
            </div>
        </div>
    );
}