import Link from "next/link";

/**
 * フッターコンポーネント
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ナビゲーションリンク */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              ナビゲーション
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  特定商取引法に基づく表記
                </Link>
              </li>
            </ul>
          </div>

          {/* 免責事項 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              免責事項
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Amazonのアソシエイトとして、Price Watcherは適格販売により収入を得ています。
            </p>
          </div>

          {/* コピーライト */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              運営情報
            </h3>
            <p className="text-sm text-gray-600">
              © {currentYear} Price Watcher
              <br />
              <span className="text-xs text-gray-500 mt-2 block">
                すべての権利は保護されています
              </span>
            </p>
          </div>
        </div>

        {/* 免責事項（目立つ場所） */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            <strong className="text-gray-700">免責事項:</strong> Amazonのアソシエイトとして、Price Watcherは適格販売により収入を得ています。
          </p>
        </div>
      </div>
    </footer>
  );
}

