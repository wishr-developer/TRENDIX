import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/i18n';

/**
 * ロケールレイアウト
 * next-intlを使用して国際化を提供
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ロケールが有効でない場合は404を返す
  if (!isValidLocale(locale)) {
    notFound();
  }

  // メッセージを取得
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

/**
 * 動的パラメータを生成（静的生成を無効化）
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

