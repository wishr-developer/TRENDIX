import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { CategoryProvider } from "@/contexts/CategoryContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xiora Analytics - Price Intelligence Platform",
  description: "プロフェッショナルな価格分析ダッシュボード",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="dark">
      <body className="flex min-h-screen bg-background text-text-main font-sans selection:bg-primary/20">
        <CategoryProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 ml-64">
            {children}
            <Footer />
          </div>
        </CategoryProvider>
      </body>
    </html>
  );
}
