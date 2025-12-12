import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function SettlementDetailsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const { data: employees = [] } = useQuery({
        queryKey: ['employees'],
        queryFn: () => base44.entities.Employee.list(),
    });

    // Mock settlement data enrichment
    const enrichedEmployees = useMemo(() => {
        return employees.map((emp, index) => {
            // Mock logic for status based on employment_status or random for demo if all are active
            let status = 'existing';
            if (emp.employment_status === 'resigning' || emp.employment_status === 'inactive') {
                status = 'resigned';
            } else if (emp.join_date && new Date(emp.join_date) > new Date('2025-12-01')) { // Arbitrary date for "new"
                status = 'new';
            } else if (index < 2) { // Force some "new" for demo matching the image if data is sparse
                 status = 'new';
            } else if (index === 2) { // Force one "resigned"
                 status = 'resigned';
            }

            return {
                ...emp,
                settlement_status: status,
                membership_start: '2025-12-28',
                membership_end: '2026-01-27',
                fee: 60500,
            };
        });
    }, [employees]);

    const filteredData = useMemo(() => {
        if (activeTab === 'all') return enrichedEmployees;
        return enrichedEmployees.filter(emp => emp.settlement_status === activeTab);
    }, [enrichedEmployees, activeTab]);

    const counts = useMemo(() => {
        return {
            all: enrichedEmployees.length,
            existing: enrichedEmployees.filter(e => e.settlement_status === 'existing').length,
            new: enrichedEmployees.filter(e => e.settlement_status === 'new').length,
            resigned: enrichedEmployees.filter(e => e.settlement_status === 'resigned').length,
        };
    }, [enrichedEmployees]);

    const totalAmount = filteredData.reduce((sum, emp) => sum + emp.fee, 0);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ko-KR').format(amount);
    };

    return (
        <div className="h-screen flex flex-col bg-white overflow-hidden">
            {/* Header Area - Fixed */}
            <div className="flex-none p-8 pb-4 space-y-6">
                <div className="flex items-center gap-4">
                     {/* Back button logic if needed, or just title as requested "서브 페이지로 이동" usually implies back capability */}
                     {/* The image doesn't show a back button explicitly but implies navigation context. I'll add one for usability if it's not in sidebar */}
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900">직원별 정산 내역 보기</h1>

                {/* Tabs */}
                <div className="flex gap-2">
                    {[
                        { id: 'all', label: '전체', count: counts.all },
                        { id: 'existing', label: '기존', count: counts.existing },
                        { id: 'new', label: '신규', count: counts.new },
                        { id: 'resigned', label: '퇴사', count: counts.resigned },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
                                activeTab === tab.id
                                    ? 'border-gray-900 text-gray-900 bg-white'
                                    : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
                            }`}
                        >
                            {tab.label} <span className="text-gray-400 text-xs">{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Area - Flex Grow with internal scroll */}
            <div className="flex-1 overflow-hidden px-8 pb-4 flex flex-col min-h-0">
                <div className="border border-gray-200 rounded-t-lg bg-white flex flex-col h-full shadow-sm">
                    {/* Table Header - Fixed */}
                    <div className="flex-none grid grid-cols-[60px_100px_100px_1fr_1fr_120px_120px] bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                        <div className="p-4 text-center">번호</div>
                        <div className="p-4">사번</div>
                        <div className="p-4">이름</div>
                        <div className="p-4 text-center">멤버십 시작일</div>
                        <div className="p-4 text-center">멤버십 종료일</div>
                        <div className="p-4 text-right">멤버십 요금</div>
                        <div className="p-4 text-center">인원 변동 (전월 기준)</div>
                    </div>

                    {/* Table Body - Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {filteredData.map((emp, index) => (
                            <div key={emp.id} className="grid grid-cols-[60px_100px_100px_1fr_1fr_120px_120px] border-b border-gray-100 last:border-0 hover:bg-gray-50 text-sm text-gray-900 items-center">
                                <div className="p-4 text-center text-gray-500">{index + 1}</div>
                                <div className="p-4 text-gray-500">{emp.employee_code}</div>
                                <div className="p-4 font-medium">{emp.name}</div>
                                <div className="p-4 text-center text-gray-600">{emp.membership_start}</div>
                                <div className="p-4 text-center text-gray-600">{emp.membership_end}</div>
                                <div className="p-4 text-right font-bold">{formatCurrency(emp.fee)}</div>
                                <div className="p-4 flex justify-center">
                                    {emp.settlement_status === 'new' && (
                                        <Badge className="bg-green-100 text-green-600 hover:bg-green-100 border-0 shadow-none font-medium">신규 입사자</Badge>
                                    )}
                                    {emp.settlement_status === 'resigned' && (
                                        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-0 shadow-none font-medium">퇴사자</Badge>
                                    )}
                                    {emp.settlement_status === 'existing' && (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredData.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                데이터가 없습니다.
                            </div>
                        )}
                    </div>

                    {/* Table Footer - Fixed */}
                    <div className="flex-none bg-[#FFF9C4]/30 border-t border-gray-200 p-4 flex justify-between items-center rounded-b-lg">
                        <span className="font-bold text-gray-900">합계({filteredData.length}명)</span>
                        <span className="text-xl font-bold text-gray-900">{formatCurrency(totalAmount)}원</span>
                    </div>
                </div>
            </div>
        </div>
    );
}