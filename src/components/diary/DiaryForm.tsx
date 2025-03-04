'use client';

import { useReducer, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { Diary } from '@/lib/diary';
import { createDiaryAction, updateDiaryAction } from '@/app/actions';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EMOTIONS = [
  { value: 'happy', label: '😊 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😠 화남' },
  { value: 'peaceful', label: '😌 평온' },
  { value: 'excited', label: '🤗 설렘' },
  { value: 'tired', label: '😫 피곤' },
];

const WEATHER = [
  { value: 'sunny', label: '☀️ 맑음' },
  { value: 'cloudy', label: '☁️ 흐림' },
  { value: 'rainy', label: '🌧️ 비' },
  { value: 'snowy', label: '🌨️ 눈' },
  { value: 'windy', label: '💨 바람' },
];

interface DiaryFormProps {
  diary?: Diary;
  isEditing?: boolean;
}

// 상태 타입 정의
interface DiaryFormState {
  title: string;
  content: string;
  emotion: string;
  weather: string;
  diaryDate: string;
  isSubmitting: boolean;
}

// 액션 타입 정의
type DiaryFormAction =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'SET_EMOTION'; payload: string }
  | { type: 'SET_WEATHER'; payload: string }
  | { type: 'SET_DIARY_DATE'; payload: string }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_DIARY'; payload: Diary };

// 리듀서 함수
function diaryFormReducer(state: DiaryFormState, action: DiaryFormAction): DiaryFormState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, title: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload };
    case 'SET_EMOTION':
      return { ...state, emotion: action.payload };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload };
    case 'SET_DIARY_DATE':
      return { ...state, diaryDate: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET_FORM':
      return {
        title: '',
        content: '',
        emotion: '',
        weather: '',
        diaryDate: new Date().toISOString().split('T')[0],
        isSubmitting: false,
      };
    case 'LOAD_DIARY':
      return {
        title: action.payload.title,
        content: action.payload.content,
        emotion: action.payload.emotion,
        weather: action.payload.weather,
        diaryDate: action.payload.diary_date,
        isSubmitting: false,
      };
    default:
      return state;
  }
}

export function DiaryForm({ diary, isEditing = false }: DiaryFormProps) {
  const router = useRouter();
  
  // 초기 상태 설정
  const initialState: DiaryFormState = {
    title: diary?.title || '',
    content: diary?.content || '',
    emotion: diary?.emotion || '',
    weather: diary?.weather || '',
    diaryDate: diary?.diary_date || new Date().toISOString().split('T')[0],
    isSubmitting: false,
  };
  
  const [state, dispatch] = useReducer(diaryFormReducer, initialState);
  const { title, content, emotion, weather, diaryDate, isSubmitting } = state;

  // 수정 모드에서 초기 데이터 설정
  useEffect(() => {
    if (diary && isEditing) {
      dispatch({ type: 'LOAD_DIARY', payload: diary });
    }
  }, [diary, isEditing]);

  // 폼 유효성 검사
  const isFormValid = () => {
    if (!title || !content || !emotion || !weather) {
      toast.error('모든 필드를 입력해주세요.');
      return false;
    }
    return true;
  };

  // 일기 저장 처리
  const handleSaveDiary = async () => {
    try {
      if (isEditing && diary) {
        // 서버 액션을 사용하여 일기 수정
        const result = await updateDiaryAction(diary.id, {
          title,
          content,
          emotion,
          weather,
          diary_date: diaryDate,
        });
        
        if (result.success) {
          toast.success('일기가 수정되었습니다.');
          router.push(`/diary/${diary.id}`);
          router.refresh();
        } else {
          toast.error(result.error || '일기 수정 중 오류가 발생했습니다.');
        }
      } else {
        // 서버 액션을 사용하여 새 일기 작성
        const result = await createDiaryAction({
          title,
          content,
          emotion,
          weather,
        });
        
        if (result.success) {
          toast.success('새 일기가 작성되었습니다.');
          router.push('/');
          router.refresh();
        } else {
          toast.error(result.error || '일기 작성 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('일기 저장 중 오류 발생:', error);
      toast.error('일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;
    
    dispatch({ type: 'SET_SUBMITTING', payload: true });
    await handleSaveDiary();
    dispatch({ type: 'SET_SUBMITTING', payload: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => dispatch({ type: 'SET_TITLE', payload: e.target.value })}
          required
          placeholder="일기 제목을 입력하세요"
          className="text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <div className="min-h-[300px] border rounded-lg overflow-hidden">
          <TiptapEditor 
            content={content} 
            onChange={(value) => dispatch({ type: 'SET_CONTENT', payload: value })} 
            diaryId={diary?.id}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>감정</Label>
          <Select 
            value={emotion} 
            onValueChange={(value) => dispatch({ type: 'SET_EMOTION', payload: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="감정을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {EMOTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>날씨</Label>
          <Select 
            value={weather} 
            onValueChange={(value) => dispatch({ type: 'SET_WEATHER', payload: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="날씨를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {WEATHER.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditing ? '수정 중...' : '저장 중...') : (isEditing ? '수정' : '저장')}
        </Button>
      </div>
    </form>
  );
} 