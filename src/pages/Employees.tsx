import React from 'react';
import { useEmployeeList } from '@/hooks/useEmployeeList';
import { getCompanyId } from '@/lib/company';
import EmployeeTable from '../components/employees/EmployeeTable';
import { type Employee as EmployeeType } from '@/api/entities';

export default function EmployeesPage() {
  const companyId = getCompanyId();

  // GraphQL로 임직원 목록 조회
  const { data: employeeListData, isLoading } = useEmployeeList(companyId);

  // GraphQL 데이터를 기존 Employee 타입으로 변환
  const employees: EmployeeType[] = React.useMemo(() => {
    if (!employeeListData?.employees) return [];

    return employeeListData.employees.map((emp) => ({
      id: emp.employeeNumber,
      name: emp.name,
      email: emp.email,
      phone: emp.phoneNumber,
      employee_code: emp.employeeNumber,
      group_name: emp.group?.groupName || '',
      employment_status: emp.status as EmployeeType['employment_status'],
      join_date: emp.joinDate,
      jam_balance: emp.jamInfo?.balanceJams || 0,
      jam_capacity: emp.jamInfo?.totalJams || 0,
    }));
  }, [employeeListData]);

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
