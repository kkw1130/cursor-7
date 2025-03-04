"use client";

import { useState } from "react";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

/**
 * 캘린더 선택 컴포넌트
 */
export function CalendarPicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
          onSelect={setDate}
          locale={ko}
          className="border rounded-md scale-[0.85] origin-top"
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        />
      </div>
    </div>
  );
} 