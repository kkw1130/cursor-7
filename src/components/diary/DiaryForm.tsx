'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { createDiary } from '@/lib/diary';
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

export function DiaryForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('');
  const [weather, setWeather] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !emotion || !weather) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createDiary({
        title,
        content,
        emotion,
        weather,
      });
      router.push('/');
    } catch (error) {
      console.error('일기 저장 중 오류 발생:', error);
      alert('일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="일기 제목을 입력하세요"
          className="text-lg"
        />
      </div>

      <div className="space-y-2">
        <Label>내용</Label>
        <div className="min-h-[300px] border rounded-lg overflow-hidden">
          <TiptapEditor content={content} onChange={setContent} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>감정</Label>
          <Select value={emotion} onValueChange={setEmotion}>
            <SelectTrigger>
              <SelectValue placeholder="감정을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {EMOTIONS.map((emotion) => (
                <SelectItem key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>날씨</Label>
          <Select value={weather} onValueChange={setWeather}>
            <SelectTrigger>
              <SelectValue placeholder="날씨를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {WEATHER.map((weather) => (
                <SelectItem key={weather.value} value={weather.value}>
                  {weather.label}
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
          {isSubmitting ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
} 