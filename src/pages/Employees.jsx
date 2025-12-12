import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Employee } from '@/api/entities';
import EmployeeTable from '../components/employees/EmployeeTable';

export default function EmployeesPage() {
    const { data: employees, isLoading } = useQuery({
        queryKey: ['employees'],
        queryFn: () => Employee.list(), // Fetch all for client-side processing
        initialData: [],
    });

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">임직원 관리</h1>
            </div>

            <div className="flex-1 min-h-0">
                <EmployeeTable data={employees} />
            </div>
        </div>
    );
}