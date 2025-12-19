import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GroupDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  isSubmitting: boolean;
}

export default function GroupDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
  isSubmitting,
}: GroupDeleteModalProps) {
  // 한국어 조사 처리: 받침이 있으면 "을", 없으면 "를"
  const getParticle = (name: string) => {
    const lastChar = name[name.length - 1];
    const hasConsonant = lastChar && (lastChar.charCodeAt(0) - 0xac00) % 28 !== 0;
    return hasConsonant ? '을' : '를';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="w-[426px] max-w-[calc(100vw-32px)] p-6 bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[22px] font-semibold leading-[1.4] text-[#141414]">
            그룹 삭제
          </DialogTitle>
        </DialogHeader>

          <p className="text-[14px] leading-[1.4] text-[#6C7885]">
            {groupName}
            {getParticle(groupName)} 삭제하시겠습니까?
          </p>

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 border-[#CDD3DB] text-[#6C7885] font-semibold"
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-[#EF4444] text-white hover:bg-[#EF4444]/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

