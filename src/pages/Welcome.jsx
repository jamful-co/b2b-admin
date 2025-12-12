import React from 'react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import { BarChart3 } from 'lucide-react';

export default function WelcomePage() {
    const handleLogin = () => {
        base44.auth.redirectToLogin('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-8">
                <div className="flex justify-center">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                        <BarChart3 className="w-10 h-10 text-indigo-600" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900">ByteDance Admin</h1>
                    <p className="text-gray-500">서비스 이용을 위해 로그인해주세요.</p>
                </div>

                <div className="space-y-4">
                    <Button 
                        onClick={handleLogin}
                        className="w-full h-12 text-base font-medium bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        이메일로 로그인
                    </Button>
                    <p className="text-xs text-gray-400">
                        * 버튼을 누르면 로그인 페이지로 이동합니다.
                    </p>
                </div>
            </div>
        </div>
    );
}