'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImageToSupabase } from '@/lib/imageUpload';
import { extensions } from '@/lib/editor';

interface TiptapEditorProps {
  content: string | Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

export function TiptapEditor({ content = '', onChange }: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions,
    content: typeof content === 'string' ? content : content,
    onUpdate: ({ editor }) => {
      const jsonContent = editor.getJSON();
      onChange(jsonContent);
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-neutral dark:prose-invert max-w-none p-4 min-h-[250px] focus:outline-none',
      },
      handleDrop: (view, event, slice, moved) => {
        // 이미 이동된 요소거나 파일이 없으면 처리하지 않음
        if (moved || !event.dataTransfer?.files.length) return false;
        // 파일 처리를 위해 이벤트 기본 동작 방지
        event.preventDefault();

        const file = event.dataTransfer.files[0];
        if (!file?.type.startsWith('image/')) return false;

        // 토스트 알림 표시
        toast('이미지 업로드 중...');
        setIsUploading(true);

        // 비동기 처리를 위한 즉시 실행 함수
        (async () => {
          try {
            const { url } = await uploadImageToSupabase(file);
            if (editor) {
              const node = editor.schema.nodes.image.create({ src: url });
              editor.commands.insertContent(node);
              toast('업로드 완료', {
                description: '이미지가 성공적으로 추가되었습니다',
              });
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast('업로드 실패', {
                description: error.message,
              });
            }
          } finally {
            setIsUploading(false);
          }
        })();

        return true;
      },
      handlePaste: (view, event) => {
        const file = event.clipboardData?.files[0];
        if (!file?.type.startsWith('image/')) return false;

        // 파일 처리를 위해 이벤트 기본 동작 방지
        event.preventDefault();

        // 토스트 알림 표시
        toast('이미지 업로드 중...');
        setIsUploading(true);

        // 비동기 처리를 위한 즉시 실행 함수
        (async () => {
          try {
            const { url } = await uploadImageToSupabase(file);
            if (editor) {
              const node = editor.schema.nodes.image.create({ src: url });
              editor.commands.insertContent(node);
              toast('업로드 완료', {
                description: '이미지가 성공적으로 추가되었습니다',
              });
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              toast('업로드 실패', {
                description: error.message,
              });
            }
          } finally {
            setIsUploading(false);
          }
        })();

        return true;
      },
    },
    // SSR 하이드레이션 불일치 문제 해결을 위한 설정
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='w-full'>
      <div className='flex gap-2 p-2 border-b bg-muted/50'>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>
      </div>
      <EditorContent editor={editor} />
      {isUploading && <div className='mt-2 text-sm text-muted-foreground'>이미지 업로드 중...</div>}
      <div className='mt-2 text-xs text-muted-foreground'>
        이미지는 드래그 앤 드롭하거나 클립보드에서 붙여넣기(Ctrl+V)로 추가할 수 있습니다.
      </div>
    </div>
  );
}
