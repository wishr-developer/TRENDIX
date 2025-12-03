import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div>
          <Link href="/ja">
            <span className="text-xl font-bold text-slate-900 tracking-tight hover:text-gray-700 transition-colors">
              TRENDIX
            </span>
          </Link>
        </div>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          掲載価格はAmazon公式サイトの価格情報をもとにしています。本サイトはAmazonアソシエイト・プログラムに参加しています。
        </p>
        <nav className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <Link href="/ja/terms" className="hover:text-gray-700 underline-offset-4 hover:underline">
            利用規約
          </Link>
          <Link
            href="/ja/privacy"
            className="hover:text-gray-700 underline-offset-4 hover:underline"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/ja/disclaimer"
            className="hover:text-gray-700 underline-offset-4 hover:underline"
          >
            免責事項
          </Link>
          <Link href="/ja/about" className="hover:text-gray-700 underline-offset-4 hover:underline">
            運営者情報
          </Link>
        </nav>
        <div className="text-xs text-gray-500 pt-2">
          &copy; 2025 TRENDIX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
