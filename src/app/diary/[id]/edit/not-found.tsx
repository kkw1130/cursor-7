import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditDiaryNotFound() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-xl font-bold mb-4">
        수정할 일기를 찾을 수 없습니다
      </h2>
      <p className="text-muted-foreground mb-6">
        해당 일기가 삭제되었거나 존재하지 않습니다
      </p>
      <Link href="/">
        <Button>
          메인으로 돌아가기
        </Button>
      </Link>
    </div>
  );
} 