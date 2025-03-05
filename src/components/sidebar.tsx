"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, PenSquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CalendarPicker } from "@/components/calendar-picker";
import { SearchBar } from "@/components/SearchBar";

/**
 * 사이드바 컴포넌트
 * 네비게이션, 검색, 달력, 다크/라이트 모드 토글 기능을 포함
 */
export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={`h-screen flex flex-col border-r p-4 w-72 ${className}`}>
      {/* 로고 및 타이틀 */}
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">다이어리</h1>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="space-y-2 mb-6">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start">
            <Search className="mr-2 h-4 w-4" />
            홈
          </Button>
        </Link>
        <Link href="/new">
          <Button variant="ghost" className="w-full justify-start">
            <PenSquare className="mr-2 h-4 w-4" />
            새 일기 작성
          </Button>
        </Link>
      </nav>

      {/* 검색 영역 */}
      <SearchBar />

      {/* 달력 영역 */}
      <div className="mb-6 overflow-visible">
        <h2 className="text-sm font-semibold mb-2">달력</h2>
        <CalendarPicker />
      </div>

      {/* 다크/라이트 모드 토글 */}
      <div className="mt-auto pt-4">
        <div className="flex items-center">
          <span className="text-sm mr-2">테마:</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

/**
 * 모바일용 사이드바 컴포넌트
 */
export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 overflow-y-auto w-80 max-w-[90vw]">
        <Sidebar className="w-full" />
      </SheetContent>
    </Sheet>
  );
} 