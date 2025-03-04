import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDiaryById } from '@/lib/diary';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Trash } from 'lucide-react';

interface DiaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiaryPage({ params }: DiaryPageProps) {
  try {
    // Next.js 15에서는 params가 Promise이므로 await 사용
    const { id } = await params;
    
    // 다이어리 데이터 가져오기
    const diary = await getDiaryById(id);

    return (
      <main className="container mx-auto py-6 px-4 md:px-6 max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              목록으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{diary.title}</h1>
              <p className="text-muted-foreground">
                {formatDate(diary.diary_date)} {diary.emotion} {diary.weather}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/diary/${diary.id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  수정
                </Button>
              </Link>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash className="h-4 w-4" />
                삭제
              </Button>
            </div>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: diary.content }} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    notFound();
  }
} 