// app/diary/[id]/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DiaryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('다이어리 에러:', error);
  }, [error]);

  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-xl font-bold mb-4">
        {error.message || '오류가 발생했습니다'}
      </h2>
      <div className="flex justify-center gap-4">
        <Button onClick={reset}>다시 시도</Button>
        <Link href="/">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>
    </div>
  );
}