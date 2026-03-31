# ハマベロ（横浜ベロベロ）

横浜駅周辺の居酒屋の「LINE限定クーポン」や「タイムセール」などのフロー情報を共有するWebアプリケーション。

## 技術スタック

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **Backend/DB**: Supabase (PostgreSQL, Storage)
- **Date Utils**: date-fns

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、Supabaseの認証情報を設定してください：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## プロジェクト構造

```
.
├── app/
│   ├── admin/          # 管理画面
│   │   └── page.tsx
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # トップページ
├── components/
│   ├── CouponCard.tsx  # クーポンカードコンポーネント
│   └── Header.tsx      # ヘッダーコンポーネント
├── lib/
│   └── mockData.ts     # モックデータ
├── types/
│   └── coupon.ts       # 型定義
├── utils/
│   ├── supabase.ts     # Supabaseクライアント設定
│   └── timeUtils.ts    # 時間関連のユーティリティ
└── package.json
```

## 機能

### トップページ (`/`)

- クーポン一覧の表示（現在はモックデータ）
- 各クーポンカードには以下を表示：
  - クーポン画像
  - 店名
  - キャッチコピー
  - 実質価格
  - 有効期限までの残り時間

### 管理画面 (`/admin`)

- クーポン投稿フォーム
- 入力項目：
  - 店名
  - キャッチコピー
  - 実質価格
  - 画像URL
  - 有効期限
  - エリア

## Supabaseデータベース設計

### テーブル: `coupons`

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | uuid | プライマリキー |
| created_at | timestamp | 作成日時 |
| store_name | text | 店名 |
| title | text | キャッチコピー |
| price_display | text | 実質価格表示 |
| image_url | text | 画像URL |
| expires_at | timestamp with time zone | 有効期限 |
| area | text | エリア（デフォルト: '横浜'） |

### Supabaseテーブル作成SQL

```sql
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  store_name TEXT NOT NULL,
  title TEXT NOT NULL,
  price_display TEXT NOT NULL,
  image_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  area TEXT DEFAULT '横浜'
);

-- RLS (Row Level Security) を有効化（必要に応じて）
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能（必要に応じて調整）
CREATE POLICY "Anyone can read coupons" ON coupons
  FOR SELECT USING (true);

-- 管理者のみ書き込み可能（認証が必要な場合は調整）
CREATE POLICY "Admin can insert coupons" ON coupons
  FOR INSERT WITH CHECK (true);
```

## 次のステップ

1. Supabaseプロジェクトを作成
2. 上記のSQLでテーブルを作成
3. `.env.local` に認証情報を設定
4. `app/admin/page.tsx` のコメントアウト部分を有効化してSupabase連携を実装
5. 画像アップロード機能を実装（Supabase Storage使用）

## ライセンス

MIT
