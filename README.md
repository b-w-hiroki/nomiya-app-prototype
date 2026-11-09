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

ブラウザで [http://localhost:3003](http://localhost:3003) を開いて確認してください。

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

- 保存しない入力プレビュー（管理者認証・投稿機能は未実装）
- 入力項目：
  - 店名
  - キャッチコピー
  - 実質価格
  - 画像URL
  - 有効期限
  - エリア

## Supabaseと投稿権限

現在の参照先は `campaigns` テーブルです。正本の作成SQLは
[`supabase/schema.sql`](supabase/schema.sql) を参照してください。
RLSを有効にし、公開情報のSELECTだけを許可する読み取り専用の初期設定です。
匿名・一般認証ユーザーのINSERT/UPDATE/DELETEを許可するポリシーは追加しません。

`/admin` は入力プレビュー専用です。接続用環境変数が設定されていても
DBへの書き込みやモックの「投稿成功」表示は行いません。
これは認可の代わりではなく、未実装の機能を公開しないための制限です。

### 既存環境を使う前の点検

旧READMEの `Admin can insert coupons ... WITH CHECK (true)` は
管理者を限定しない不適切な例でした。`coupons` は旧例のテーブル名です。
既存の本番にその設定が適用されたかは、このリポジトリからは確認できません。
この変更だけで既存DBの権限は変わりません。

管理者はSupabaseの管理画面で `campaigns` と旧 `coupons` のRLS・権限・
INSERT/UPDATE/DELETEポリシーを確認してください。次のSQLは読み取り確認用です。

```sql
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('campaigns', 'coupons');
```

既存ポリシーは本番への影響を確認してから個別に修正します。
`schema.sql` を再実行しても既存の許可ポリシーを自動削除しません。
service-roleキーはブラウザや `NEXT_PUBLIC_*` に配置しないでください。

### 投稿機能を実装する条件

- 管理者認証とDB側の権限判定を先に設計する（画面の非表示だけに依存しない）。
- 隔離環境で匿名・一般ユーザーの書き込み拒否と、管理者だけの許可を検証する。
- 接続済み／モック／保存成功／保存失敗を明確に分ける。

## 検証

```bash
npm ci
npm test
npm run type-check
npm run lint
npm run build:static
```

`npm test` は投稿停止とSQL例の回帰検査です。実DBの認可テストや
本番設定確認の代わりにはなりません。

## ライセンス

MIT
