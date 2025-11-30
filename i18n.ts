import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

/**
 * 国際化設定
 * サポートする言語とデフォルト言語を定義
 */
export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ja';

/**
 * ロケールが有効かどうかをチェック
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * next-intlの設定
 * 
 * 注意: 現在は基盤のみ実装。実際の使用には、すべてのページを app/[locale] フォルダに移動する必要があります。
 */
export default getRequestConfig(async ({ locale }) => {
  // ロケールが有効でない場合はデフォルトロケールを使用（既存のコードとの互換性のため）
  const validLocale: Locale = (locale && isValidLocale(locale)) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});

