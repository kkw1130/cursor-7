import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getEmotionIcon, getWeatherIcon, extractFirstImageUrl, extractTextPreview } from '@/lib/utils';
import { Diary } from '@/lib/diary';

interface DiaryCardProps {
  diary: Diary;
}

export function DiaryCard({ diary }: DiaryCardProps) {
  const imageUrl = extractFirstImageUrl(diary.content);
  const textPreview = extractTextPreview(diary.content);
  const emotionIcon = getEmotionIcon(diary.emotion);
  const weatherIcon = getWeatherIcon(diary.weather);

  return (
    <Link href={`/diary/${diary.id}`} className="block h-full">
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{diary.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>{formatDate(diary.diary_date)}</span>
            <div className="flex items-center ml-2 space-x-2">
              {emotionIcon && (
                <span className="flex items-center" title={diary.emotion}>
                  <span className="text-lg">{emotionIcon}</span>
                </span>
              )}
              {weatherIcon && (
                <span className="flex items-center" title={diary.weather}>
                  <span className="text-lg">{weatherIcon}</span>
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          {imageUrl && (
            <div className="w-full h-40 mb-3 overflow-hidden rounded-md">
              <Image 
                src={imageUrl} 
                alt={diary.title} 
                width={400}
                height={300}
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