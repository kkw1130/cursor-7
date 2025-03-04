import { supabase } from './supabase';

export interface Diary {
  id: string;
  title: string;
  content: string;
  emotion: string;
  weather: string;
  created_at: string;
  updated_at: string;
  diary_date: string;
}

export async function createDiary(data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather'>) {
  const { data: diary, error } = await supabase
    .from('diary')
    .insert([
      {
        ...data,
        diary_date: new Date().toISOString().split('T')[0],
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return diary;
}

// 모든 다이어리 목록을 가져오는 함수
export async function getDiaries() {
  const { data, error } = await supabase
    .from('diary')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Diary[];
}

// 특정 다이어리를 ID로 가져오는 함수
export async function getDiaryById(id: string) {
  const { data, error } = await supabase
    .from('diary')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Diary;
}

// 다이어리 수정 함수
export async function updateDiary(
  id: string, 
  data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather' | 'diary_date'>
) {
  const { data: diary, error } = await supabase
    .from('diary')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return diary;
}

// 다이어리 삭제 함수
export async function deleteDiary(id: string) {
  const { error } = await supabase
    .from('diary')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
} 