import type { Metadata } from 'next';
import BackToHome from '@/components/BackToHome';

export const metadata: Metadata = {
  title: '免責事項 | TRENDIX',
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <BackToHome />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          免責事項
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          本免責事項は、TRENDIX（以下「本サイト」といいます。）の利用にあたっての注意事項を定めるものです。
        </p>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">1. 価格・在庫情報について</h2>
            <p>
              本サイトに掲載される価格・在庫・配送情報は、取得時点のECサイトの情報にもとづいています。これらの情報は常に変動しており、実際の販売ページの内容と異なる場合があります。最新情報は、必ず各ECサイト上の表示をご確認ください。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">2. 損害等の責任について</h2>
            <p>
              本サイトの情報を利用したことにより発生したいかなる損失・損害についても、運営者は一切の責任を負いません。商品購入に関する最終的な判断は、利用者ご自身の責任において行ってください。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">3. 外部サイトのリンクについて</h2>
            <p>
              本サイトから遷移する外部サイト（Amazon.co.jpを含む）の内容について、運営者は一切の責任を負いません。利用条件やプライバシーポリシー等は、各サイトの規約をご確認ください。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


