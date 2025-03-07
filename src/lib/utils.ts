import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷팅 함수
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 감정 이모티콘 매핑
export const EMOTIONS = [
  { value: 'happy', label: '😊 행복', icon: '😊' },
  { value: 'sad', label: '😢 슬픔', icon: '😢' },
  { value: 'angry', label: '😠 화남', icon: '😠' },
  { value: 'peaceful', label: '😌 평온', icon: '😌' },
  { value: 'excited', label: '🤗 설렘', icon: '🤗' },
  { value: 'tired', label: '😫 피곤', icon: '😫' },
];

// 날씨 이모티콘 매핑
export const WEATHER = [
  { value: 'sunny', label: '☀️ 맑음', icon: '☀️' },
  { value: 'cloudy', label: '☁️ 흐림', icon: '☁️' },
  { value: 'rainy', label: '🌧️ 비', icon: '🌧️' },
  { value: 'snowy', label: '🌨️ 눈', icon: '🌨️' },
  { value: 'windy', label: '💨 바람', icon: '💨' },
];

// 감정 이모티콘 가져오기
export function getEmotionIcon(emotionValue: string): string {
  const emotion = EMOTIONS.find(e => e.value === emotionValue);
  return emotion ? emotion.icon : '';
}

// 날씨 이모티콘 가져오기
export function getWeatherIcon(weatherValue: string): string {
  const weather = WEATHER.find(w => w.value === weatherValue);
  return weather ? weather.icon : '';
}
