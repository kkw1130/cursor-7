import { supabase } from './supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export type Diary = {
  id: string;
  title: string;
  content: Record<string, any>;
  emotion: string;
  weather: string;
  created_at: string;
  updated_at: string;
  diary_date: string;
};

export type ServerDiary = Partial<Omit<Diary, 'content'>> & {
  content: string;
  title: string;
  emotion: string;
  weather: string;
  diary_date: string;
};

export async function createDiary(data: ServerDiary) {
  try {
    const now = new Date();
    const koreanDate = format(now, 'yyyy-MM-dd', { locale: ko });

    const { data: diary, error } = await supabase
      .from('diary')
      .insert([
        {
          title: data.title,
          content: data.content,
          emotion: data.emotion,
          weather: data.weather,
          diary_date: koreanDate,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { data: diary as Diary };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '다이어리 생성 중 오류가 발생했습니다' };
  }
}

// 모든 다이어리 목록을 가져오는 함수
export async function getDiaries(searchTerm?: string) {
  try {
    let query = supabase.from('diary').select('*').order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { data: data as Diary[] };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '다이어리 목록을 불러오는데 실패했습니다' };
  }
}

// 특정 다이어리를 ID로 가져오는 함수
export async function getDiaryById(id: string) {
  try {
    const { data: exists, error: existsError } = await supabase
      .from('diary')
      .select('id')
      .eq('id', id);

    if (existsError) {
      return { error: 'DATABASE_ERROR', message: existsError.message };
    }

    if (!exists || exists.length === 0) {
      return { error: 'NOT_FOUND', message: '다이어리를 찾을 수 없습니다' };
    }

    const { data, error } = await supabase.from('diary').select('*').eq('id', id).single();

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { data: data as Diary };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '다이어리를 불러오는데 실패했습니다' };
  }
}

// 다이어리 수정 함수
export async function updateDiary(id: string, data: ServerDiary) {
  try {
    const { data: diary, error } = await supabase
      .from('diary')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { data: diary as Diary };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '다이어리 수정 중 오류가 발생했습니다' };
  }
}

// 다이어리 삭제 함수
export async function deleteDiary(id: string) {
  try {
    const { error } = await supabase.from('diary').delete().eq('id', id);

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { success: true };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '다이어리 삭제 중 오류가 발생했습니다' };
  }
}

// 특정 날짜의 다이어리를 가져오는 함수
export async function getDiaryByDate(date: string) {
  try {
    const { data, error } = await supabase
      .from('diary')
      .select('*')
      .eq('diary_date', date)
      .order('created_at', { ascending: false });

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    return { data: data as Diary[] };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '해당 날짜의 다이어리를 불러오는데 실패했습니다' };
  }
}

// 일기가 있는 날짜 목록을 가져오는 함수
export async function getDiaryDates() {
  try {
    const { data, error } = await supabase
      .from('diary')
      .select('diary_date')
      .order('diary_date', { ascending: true });

    if (error) {
      return { error: 'DATABASE_ERROR', message: error.message };
    }

    // 중복 날짜 제거
    const uniqueDates = [...new Set(data.map((item) => item.diary_date))];
    return { data: uniqueDates };
  } catch {
    return { error: 'UNKNOWN_ERROR', message: '날짜 목록을 불러오는데 실패했습니다' };
  }
}

// 폼 상태 인터페이스
export interface DiaryFormState {
  title: string;
  content: Record<string, any>;
  emotion: string;
  weather: string;
  diaryDate: string;
  isSubmitting: boolean;
}
