'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteDiaryAction } from '@/app/actions';
import { toast } from 'sonner';

interface DeleteDiaryButtonProps {
  id: string;
}

export default function DeleteDiaryButton({ id }: DeleteDiaryButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // 서버 액션을 사용하여 일기 삭제
      const result = await deleteDiaryAction(id);
      
      if (result.success) {
        toast.success('일기가 삭제되었습니다.');
        router.push('/');
        router.refresh();
      } else {
        toast.error(result.error || '일기 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('일기 삭제 중 오류 발생:', error);
      toast.error('일기 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex items-center gap-2">
          <Trash className="h-4 w-4" />
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>일기 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 이 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 