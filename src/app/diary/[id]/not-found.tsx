import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DiaryNotFound() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-xl font-bold mb-4">
        존재하지 않는 다이어리입니다
      </h2>
      <p className="text-muted-foreground mb-6">
        삭제되었거나 잘못된 주소일 수 있습니다
      </p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}
