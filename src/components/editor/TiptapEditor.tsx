'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered 
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  diaryId?: string;
}

export function TiptapEditor({ content, onChange, diaryId }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const tempDiaryId = diaryId || `temp-${Date.now()}`;

  // 이미지 업로드 처리 함수
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      // 파일 이름 생성
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${tempDiaryId}/${fileName}`;
      
      // Supabase Storage에 직접 업로드
      const { data, error } = await supabase.storage
        .from('diary-images')
        .upload(filePath, file);
      
      if (error) {
        console.error('이미지 업로드 오류:', error);
        toast.error('이미지 업로드 실패', {
          description: error.message,
        });
        return null;
      }
      
      // 이미지 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('diary-images')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
      toast.error('이미지 업로드 실패', {
        description: '이미지를 업로드하는 중 오류가 발생했습니다.',
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none p-4 min-h-[250px] focus:outline-none'
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const files = Array.from(event.dataTransfer.files);
          const imageFiles = files.filter(file => file.type.startsWith('image/'));
          
          if (imageFiles.length > 0) {
            event.preventDefault();
            
            // 각 이미지 파일 처리
            imageFiles.forEach(async (file) => {
              const imageUrl = await handleImageUpload(file);
              if (imageUrl) {
                // 에디터에 이미지 삽입
                editor?.chain().focus().setImage({ src: imageUrl }).run();
                toast.success('이미지 업로드 완료');
              }
            });
            
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const files = Array.from(event.clipboardData.files);
          const imageFiles = files.filter(file => file.type.startsWith('image/'));
          
          if (imageFiles.length > 0) {
            event.preventDefault();
            
            // 각 이미지 파일 처리
            imageFiles.forEach(async (file) => {
              const imageUrl = await handleImageUpload(file);
              if (imageUrl) {
                // 에디터에 이미지 삽입
                editor?.chain().focus().setImage({ src: imageUrl }).run();
                toast.success('이미지 업로드 완료');
              }
            });
            
            return true;
          }
        }
        return false;
      }
    },
    // SSR 하이드레이션 불일치 문제 해결을 위한 설정
    immediatelyRender: false
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
      {isUploading && (
        <div className="mt-2 text-sm text-muted-foreground">
          이미지 업로드 중...
        </div>
      )}
      <div className="mt-2 text-xs text-muted-foreground">
        이미지는 드래그 앤 드롭하거나 클립보드에서 붙여넣기(Ctrl+V)로 추가할 수 있습니다.
      </div>
    </div>
  );
} 