import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Diary } from '@/lib/diary';

// 다이어리 내용에서 첫 번째 이미지 URL을 추출하는 함수
function extractFirstImageUrl(content: string): string | null {
  try {
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('이미지 추출 중 오류:', error);
    return null;
  }
}

// HTML 태그를 제거하고 일부 텍스트만 추출하는 함수
function extractTextPreview(content: string, maxLength: number = 100): string {
  try {
    // HTML 태그 제거
    const text = content.replace(/<[^>]*>/g, '');
    // 텍스트 길이 제한
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  } catch (error) {
    console.error('텍스트 추출 중 오류:', error);
    return '';
  }
}

interface DiaryCardProps {
  diary: Diary;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const imageUrl = extractFirstImageUrl(diary.content);
  const textPreview = extractTextPreview(diary.content);

  return (
    <Link href={`/diary/${diary.id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{diary.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDate(diary.diary_date)} {diary.emotion} {diary.weather}
          </p>
        </CardHeader>
        <CardContent className="flex-grow">
          {imageUrl && (
            <div className="w-full h-40 mb-3 overflow-hidden rounded-md">
              <img 
                src={imageUrl} 
                alt={diary.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <p className="text-sm line-clamp-3">{textPreview}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">
            작성일: {formatDate(diary.created_at)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
} 