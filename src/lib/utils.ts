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

// HTML 문자열에서 이미지 URL 추출
export function extractFirstImageUrl(content: string): string | null {
  try {
    // content가 이미 문자열이므로 바로 사용
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  } catch (error) {
    console.error('이미지 URL 추출 중 오류 발생:', error);
    return null;
  }
}

// HTML 태그를 제거하고 일부 텍스트만 추출
export function extractTextPreview(content: string, maxLength: number = 100): string {
  try {
    // HTML 태그 제거
    const textContent = content.replace(/<[^>]+>/g, '');
    // 지정된 길이로 자르기
    return textContent.length > maxLength
      ? textContent.slice(0, maxLength) + '...'
      : textContent;
  } catch (error) {
    console.error('텍스트 미리보기 생성 중 오류 발생:', error);
    return '';
  }
}