# 개인용 다이어리 웹 애플리케이션

## 프로젝트 소개
개인용 다이어리 웹 애플리케이션은 사용자가 일상 생활을 기록하고 관리할 수 있는 디지털 다이어리입니다. 사용자는 글과 이미지를 포함한 풍부한 콘텐츠를 작성하고, 감정과 날씨를 이모티콘으로 표현할 수 있습니다.

## 기술 스택
- **프론트엔드**: Next.js 15.1.6 (App Router), TypeScript, TailwindCSS, Shadcn UI
- **백엔드**: Next.js Server Actions, Supabase
- **데이터베이스**: Supabase PostgreSQL, Supabase Storage

## 시작하기

### 필수 조건
- Node.js 18.0.0 이상
- npm 또는 yarn
- Supabase 계정 및 프로젝트

### 설치 방법
1. 저장소 클론
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. 의존성 설치
   ```bash
   npm install
   ```

3. 환경 변수 설정
   - `.env.local` 파일을 프로젝트 루트에 생성
   - 다음 변수 추가:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
   - Supabase 대시보드의 프로젝트 설정 > API에서 URL과 키를 찾을 수 있습니다.

4. Supabase 설정
   - Supabase 프로젝트에 'diary' 테이블 생성
   - 'diary-images' 스토리지 버킷 생성
   - 테이블 스키마:
     - id: UUID (PK)
     - title: 문자열
     - content: JSON/텍스트
     - emotion: 문자열
     - weather: 문자열
     - created_at: 타임스탬프
     - updated_at: 타임스탬프
     - diary_date: 날짜

5. 개발 서버 실행
   ```bash
   npm run dev
   ```

6. Supabase 연결 테스트
   - 브라우저에서 `http://localhost:3000/supabase-test` 접속
   - 연결 상태와 다이어리 목록 확인

## 주요 기능
- 일기 작성 (리치 텍스트 에디터, 이미지 업로드)
- 감정 및 날씨 이모티콘 선택
- 일기 조회, 수정, 삭제
- 제목 및 내용 기반 검색
- 날짜별 필터링

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
