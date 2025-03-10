import { supabase } from './supabase';

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
  try {
    // 먼저 데이터가 존재하는지 확인
    const { data: exists, error: existsError } = await supabase
      .from('diary')
      .select('id')
      .eq('id', id);

    if (existsError) {
      throw new Error(`다이어리 조회 실패: ${existsError.message}`);
    }

    if (!exists || exists.length === 0) {
      throw new Error(`ID가 ${id}인 다이어리를 찾을 수 없습니다.`);
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
  } catch (error) {
    console.error(`ID ${id}로 다이어리 조회 중 오류 발생:`, error);
    throw error;
  }
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