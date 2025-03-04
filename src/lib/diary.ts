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