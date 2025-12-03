import type { Metadata } from 'next';
import BackToHome from '@/components/BackToHome';

export const metadata: Metadata = {
  title: '運営者情報 | TRENDIX',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <BackToHome />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          運営者情報
        </h1>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">サービス名</h2>
            <p>TRENDIX（トレンディックス）</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">サービスの目的</h2>
            <p>
              TRENDIXは、AmazonなどのECサイトでの買い物において「今買っても良さそうか」を判断しやすくするための情報を提供するサービスです。
              価格の変動や値下がりのタイミングを分かりやすく見せることで、後悔の少ない買い物判断をサポートします。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">運営</h2>
            <p>Xiora</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Amazonアソシエイト・プログラムについて</h2>
            <p>
              当サイトは、Amazon.co.jpを宣伝しリンクすることによって紹介料を獲得できる
              アフィリエイトプログラムであるAmazonアソシエイト・プログラムの参加者です。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">お問い合わせ</h2>
            <p className="mb-1">
              本サービスに関するお問い合わせは、下記メールアドレスまでご連絡ください。
            </p>
            <a href="mailto:info@xiora-official.com" className="text-blue-600 underline break-all">
              info@xiora-official.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}


