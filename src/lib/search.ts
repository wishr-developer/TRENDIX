import { Product } from '@/types/product';

/** テキストを検索用に正規化（小文字＋NFKC＋trim） */
export function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFKC').trim();
}

/** クエリ文字列からAND検索用のトークン配列を生成 */
export function buildSearchTokens(query: string): string[] {
  return query
    .split(/[\s、　]+/)
    .map(normalizeText)
    .filter(Boolean);
}

/** 与えられたテキストが全トークンを含むか（AND検索） */
export function matchesTokens(target: string, tokens: string[]): boolean {
  const normalized = normalizeText(target);
  return tokens.every((t) => normalized.includes(t));
}

/** Productに対して、name/brandを対象にAND検索を行う */
export function productMatchesQuery(product: Product, query: string): boolean {
  const tokens = buildSearchTokens(query);
  if (tokens.length === 0) return true;
  const target = `${product.name} ${product.brand ?? ''}`;
  return matchesTokens(target, tokens);
}
