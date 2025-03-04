import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

/**
 * 메인 페이지 컴포넌트
 */
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">개인용 다이어리</h1>
        <p className="text-xl text-muted-foreground mb-8">
          당신의 일상을 기록하고 관리하세요.
        </p>
        
        <div className="flex flex-col items-center">
          <p className="text-muted-foreground mb-4">
            아직 작성된 일기가 없습니다. 첫 번째 일기를 작성해보세요!
          </p>
          
          <Link href="/new">
            <Button className="flex items-center">
              <PenSquare className="mr-2 h-4 w-4" />
              새 일기 작성하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
