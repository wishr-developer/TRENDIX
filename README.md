# Price Watcher

Amazon商品の価格変動を監視するWebアプリケーションです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

または

```bash
yarn install
```

または

```bash
pnpm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

または

```bash
yarn dev
```

または

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## スクリプト

### 価格更新スクリプト

商品の価格を更新するには、以下のコマンドを実行します：

```bash
python3 scripts/update_prices.py
```

このスクリプトは、各商品のAmazonページから価格をスクレイピングして更新します。取得に失敗した場合は、ランダム変動をフォールバックとして使用します。

### 大量商品追加ツール

複数の商品を一度に追加するには、以下の手順を実行します：

1. `scripts/urls.txt` にAmazon商品URLを1行に1つずつ記入します：

```
https://www.amazon.co.jp/dp/B09JQ6K8M1
https://www.amazon.co.jp/dp/B09Y2MYL5T
```

2. 以下のコマンドを実行します：

```bash
python3 scripts/add_products.py
```

このスクリプトは、各URLから商品名、価格、画像URLを取得し、`data/products.json`に追記します。既に登録されている商品はスキップされます。

### カテゴリ一括登録

Amazonのランキングページや検索結果ページから商品を一括で取得するには、以下の手順を実行します：

1. `scripts/categories.txt` にAmazonランキングURLを1行に1つずつ記入します：

```
https://www.amazon.co.jp/gp/bestsellers/computers/
https://www.amazon.co.jp/gp/bestsellers/electronics/
```

2. 以下のコマンドを実行します：

```bash
python3 scripts/import_ranking.py
```

このスクリプトは、各ランキングページから `div[data-asin]` 属性を持つ商品コンテナを探し、ASIN、商品名、画像URL、価格を抽出して `data/products.json` に追記します。価格が取得できない場合は0円（要確認）として登録されます。既に登録されている商品は重複チェックによりスキップされます。

## プロジェクト構造

```
price-watcher/
├── data/
│   └── products.json          # 商品データ（ID, 商品名, 価格, 履歴等）
├── scripts/
│   ├── update_prices.py       # 価格更新スクリプト
│   ├── add_products.py        # 大量商品追加ツール
│   ├── import_ranking.py      # ランキングページ一括取得ツール
│   ├── urls.txt               # 商品URLリスト（手動編集）
│   └── categories.txt         # ランキングページURLリスト（手動編集）
├── src/
│   ├── app/
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # メインページ
│   │   ├── privacy/
│   │   │   └── page.tsx        # プライバシーポリシーページ
│   │   ├── legal/
│   │   │   └── page.tsx        # 特定商取引法に基づく表記
│   │   └── globals.css        # グローバルスタイル
│   ├── components/
│   │   ├── ProductCard.tsx    # 商品カードコンポーネント
│   │   └── Footer.tsx         # フッターコンポーネント
│   └── types/
│       └── product.ts         # 型定義
├── .github/
│   └── workflows/
│       └── daily_update.yml   # GitHub Actions ワークフロー
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── requirements.txt
```

## 機能

- ✅ Amazon商品の価格変動を監視
- ✅ 価格推移グラフの表示
- ✅ 自動価格更新（GitHub Actions）
- ✅ 大量商品追加ツール
- ✅ ランキングページからの一括商品取得
- ✅ プライバシーポリシー・特定商取引法に基づく表記
- ✅ レスポンシブデザイン

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (グラフ表示)
- **Python 3** (スクレイピングスクリプト)
- **GitHub Actions** (自動価格更新)

