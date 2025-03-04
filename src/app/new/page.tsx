import { DiaryForm } from '@/components/diary/DiaryForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewDiaryPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">새 일기 작성</h1>
      </div>
      <div className="border rounded-lg p-6">
        <DiaryForm />
      </div>
    </div>
  );
} 