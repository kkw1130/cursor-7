import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "개인용 다이어리",
  description: "개인용 다이어리 웹 애플리케이션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen">
            {/* 데스크톱용 사이드바 - md 이상에서만 표시 */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <Sidebar />
            </div>
            
            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 모바일용 헤더 */}
              <header className="border-b p-4 flex items-center md:hidden">
                <MobileSidebar />
                <h1 className="text-xl font-bold ml-4">개인용 다이어리</h1>
              </header>
              
              {/* 메인 콘텐츠 */}
              <main className="flex-1 overflow-auto p-4">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
