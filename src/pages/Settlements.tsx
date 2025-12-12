import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SettlementHistory } from '@/api/entities';
import SettlementSummary from '../components/settlement/SettlementSummary';
import EmployeeSettlementStats from '../components/settlement/EmployeeSettlementStats';
import SettlementHistoryTable from '../components/settlement/SettlementHistoryTable';

export default function SettlementsPage() {
    const { data: settlementHistory, isLoading } = useQuery({
        queryKey: ['settlementHistory'],
        queryFn: () => SettlementHistory.list(),
        initialData: [],
    });

    // Sort by usage_month descending
    const sortedHistory = [...settlementHistory].sort((a, b) => 
        new Date(b.usage_month) - new Date(a.usage_month)
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-12">
            <SettlementSummary />
            <EmployeeSettlementStats />
            <SettlementHistoryTable data={sortedHistory} />
        </div>
    );
}