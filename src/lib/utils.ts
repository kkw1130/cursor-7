import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { EMOTIONS, WEATHER } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

// 감정 이모티콘 가져오기
export function getEmotionIcon(emotionValue: string): string {
  const emotion = EMOTIONS.find((e) => e.value === emotionValue);
  return emotion ? emotion.icon : '';
}

// 날씨 이모티콘 가져오기
export function getWeatherIcon(weatherValue: string): string {
  const weather = WEATHER.find((w) => w.value === weatherValue);
  return weather ? weather.icon : '';
}

// ProseMirror 컨텐츠에서 이미지 URL 추출
export function extractFirstImageUrl(content: Record<string, any>): string | null {
  try {
    if (!content?.content) return null;

    // content 배열을 재귀적으로 순회하며 이미지 노드 찾기
    function findImageNode(nodes: any[]): any {
      for (const node of nodes) {
        if (node.type === 'image') {
          return node.attrs?.src || null;
        }
        if (node.content) {
          const found = findImageNode(node.content);
          if (found) return found;
        }
      }
      return null;
    }

    return findImageNode(content.content);
  } catch (error) {
    console.error('이미지 URL 추출 중 오류 발생:', error);
    return null;
  }
}

// ProseMirror 컨텐츠에서 텍스트 미리보기 추출
export function extractTextPreview(content: Record<string, any>, maxLength: number = 100): string {
  try {
    if (!content?.content) return '';

    // content 배열을 재귀적으로 순회하며 텍스트 추출
    function extractText(nodes: any[]): string {
      return nodes.reduce((text, node) => {
        if (node.type === 'text') {
          return text + node.text;
        }
        if (node.content) {
          return text + extractText(node.content);
        }
        return text;
      }, '');
    }

    const fullText = extractText(content.content);
    return fullText.length > maxLength ? fullText.slice(0, maxLength) + '...' : fullText;
  } catch (error) {
    console.error('텍스트 미리보기 생성 중 오류 발생:', error);
    return '';
  }
}
