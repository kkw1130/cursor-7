import { supabase } from './supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type Diary = {
  id: string;
  title: string;
  content: string;
  emotion: string;
  weather: string;
  created_at: string;
  updated_at: string;
  diary_date: string;
};

export async function createDiary(data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather'>) {
  // 현재 시간을 한국 시간으로 변환 (UTC+9)
  const now = new Date();
  const koreanDate = format(now, 'yyyy-MM-dd', { locale: ko });

  const { data: diary, error } = await supabase
    .from('diary')
    .insert([
      {
        ...data,
        diary_date: koreanDate,
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
export async function getDiaries(searchTerm?: string) {
  try {
    // 기본 쿼리 설정
    let query = supabase
      .from('diary')
      .select('*')
      .order('created_at', { ascending: false });

    // 검색어가 있는 경우 제목 필드에서만 검색
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`다이어리 목록 조회 실패: ${error.message}`);
    }
    return data as Diary[];
  } catch (error) {
    console.error('다이어리 검색 중 오류 발생:', error);
    throw new Error(`다이어리 목록을 가져오는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

// 특정 다이어리를 ID로 가져오는 함수
export async function getDiaryById(id: string) {
    // 먼저 데이터가 존재하는지 확인
    const { data: exists, error: existsError } = await supabase
      .from('diary')
      .select('id')
      .eq('id', id);

    if (existsError) {
      throw new Error(`다이어리 조회 실패: ${existsError.message}`);
    }

    if (!exists || exists.length === 0) {
      return null;
    }

    // 데이터가 존재하면 전체 데이터 조회
    const { data, error } = await supabase
      .from('diary')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single();

    if (error) {
      throw new Error(`다이어리 조회 실패: ${error.message}`);
    }

    return data as Diary;
  
}

// 다이어리 수정 함수
export async function updateDiary(
  id: string, 
  data: Pick<Diary, 'title' | 'content' | 'emotion' | 'weather' | 'diary_date'>
) {
  const now = new Date();
  const koreanDate = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", { locale: ko });

  const { data: diary, error } = await supabase
    .from('diary')
    .update({
      ...data,
      updated_at: koreanDate,
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

// 특정 날짜의 다이어리를 가져오는 함수
export async function getDiaryByDate(date: string) {
  const { data, error } = await supabase
    .from('diary')
    .select('*')
    .eq('diary_date', date)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Diary[];
}

// 일기가 있는 날짜 목록을 가져오는 함수
export async function getDiaryDates() {
  const { data, error } = await supabase
    .from('diary')
    .select('diary_date')
    .order('diary_date', { ascending: true });

  if (error) {
    throw error;
  }

  // 중복 날짜 제거
  const uniqueDates = [...new Set(data.map(item => item.diary_date))];
  return uniqueDates;
}

interface DiaryFormState {
  title: string;
  content: string;
  emotion: string;
  weather: string;
  diaryDate: string;
  isSubmitting: boolean;
} 