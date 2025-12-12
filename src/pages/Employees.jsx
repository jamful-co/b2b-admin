import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import EmployeeTable from '../components/employees/EmployeeTable';

export default function EmployeesPage() {
    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => base44.entities.Employee.list(), // Fetch all for client-side processing
        initialData: [],
    });

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">임직원 관리</h1>
            </div>
            
            <div className="flex-1 min-h-0">
                <EmployeeTable data={employees} />
            </div>
        </div>
    );
}