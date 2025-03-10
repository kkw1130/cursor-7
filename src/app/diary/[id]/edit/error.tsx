'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function EditDiaryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('일기 수정 페이지 에러:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-xl font-bold mb-4">
        일기를 수정하는 중 문제가 발생했습니다
      </h2>
      <p className="text-muted-foreground mb-6">
        {error.message || '알 수 없는 오류가 발생했습니다'}
      </p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => window.history.back()}>
          이전으로 돌아가기
        </Button>
        <Button onClick={reset} variant="outline">
          다시 시도
        </Button>
      </div>
    </div>
  );
} 