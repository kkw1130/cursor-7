import Link from 'next/link';
import { getDiaries } from '@/lib/diary';
import { DiaryCard } from '@/components/DiaryCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

/**
 * 메인 페이지 컴포넌트
 */
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchTerm = params.search || '';

  const result = await getDiaries(searchTerm);

  if (result.error) {
    throw new Error(result.message || '다이어리 목록을 불러오는데 실패했습니다');
  }

  const diaries = result.data || [];

  return (
    <main className='container mx-auto py-6 px-4 md:px-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>나의 다이어리</h1>
        <Link href='/new'>
          <Button className='flex items-center gap-2'>
            <PlusCircle className='h-4 w-4' />새 일기 작성
          </Button>
        </Link>
      </div>

      {/* 검색 결과 표시 */}
      {searchTerm && (
        <div className='mb-6'>
          <p className='text-muted-foreground'>
            {`"${searchTerm}" 검색 결과: ${diaries.length}개의 일기`}
          </p>
        </div>
      )}

      {diaries.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-xl font-medium mb-4'>
            {searchTerm ? '검색 결과가 없습니다' : '작성된 일기가 없습니다'}
          </h2>
          <p className='text-muted-foreground mb-6'>
            {searchTerm ? '다른 검색어로 다시 시도해보세요' : '첫 번째 일기를 작성해보세요'}
          </p>
          <Link href='/new'>
            <Button>새 일기 작성하기</Button>
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {diaries.map((diary) => (
            <DiaryCard key={diary.id} diary={diary} />
          ))}
        </div>
      )}
    </main>
  );
}
