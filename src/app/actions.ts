'use server';

import { revalidatePath } from 'next/cache';
import { updateDiary, deleteDiary, createDiary } from '@/lib/diary';
import { Diary } from '@/lib/diary';

// 새 일기 작성 서버 액션
export async function createDiaryAction(
  data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather'>
) {
  try {
    const diary = await createDiary(data);
    revalidatePath('/');
    revalidatePath(`/diary/${diary.id}`);
    return { success: true, id: diary.id };
  } catch (error) {
    console.error('일기 작성 중 오류 발생:', error);
    return { success: false, error: '일기 작성 중 오류가 발생했습니다.' };
  }
}

// 일기 수정 서버 액션
export async function updateDiaryAction(
  id: string,
  data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather' | 'diary_date'>
) {
  try {
    await updateDiary(id, data);
    revalidatePath('/');
    revalidatePath(`/diary/${id}`);
    return { success: true, id };
  } catch (error) {
    console.error('일기 수정 중 오류 발생:', error);
    return { success: false, error: '일기 수정 중 오류가 발생했습니다.' };
  }
}

// 일기 삭제 서버 액션
export async function deleteDiaryAction(id: string) {
  try {
    await deleteDiary(id);
    revalidatePath('/');
    // 리다이렉트 정보를 반환
    return { success: true, redirect: '/' };
  } catch (error) {
    console.error('일기 삭제 중 오류 발생:', error);
    return { success: false, error: '일기 삭제 중 오류가 발생했습니다.' };
  }
} 