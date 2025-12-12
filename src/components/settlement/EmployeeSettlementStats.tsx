import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function EmployeeSettlementStats() {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">이달 직원별 정산 내역 보기</h2>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="p-8 space-y-2">
                            <p className="text-sm text-gray-500">총 활성 인원 <span className="text-xs text-gray-400">(전월 기준)</span></p>
                            <p className="text-2xl font-bold text-gray-900">101명</p>
                        </div>
                        <div className="p-8 space-y-2">
                            <p className="text-sm text-gray-500">신규 인원 <span className="text-xs text-gray-400">(일할 계산 적용)</span></p>
                            <p className="text-2xl font-bold text-gray-900">+2명</p>
                        </div>
                        <div className="p-8 space-y-2">
                            <p className="text-sm text-gray-500">퇴사자 <span className="text-xs text-gray-400">(일할 공제 적용)</span></p>
                            <p className="text-2xl font-bold text-gray-900">-1명</p>
                        </div>
                    </div>

                    {/* Warning Banner */}
                    <div className="mx-8 mb-8 p-4 bg-[#FFFEF2] rounded-lg flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4 text-gray-400" />
                        이번 달 신규/퇴사자는 다음 달 정산에 반영됩니다.
                    </div>
                </CardContent>
            </Card>

            <Link to={createPageUrl('SettlementDetails')}>
                <Button variant="outline" className="w-full h-12 bg-white border-gray-200 text-gray-900 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                    이달 직원별 정산 내역 보기
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
}