import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
// 환경 변수에서 URL과 익명 키를 가져옵니다
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 클라이언트 인스턴스 생성
export const supabase = createClient(supabaseUrl, supabaseKey);

// 타입 안전성을 위한 데이터베이스 타입 정의
export type Diary = {
  id: string;
  title: string;
  content: string | any; // Tiptap 에디터 내용 (JSON 또는 텍스트)
  emotion: string;
  weather: string;
  created_at: string;
  updated_at: string;
  diary_date: string;
};

// 이미지 업로드 관련 유틸리티 함수
export const uploadImage = async (file: File, diaryId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${diaryId}/${fileName}`;

    // 이미지 업로드
    const { error: uploadError } = await supabase.storage
      .from('diary-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('이미지 업로드 오류:', uploadError);
      return null;
    }

    // 이미지 URL 가져오기
    const { data } = supabase.storage
      .from('diary-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    return null;
  }
}; 