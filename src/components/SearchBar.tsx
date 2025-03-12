'use client';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * 검색 컴포넌트
 * 사용자가 검색어를 입력하면 URL의 search 쿼리 파라미터를 업데이트
 */
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // URL 쿼리 파라미터 업데이트 함수
  const updateSearchParam = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);

      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  // 검색어 입력 핸들러
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // 검색어 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParam(searchTerm);
  };

  // 검색어 초기화 핸들러
  const clearSearch = () => {
    setSearchTerm('');
    updateSearchParam('');
  };

  // 디바운스 처리를 위한 useEffect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== (searchParams.get('search') || '')) {
        updateSearchParam(searchTerm);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, updateSearchParam, searchParams]);

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <h2 className='text-sm font-semibold mb-2'>검색</h2>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <Input
          type='text'
          placeholder='검색어를 입력하세요...'
          value={searchTerm}
          onChange={handleSearch}
          className='pl-10 pr-10 w-full'
        />
        {searchTerm && (
          <button
            type='button'
            onClick={clearSearch}
            className='absolute inset-y-0 right-0 flex items-center pr-3'
          >
            <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
          </button>
        )}
      </div>
    </form>
  );
}
