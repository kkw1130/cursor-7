"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

/**
 * 새 일기 작성 페이지 컴포넌트
 */
export default function NewDiaryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">새 일기 작성</h1>
      </div>

      <div className="border rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="일기 제목을 입력하세요"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            내용
          </label>
          <div className="border rounded-md p-3 min-h-[300px]">
            {/* 추후 Tiptap 에디터 구현 */}
            <p className="text-muted-foreground">에디터가 추후 구현될 예정입니다.</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                감정
              </label>
              <div className="border rounded-md p-2">
                <span className="text-muted-foreground">감정 선택 (추후 구현)</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                날씨
              </label>
              <div className="border rounded-md p-2">
                <span className="text-muted-foreground">날씨 선택 (추후 구현)</span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <Link href="/">
              <Button variant="outline">취소</Button>
            </Link>
            <Button>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 