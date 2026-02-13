# デプロイメントガイド

## オートOBS設定 - Vercel デプロイメント

このドキュメントは、オートOBS設定を Vercel にデプロイするための手順を説明します。

---

## 前提条件

- GitHub アカウント
- Vercel アカウント（vercel.com で無料登録可能）
- Node.js 18+ がインストール済み

---

## ステップ 1: GitHub に push

```bash
git add .
git commit -m "Deploy preparation: Add vercel.json, OGP metadata, GA integration"
git push origin main
```

---

## ステップ 2: Vercel でプロジェクトを作成

1. https://vercel.com/new にアクセス
2. GitHub リポジトリを選択
3. Project name: `stream-auto-setting`
4. Framework: Next.js（自動検出）
5. Build Command: `npm run build`
6. Install Command: `npm install --legacy-peer-deps`

---

## ステップ 3: 環境変数の設定

Vercel ダッシュボード > Settings > Environment Variables で以下を設定：

### 必須環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://stream-auto-setting.vercel.app` | サイトの本番URL |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | Google Analytics ID |

### 設定方法

1. Vercel ダッシュボード > Settings > Environment Variables
2. 各変数を追加
3. すべての Environment（Production, Preview, Development）を選択
4. Save

---

## ステップ 4: Google Analytics の設定

### 4.1 Google Analytics アカウント作成

1. https://analytics.google.com にアクセス
2. 新しいプロパティを作成
3. プロパティ名: `オートOBS設定`
4. ウェブサイト URL: `https://stream-auto-setting.vercel.app`
5. 業種: `インターネット サービス`

### 4.2 測定ID を取得

1. 管理 > プロパティ設定
2. Google タグ ID（`G-XXXXXXXXXX`）をコピー
3. Vercel の環境変数に設定

---

## ステップ 5: ドメイン設定（オプション）

カスタムドメインを使用する場合：

1. Vercel ダッシュボード > Domains
2. Add Domain をクリック
3. ドメイン名を入力
4. DNS レコードを設定（Vercel の指示に従う）
5. ドメイン verification 待機（最大 30 分）

---

## ステップ 6: デプロイ

### 自動デプロイ（推奨）

GitHub の `main` ブランチへの push で自動的にデプロイされます。

### 手動デプロイ

```bash
npm install -g vercel
vercel --prod
```

---

## デプロイ後の確認

### 1. サイトアクセス

https://stream-auto-setting.vercel.app にアクセスして動作確認

### 2. OGP タグの確認

```bash
curl -I https://stream-auto-setting.vercel.app
```

以下のヘッダーが含まれることを確認：
- `og:title`
- `og:description`
- `og:image`
- `twitter:card`

### 3. Google Analytics の確認

1. Google Analytics ダッシュボードを開く
2. リアルタイム > 概要
3. サイトにアクセスして、visitor が表示されることを確認

---

## よくある問題と対処法

### ビルドエラー: `better-sqlite3 not found`

**原因:** Vercel では native modules が限定的

**対処法:**
- `vercel.json` で `installCommand` を設定済み
- 実際のデプロイ時には、Vercel のビルド環境で自動的に解決されます

### OGP 画像が表示されない

**対処法:**
1. `/public/og-image.png` が存在することを確認
2. ファイルサイズが 1200x630px であることを確認
3. キャッシュをクリア（Chrome DevTools > Cache）

### Google Analytics トラッキングが動作しない

**対処法:**
1. `NEXT_PUBLIC_GA_ID` が正しく設定されているか確認
2. ブラウザコンソールでエラーがないか確認
3. Google Analytics ダッシュボードで `G-XXXXXXXXXX` が正しいか確認

---

## 本番環境チェックリスト

- [ ] GitHub リポジトリが public
- [ ] Vercel でプロジェクト作成済み
- [ ] 環境変数が すべて設定済み
- [ ] Google Analytics アカウント作成済み
- [ ] OGP 画像ファイルが存在
- [ ] カスタムドメイン設定済み（使用する場合）
- [ ] HTTPS が有効化されている
- [ ] サイト全体でアクセステスト完了
- [ ] OGP タグが正しく表示されることを確認
- [ ] Google Analytics で visitor が記録されることを確認

---

## 今後の改善

### Phase 5.5: モニタリング

- Sentry 統合（エラー追跡）
- Vercel Analytics 有効化
- Performance monitoring

### Phase 5.6: CDN 最適化

- Cloudflare 統合
- 画像最適化（WebP、遅延ロード）
- キャッシュ戦略最適化

---

## 参考リンク

- [Vercel ドキュメント](https://vercel.com/docs)
- [Next.js デプロイメント](https://nextjs.org/docs/deployment)
- [Google Analytics 設定](https://support.google.com/analytics)
- [OGP について](https://ogp.me/)
