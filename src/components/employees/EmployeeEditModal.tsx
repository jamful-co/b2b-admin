import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SimpleSelect } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { JamGroup } from '@/api/entities';

export default function EmployeeEditModal({ isOpen, onClose, onSave, employee }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    group_name: '',
    employment_status: 'active',
  });

  // Fetch groups for the dropdown
  const { data: groups } = useQuery({
    queryKey: ['jamGroups'],
    queryFn: () => JamGroup.list(),
    initialData: [],
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        group_name: employee.group_name || '',
        employment_status: employee.employment_status || 'active',
      });
    }
  }, [employee]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({
      ...employee,
      ...formData,
    });
    onClose();
  };

  const groupItems = useMemo(() => {
    return [
      { value: '그룹 없음', label: '그룹 없음' },
      ...groups.map((group) => ({ value: group.name, label: group.name })),
    ];
  }, [groups]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">상태 및 정보 변경</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-900">
              이름*
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="pr-10"
              />
              {formData.name && (
                <button
                  onClick={() => handleChange('name', '')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <div className="bg-[#374151] rounded-full p-0.5">
                    <X className="h-3 w-3 text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
              이메일*
            </Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
              전화번호*
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>

          {/* Group */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">그룹</Label>
            <SimpleSelect
              value={formData.group_name}
              onValueChange={(value) => handleChange('group_name', value)}
              items={groupItems}
              placeholder="그룹을 선택해주세요"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-900">
              재직중
            </Label>
            <Switch
              id="status"
              checked={formData.employment_status === 'active'}
              onCheckedChange={(checked) =>
                handleChange('employment_status', checked ? 'active' : 'inactive')
              }
              className="data-[state=checked]:bg-[#282821]"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1 h-11 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            className="flex-1 h-11 bg-[#282821] text-white hover:bg-[#282821]/90"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
