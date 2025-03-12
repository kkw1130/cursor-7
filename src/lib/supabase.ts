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
  content: Record<string, any>;
  emotion: string;
  weather: string;
  created_at: string;
  updated_at: string;
  diary_date: string;
};
