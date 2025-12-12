import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function JamAllocationModal({ isOpen, onClose, onConfirm, availablePoints = 100 }) {
  const [amount, setAmount] = useState('');

  const handleChange = (e) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val !== '') {
      val = parseInt(val, 10);
      if (val > availablePoints) val = availablePoints;
    }
    setAmount(val);
  };

  const handleConfirm = () => {
    onConfirm(amount);
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-8 gap-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">잼 할당</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative">
            <Input
              value={amount}
              onChange={handleChange}
              className="pr-10 h-12 text-lg border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-900"
              autoFocus
            />
            {amount !== '' && (
              <button
                onClick={() => setAmount('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <div className="bg-[#374151] rounded-full p-0.5">
                  <X className="h-3 w-3 text-white" />
                </div>
              </button>
            )}
          </div>

          <p className="text-sm text-gray-400 -mt-2">사용 가능한 포인트: {availablePoints}</p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12 border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className={`flex-1 h-12 border-0 transition-colors duration-200 ${
                amount !== ''
                  ? 'bg-[#282821] text-[#FFFA97] hover:bg-[#282821]/90'
                  : 'bg-[#D9D9D9] text-[#6C7885] hover:bg-[#D9D9D9]'
              }`}
              disabled={amount === ''}
              onClick={handleConfirm}
            >
              예
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
