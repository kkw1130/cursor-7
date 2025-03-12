'use server';

import { revalidatePath } from 'next/cache';
import { updateDiary, deleteDiary, createDiary, Diary } from '@/lib/diary';

export type ServerDiary = Partial<Omit<Diary, 'content'>> & {
  content: string;
  title: string;
  emotion: string;
  weather: string;
};

const sanitizeContent = (content: Record<string, any>) => {
  return JSON.parse(JSON.stringify(content));
};

// 새 일기 작성 서버 액션
export async function createDiaryAction(data: ServerDiary) {
  const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
  data.content = sanitizeContent(content);
  const result = await createDiary(data);

  if (result.error) {
    return {
      success: false,
      error: result.message || '일기 작성 중 오류가 발생했습니다.',
    };
  }

  revalidatePath('/');

  return {
    success: true,
    id: result.data?.id || '',
  };
}

// 일기 수정 서버 액션
export async function updateDiaryAction(id: string, data: ServerDiary) {
  const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
  data.content = sanitizeContent(content);
  const result = await updateDiary(id, data);

  if (result.error) {
    console.error('일기 수정 중 오류 발생:', result.message);
    return {
      success: false,
      error: result.message || '일기 수정 중 오류가 발생했습니다.',
    };
  }

  revalidatePath('/');
  revalidatePath(`/diary/${id}`);

  return {
    success: true,
    id: result.data?.id || id,
  };
}

// 일기 삭제 서버 액션
export async function deleteDiaryAction(id: string) {
  const result = await deleteDiary(id);

  if (result.error) {
    console.error('일기 삭제 중 오류 발생:', result.message);
    return {
      success: false,
      error: result.message || '일기 삭제 중 오류가 발생했습니다.',
    };
  }

  revalidatePath('/', 'layout');

  return {
    success: true,
    deletedId: id,
  };
}
