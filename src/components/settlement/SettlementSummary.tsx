import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettlementSummary() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-gray-900">정산 금액 계산</h2>
          <Badge className="bg-gray-100 text-gray-900 font-medium rounded-md px-2 py-0.5">
            2026.12.1 - 2026.12.31
          </Badge>
        </div>
        <span className="text-xs text-gray-400">업데이트: 2025.12.16 00:00:00pm</span>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">2026년 1월 정산 금액</p>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-bold text-gray-900">7,393,705원</span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full bg-gray-100 p-1 hover:bg-gray-200 transition-colors"
              >
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-8 space-y-6">
                  {/* Breakdown Box */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    {/* Item 1 */}
                    <div className="space-y-3">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>1. 잼플 멤버십 요금</span>
                        <span>6,110,500원</span>
                      </div>
                      <div className="pl-4 space-y-2 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>• 최소 요금 (100명 x 60,500원)</span>
                          <span>6,050,000원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• 초과 요금 (2명 x 60,500원)</span>
                          <span>+121,000원</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• 공제 요금 (1명 x 60,500원)</span>
                          <span>-60,500원</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="space-y-3">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>2. 서비스 이용료</span>
                        <span>611,050원</span>
                      </div>
                      <div className="pl-4 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>• 잼플 멤버십 요금의 10%</span>
                        </div>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="space-y-3">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>3. vat (10%)</span>
                        <span>672,155원</span>
                      </div>
                      <div className="pl-4 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>• (잼플 멤버십 요금 + 서비스 이용료)합계의 10%</span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">합계</span>
                      <span className="text-xl font-bold text-gray-900">7,393,705원</span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    <div className="space-y-2">
                      <p className="font-bold text-gray-900 text-sm">제안 사항</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>매달 크레딧이 할당되고 만료는 월간 잼 멤버십 모델</p>
                        <ul className="list-disc list-inside pl-1 space-y-1">
                          <li>초기 할당: 직원당 1,500잼, 매월 잼 제공</li>
                          <li>만료: 모든 잼은 사용하지 않으면 매월 말에 만료</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-bold text-gray-900 text-sm">세부 사항</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>잼은 공급일이 해당하는 달에 사용해야 합니다.</p>
                        <p>사용하지 않으면 매월 말에 자동으로 소멸됩니다.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
