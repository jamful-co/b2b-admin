import React from 'react';
import { useEmployeeList } from '@/hooks/useEmployeeList';
import { getCompanyId } from '@/lib/company';
import EmployeeTable from '../components/employees/EmployeeTable';
import { mapEmployeesToTableData } from '@/utils/employeeMapper';

export default function EmployeesPage() {
  const companyId = getCompanyId();

  // GraphQL로 임직원 목록 조회
  const { data: employeeListData, isLoading } = useEmployeeList(companyId);

  // GraphQL 데이터를 테이블 표시용 형태로 변환
  const employees = React.useMemo(() => {
    if (!employeeListData?.employees) return [];
    return mapEmployeesToTableData(employeeListData.employees);
  }, [employeeListData]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">임직원 관리</h1>
      </div>

      <div className="flex-1 min-h-0">
        <EmployeeTable data={employees} />
      </div>
    </div>
  );
}
