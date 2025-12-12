import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";

export default function GroupAddModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        recharge_date: "1"
    });

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: "",
                amount: "",
                recharge_date: "1"
            });
        }
    }, [isOpen]);

    const isValid = formData.name.trim() !== "" && formData.amount !== "" && formData.recharge_date !== "";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            onSubmit({
                ...formData,
                amount: Number(formData.amount)
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] p-6 bg-white rounded-2xl">
                <DialogHeader className="mb-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold text-gray-900">그룹 추가</DialogTitle>
                        <div className="bg-slate-700 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center h-6 w-6">
                            잼플
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-bold text-gray-900">그룹명</Label>
                        <div className="relative">
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="그룹명을 입력하세요"
                                className="pr-10 h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                                autoFocus
                            />
                            {formData.name && (
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, name: "" })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount" className="text-sm font-bold text-gray-900">충전 포인트</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => {
                                // Only allow numbers
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setFormData({ ...formData, amount: value });
                            }}
                            placeholder="0"
                            className="h-12 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="recharge_date" className="text-sm font-bold text-gray-900">충전일</Label>
                        <Select
                            value={formData.recharge_date}
                            onValueChange={(value) => setFormData({ ...formData, recharge_date: value })}
                        >
                            <SelectTrigger className="h-12 border-gray-200 focus:ring-gray-900">
                                <SelectValue placeholder="충전일 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">매월 1일</SelectItem>
                                <SelectItem value="15">매월 15일</SelectItem>
                                <SelectItem value="end">매월 말일</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 border-gray-200 hover:bg-gray-50 text-gray-600"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className={`flex-1 h-12 font-bold transition-colors ${
                                isValid 
                                    ? "bg-gray-200 hover:bg-gray-300 text-gray-900" // Using gray as per screenshot "생성" button look
                                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            생성
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}