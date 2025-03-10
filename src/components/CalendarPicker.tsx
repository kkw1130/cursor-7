"use client";

import { useState, useEffect } from "react";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { getDiaryByDate, getDiaryDates, Diary } from "@/lib/diary";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { DiaryDateSelector } from "@/components/diary/DiaryDateSelector";

/**
 * 캘린더 선택 컴포넌트
 * 일기가 있는 날짜는 점으로 표시하고, 날짜 클릭 시 해당 일기로 이동
 * 하루에 여러 개의 일기가 있을 경우 선택 모달 표시
 */
export function CalendarPicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [diaryDates, setDiaryDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiaries, setSelectedDiaries] = useState<Diary[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();
  // 일기가 있는 날짜 목록 가져오기
  useEffect(() => {
    async function fetchDiaryDates() {
      try {
        const result = await getDiaryDates();
        
        if (result.error) {
          toast.error(result.message || "일기 날짜를 불러오는데 실패했습니다.");
          return;
        }

        setDiaryDates(result.data ?? []);
      } catch (error) {
        console.error("일기 날짜 가져오기 오류:", error);
        toast.error("일기 날짜를 불러오는데 실패했습니다.");
      }
    }

    fetchDiaryDates();
  }, [pathname]);

  // 날짜 선택 시 해당 날짜의 일기로 이동
  const handleDateSelect = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    setDate(selectedDate);
    setIsLoading(true);
    
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const result = await getDiaryByDate(formattedDate);
      
      if (result.error) {
        toast.error(result.message || "일기를 불러오는데 실패했습니다.");
        return;
      }

      const diaries = result.data ?? [];
      
      if (diaries.length > 0) {
        if (diaries.length === 1) {
          // 일기가 하나만 있으면 바로 이동
          router.push(`/diary/${diaries[0].id}`);
        } else {
          // 여러 개의 일기가 있으면 모달 표시
          setSelectedDiaries(diaries);
          setSelectedDate(selectedDate);
          setIsModalOpen(true);
        }
      } else {
        toast.info("선택한 날짜에 작성된 일기가 없습니다.");
      }
    } catch (error) {
      console.error("일기 가져오기 오류:", error);
      toast.error("일기를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 일기가 있는 날짜에 점 표시를 위한 CSS 클래스 추가
  const modifiers = {
    hasDiary: (date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      return diaryDates.includes(formattedDate);
    }
  };

  // 일기가 없는 날짜는 비활성화
  const disabledDays = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return (
      date > new Date() || 
      date < new Date("1900-01-01") || 
      (!diaryDates.includes(formattedDate) && date <= new Date())
    );
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">
        {date ? (
          <p>선택된 날짜: {format(date, "PPP", { locale: ko })}</p>
        ) : (
          <p>날짜를 선택하세요</p>
        )}
      </div>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          locale={ko}
          className="origin-top"
          disabled={disabledDays}
          modifiers={modifiers}
          modifiersClassNames={{
            hasDiary: "relative before:absolute before:bottom-1 before:left-1/2 before:-translate-x-1/2 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full"
          }}
        />
      </div>
      {isLoading && <p className="text-sm text-center text-muted-foreground">로딩 중...</p>}
      
      {/* 여러 개의 일기가 있을 때 선택 모달 */}
      {selectedDate && (
        <DiaryDateSelector
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          diaries={selectedDiaries}
          date={selectedDate}
        />
      )}
    </div>
  );
} 