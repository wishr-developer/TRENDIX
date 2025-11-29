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

## 価格更新スクリプト

商品の価格を更新するには、以下のコマンドを実行します：

```bash
python3 scripts/update_prices.py
```

このスクリプトは、各商品の価格をランダムに-100円〜+100円変動させ、`data/products.json`に保存します。

## プロジェクト構造

```
price-watcher/
├── data/
│   └── products.json          # 商品データ（ID, 商品名, 価格, 履歴等）
├── scripts/
│   └── update_prices.py       # 価格更新スクリプト
├── src/
│   ├── app/
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # メインページ
│   │   └── globals.css        # グローバルスタイル
│   ├── components/
│   │   └── ProductCard.tsx    # 商品カードコンポーネント
│   └── types/
│       └── product.ts         # 型定義
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── requirements.txt
```

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (グラフ表示)
- **Python 3** (価格更新スクリプト)

