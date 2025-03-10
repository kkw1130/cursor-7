// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('홈 페이지 에러:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-xl font-bold mb-4">
        다이어리 목록을 불러오는데 실패했습니다
      </h2>
      <p className="text-muted-foreground mb-6">
        {error.message || '알 수 없는 오류가 발생했습니다'}
      </p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}