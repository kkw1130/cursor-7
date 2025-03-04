import { notFound } from 'next/navigation';
import { getDiaryById } from '@/lib/diary';
import { DiaryForm } from '@/components/diary/DiaryForm';

interface EditDiaryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDiaryPage({ params }: EditDiaryPageProps) {
  try {
    // Next.js 15에서는 params가 Promise이므로 await 사용
    const { id } = await params;
    
    // 다이어리 데이터 가져오기
    const diary = await getDiaryById(id);

    return (
      <main className="container mx-auto py-6 px-4 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">일기 수정</h1>
        <DiaryForm diary={diary} isEditing={true} />
      </main>
    );
  } catch (error) {
    console.error('다이어리 조회 오류:', error);
    notFound();
  }
} 