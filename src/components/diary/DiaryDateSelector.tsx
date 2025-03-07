"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Diary } from "@/lib/diary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

interface DiaryDateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  diaries: Diary[];
  date: Date;
}

/**
 * 날짜별 일기 선택 모달 컴포넌트
 * 특정 날짜에 여러 개의 일기가 있을 때 사용자가 선택할 수 있는 모달
 */
export function DiaryDateSelector({
  isOpen,
  onClose,
  diaries,
  date,
}: DiaryDateSelectorProps) {
  const router = useRouter();
  
  // 일기 선택 시 해당 일기 페이지로 이동
  const handleSelectDiary = (id: string) => {
    router.push(`/diary/${id}`);
    onClose();
  };

  // 일기 작성 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "a h:mm", { locale: ko });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {format(date, "yyyy년 MM월 dd일", { locale: ko })}의 일기
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4 text-center">
            이 날짜에 작성된 {diaries.length}개의 일기가 있습니다.
            <br />
            확인하실 일기를 선택해주세요.
          </p>
          <div className="space-y-2">
            {diaries.map((diary) => (
              <Button
                key={diary.id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3 px-4"
                onClick={() => handleSelectDiary(diary.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium">{diary.title}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(diary.created_at)}
                    <span className="mx-2">•</span>
                    <span>{diary.emotion} {diary.weather}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 