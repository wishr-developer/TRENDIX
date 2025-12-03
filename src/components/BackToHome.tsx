import Link from 'next/link';

/**
 * 下層ページからトップページ（/ja）に戻るための共通ボタン
 */
export default function BackToHome() {
  return (
    <div className="mb-4">
      <Link
        href="/ja"
        className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors"
      >
        <span aria-hidden="true">←</span>
        <span>トップページに戻る</span>
      </Link>
    </div>
  );
}



