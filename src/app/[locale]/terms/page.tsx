import type { Metadata } from 'next';
import BackToHome from '@/components/BackToHome';

export const metadata: Metadata = {
  title: '利用規約 | TRENDIX',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <BackToHome />
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          利用規約
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          本利用規約（以下「本規約」といいます。）は、TRENDIX（以下「本サービス」といいます。）の利用条件を定めるものです。本サービスをご利用いただく前に、本規約をよくお読みください。
        </p>

        <section className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">第1条（本サービスの性質）</h2>
            <p>
              本サービスは、Amazon等のECサイトで販売されている商品の価格情報をもとに、買い物判断の参考となる情報を提供することを目的としたサービスです。あくまで情報提供のみを行うものであり、特定の商品購入を推奨・保証するものではありません。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">第2条（情報の正確性について）</h2>
            <p>
              本サービスに表示される価格・在庫・商品情報は、取得元となるECサイトの情報をもとにしていますが、その正確性・完全性・最新性を保証するものではありません。実際の購入時には、必ず各ECサイト上の表示をご確認ください。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">第3条（自己責任の原則）</h2>
            <p>
              本サービスを利用して行われた一切の行為およびその結果については、利用者ご自身の責任となります。本サービスの利用により生じたいかなる損害についても、運営者は一切の責任を負いません。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">第4条（禁止事項）</h2>
            <p>
              本サービスの情報を不正に改変・転載・再配布する行為、ならびに運営を妨害する行為は禁止します。
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 mb-1">第5条（規約の変更）</h2>
            <p>
              本規約の内容は、必要に応じて予告なく変更される場合があります。変更後の規約は、本サービス上に掲載した時点から効力を生じるものとします。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}


