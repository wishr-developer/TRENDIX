import type { Metadata } from 'next';
import BackToHome from '@/components/BackToHome';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | TRENDIX',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <BackToHome />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          プライバシーポリシー
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          TRENDIX（以下「本サイト」といいます。）では、ユーザーの皆さまのプライバシーを尊重し、個人情報の適切な保護に努めます。本ポリシーでは、本サイトにおける情報の取り扱いについて説明します。
        </p>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">1. Cookieの使用について</h2>
            <p>
              本サイトでは、閲覧状況の把握やサービス改善のためにCookieを使用する場合があります。Cookieには個人を特定できる情報は含まれておらず、ブラウザの設定により無効化することもできます。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">2. アクセス解析ツールについて</h2>
            <p>
              本サイトでは、アクセス状況を把握するためにアクセス解析ツールを利用する場合があります。これらのツールは、Cookieを利用して匿名のトラフィックデータを収集することがありますが、個人を特定するものではありません。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">3. Amazonアソシエイトプログラムについて</h2>
            <p>
              本サイトは、Amazon.co.jpを宣伝しリンクすることによって紹介料を得ることを目的としたアフィリエイトプログラムである
              Amazonアソシエイト・プログラムの参加者です。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">4. 個人情報の第三者提供</h2>
            <p>
              法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


