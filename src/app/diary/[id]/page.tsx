import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDiaryById } from '@/lib/diary';
import { Button } from '@/components/ui/button';
import { formatDate, getEmotionIcon, getWeatherIcon } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import DeleteDiaryButton from '@/components/diary/DeleteDiaryButton';

interface DiaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DiaryPage({ params }: DiaryPageProps) {
  // Next.js 15에서는 params가 Promise이므로 await 사용
  const { id } = await params;

  // 다이어리 데이터 가져오기
  const result = await getDiaryById(id);

  if (result.error === 'NOT_FOUND') {
    notFound();
  }

  if (result.error) {
    throw new Error(result.message || '다이어리를 불러오는데 실패했습니다');
  }

  // 타입 안전성 확보
  const diary = result.data!;
  
  // 감정과 날씨 이모티콘 가져오기
  const emotionIcon = getEmotionIcon(diary.emotion);
  const weatherIcon = getWeatherIcon(diary.weather);

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
            <div className="flex items-center text-muted-foreground">
              <span>{formatDate(diary.diary_date)}</span>
              <div className="flex items-center ml-3 space-x-2">
                {emotionIcon && (
                  <div className="flex items-center gap-1" title={`감정: ${diary.emotion}`}>
                    <span className="text-xl">{emotionIcon}</span>
                  </div>
                )}
                {weatherIcon && (
                  <div className="flex items-center gap-1" title={`날씨: ${diary.weather}`}>
                    <span className="text-xl">{weatherIcon}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/diary/${diary.id}/edit`}>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                수정
              </Button>
            </Link>
            <DeleteDiaryButton id={diary.id} />
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: diary.content }} />
      </div>
    </main>
  );
} 