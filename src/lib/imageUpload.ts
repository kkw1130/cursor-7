import { supabase } from '@/lib/supabase';
import { ImageUploadResponse } from '@/types/image';

/**
 * 이미지 파일을 Supabase Storage에 업로드하고 URL을 반환하는 함수
 * @param file 업로드할 이미지 파일
 * @returns 업로드된 이미지의 URL과 경로
 */
export const uploadImageToSupabase = async (file: File): Promise<ImageUploadResponse> => {
  // 이미지 파일 검증
  if (!file.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드 가능합니다.');
  }

  // 파일 크기 제한 (5MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('이미지 크기는 5MB 이하여야 합니다.');
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from('diary-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('diary-images')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      path: filePath
    };
  } catch (error) {
    console.error('이미지 업로드 에러:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}; 