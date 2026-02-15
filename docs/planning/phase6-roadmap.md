# Phase 6以降 実装ロードマップ

**作成日:** 2026-02-15
**対象:** Alpha リリース後の改善・機能追加
**期間:** 2026年3月～6月（3ヶ月間）
**ステータス:** 計画段階

---

## 📊 全体方針

### 優先順位の基準

1. **ユーザー維持率向上** - 離脱率を下げる施策を最優先
2. **実測データに基づく改善** - 仮説ではなく実データで判断
3. **パフォーマンス最優先** - 速度低下を招く機能は後回し
4. **スモールリリース** - 1週間単位で小さな改善を積み重ねる

### 成功指標（KPI）

| 指標 | 現在（推定） | 目標（3ヶ月後） |
|------|-------------|----------------|
| 完了率（ダウンロードまで到達） | - | 70% |
| GPU検出成功率 | 90% | 95% |
| ページロード時間（LCP） | - | < 1.2秒 |
| Lighthouse スコア | - | 95+ |
| ユーザー満足度 | - | 4.5/5.0 |

---

## 🎯 Phase 6.1: パフォーマンス最適化（Week 1-2）

**目的:** Lighthouseスコア95+達成、LCP 1.2秒以下

### 優先度: 🔴 最高

### 実装項目

#### 1. コア Web Vitals 改善（3日間）

**LCP (Largest Contentful Paint) - 目標 < 1.2秒**
- [ ] フォント最適化
  - Google Fonts → self-hosted（next/font）
  - FOUT/FOIT対策（font-display: swap）
  - サブセット化（日本語のみ）
- [ ] 画像最適化
  - next/image 導入（既存 img タグを置換）
  - WebP/AVIF 対応
  - Lazy loading 実装
- [ ] Critical CSS インライン化
  - Above the fold のスタイルを <head> に埋め込み
  - 残りを非同期ロード

**FID (First Input Delay) - 目標 < 100ms**
- [ ] JavaScript バンドル分割
  - コード分割（dynamic import）
  - 未使用ライブラリの削除
  - Tree shaking 最適化
- [ ] メインスレッドの軽量化
  - 重い処理を Web Worker に移行（GPU検出など）
  - requestIdleCallback 活用

**CLS (Cumulative Layout Shift) - 目標 < 0.1**
- [ ] レイアウトシフト防止
  - 画像・アイコンのサイズ明示
  - フォントサイズのfallback設定
  - Skeleton UI 追加

#### 2. ビルドサイズ削減（2日間）

**目標: First Load JS < 70 KB（現在 78.2 KB）**

- [ ] ライブラリの見直し
  - lucide-react → アイコンの個別インポート（-5KB）
  - Framer Motion → CSS Animations 置換検討（-15KB）
  - better-sqlite3 → エッジ環境での代替検討
- [ ] 動的インポート
  - Accordion, Dialog などのUI → 必要時ロード
  - Post-Download Guide → ルート分割
  - Advanced Settings → 遅延ロード
- [ ] Tree shaking 最適化
  - `sideEffects: false` 設定
  - 未使用エクスポートの削除

#### 3. キャッシュ戦略最適化（1日間）

- [ ] vercel.json の Cache-Control 強化
  - 静的アセット: `max-age=31536000, immutable`
  - API: `max-age=0, s-maxage=60, stale-while-revalidate`
- [ ] Service Worker 検討（PWA化）
  - オフライン対応
  - プリキャッシュ戦略

#### 4. パフォーマンス測定自動化（1日間）

- [ ] Lighthouse CI 導入
  - GitHub Actions でビルド時に自動測定
  - スコア95未満でアラート
- [ ] Real User Monitoring (RUM)
  - Vercel Analytics 有効化
  - Web Vitals レポート収集

**工数見積:** 7日間
**成果物:** Lighthouseスコア95+、LCP < 1.2秒

---

## 🎨 Phase 6.2: ビジュアル強化（Week 3-4）

**目的:** 実際のOBSスクリーンショットで説得力向上

### 優先度: 🟡 中

### 実装項目

#### 1. OBSスクリーンショット撮影（3日間）

**撮影環境:**
- OBS Studio 最新版（30.x）
- Windows 11 / macOS Sonoma
- 日本語UI設定
- 推奨設定適用済み

**撮影対象（10項目）:**

**必須設定（3枚）**
1. YouTube配信キー設定画面
   - 設定 > 配信 > サービス選択
   - キー入力欄をモザイク処理
2. マイク音声設定画面
   - ソース追加 > 音声入力キャプチャ
   - デバイス選択ドロップダウン
3. ゲーム画面キャプチャ設定
   - ソース追加 > ゲームキャプチャ
   - モード選択ダイアログ

**パフォーマンス設定（3枚）**
4. プロセス優先度設定（タスクマネージャー）
5. 録画設定（設定 > 出力 > 録画）
6. プレビュー無効化（表示メニュー）

**オプション設定（4枚）**
7. チャットウィジェット追加（ブラウザソース）
8. アラート設定（StreamElements等）
9. 自動録画設定
10. バックアップ設定（シーンコレクション）

**画像仕様:**
- 解像度: 1920x1080（元画像）→ 800x450（Web表示）
- フォーマット: WebP（next/image で自動変換）
- 圧縮: 品質80%
- 重要箇所に赤枠ハイライト（Figma/Photoshop）

#### 2. 画像最適化パイプライン（1日間）

- [ ] next/image 設定
  ```typescript
  // next.config.ts
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
  ```
- [ ] blur placeholder 生成（plaiceholder ライブラリ）
- [ ] responsive srcset 対応

#### 3. UI更新（2日間）

**ファイル修正:**
- `lib/post-download-guide.ts`
  ```typescript
  image: {
    src: '/guide/youtube-stream-key.webp',
    alt: 'YouTube配信キー設定画面',
    width: 800,
    height: 450
  }
  ```
- `components/post-download/guide-item.tsx`
  ```tsx
  {item.image && (
    <Image
      src={item.image.src}
      alt={item.image.alt}
      width={item.image.width}
      height={item.image.height}
      className="rounded-lg border"
      placeholder="blur"
      blurDataURL={item.image.blurDataURL}
    />
  )}
  ```

#### 4. Fallback 対応（1日間）

- [ ] 画像読み込み失敗時に ASCII 図にフォールバック
- [ ] Loading skeleton 追加
- [ ] Error boundary 実装

**工数見積:** 7日間
**成果物:** 10枚のOBSスクリーンショット、画像最適化済み

---

## 🚀 Phase 6.3: 機能追加（Week 5-6）

**目的:** ユーザー要望に基づく機能拡充

### 優先度: 🟢 低（ユーザーフィードバック次第）

### 実装項目（優先度順）

#### 1. 設定プリセット保存・読み込み（3日間）

**ユースケース:**
- 複数の配信スタイル（ゲーム配信 / 雑談配信）を切り替え
- PCを買い替えた時に設定を移行
- チーム内で推奨設定を共有

**実装:**
- [ ] ローカルストレージに設定保存
  ```typescript
  interface SavedPreset {
    id: string;
    name: string;
    genre: GenreId;
    gpuMapping: GPUMapping;
    speedTest: SpeedTestResult;
    advancedSettings?: AdvancedSettingsAnswers;
    createdAt: string;
  }
  ```
- [ ] プリセット一覧画面
- [ ] プリセット読み込み
- [ ] JSON エクスポート/インポート

**UI:**
- 設定確認画面に「プリセットとして保存」ボタン追加
- トップページに「保存済みプリセットから開始」ボタン

#### 2. GPU検出精度向上（2日間）

**現状の課題:**
- 検出率90%（目標95%）
- 新GPU（RTX 50シリーズ等）未対応
- ノートPC GPU の誤検出

**改善策:**
- [ ] GPUデータベース更新
  - RTX 50シリーズ追加（2026年2月発売）
  - AMD RX 8000シリーズ追加
  - Intel Arc B-series 追加
- [ ] ベンダー判定ロジック強化
  ```typescript
  // 例: "NVIDIA GeForce RTX 4070 Laptop GPU" → laptop フラグ
  const isLaptop = /laptop|mobile|max-q/i.test(gpuName);
  const bitrateLimit = isLaptop ? baseBitrate * 0.8 : baseBitrate;
  ```
- [ ] fuzzy matching スコア閾値調整（0.6 → 0.7）

#### 3. ダウンロード履歴（1日間）

**機能:**
- 過去にダウンロードした設定ファイルの履歴表示
- 再ダウンロード機能
- 設定の比較表示

**実装:**
- [ ] IndexedDB で履歴保存
- [ ] 履歴一覧UI（Drawer or Modal）
- [ ] 設定差分表示

#### 4. FAQ・ヘルプセクション（2日間）

**よくある質問（想定）:**
1. GPUが検出されない場合は？
2. ビットレートが低すぎる/高すぎる場合は？
3. OBS設定ファイルの適用方法は？
4. エラーが出た場合の対処法は？
5. カスタムサーバー（Twitch/YouTube以外）の設定方法は？

**実装:**
- [ ] `/faq` ページ作成
- [ ] Accordion UI で Q&A 表示
- [ ] 検索機能（Ctrl+K でコマンドパレット）
- [ ] トップページに「よくある質問」リンク

**工数見積:** 8日間
**成果物:** プリセット機能、GPU DB更新、FAQ

---

## 📊 Phase 6.4: Analytics & モニタリング（Week 7-8）

**目的:** データドリブンな意思決定基盤構築

### 優先度: 🟡 中

### 実装項目

#### 1. エラートラッキング（2日間）

**Sentry 統合:**
- [ ] Sentry アカウント作成
- [ ] Next.js SDK 導入
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```
- [ ] エラー境界設定
  - GPU検出エラー
  - API呼び出しエラー
  - ファイル生成エラー
- [ ] ユーザーコンテキスト追加
  ```typescript
  Sentry.setUser({
    id: sessionId,
    genre: selectedGenre,
    gpu: detectedGPU?.vendor
  });
  ```

#### 2. ユーザー行動分析（3日間）

**Google Analytics 4 イベント設計:**

| カテゴリ | イベント名 | パラメータ |
|---------|-----------|----------|
| Navigation | page_view | page_path, page_title |
| Engagement | genre_selected | genre_id |
| Engagement | gpu_detected | gpu_vendor, confidence, is_manual |
| Engagement | speed_test_started | - |
| Engagement | speed_test_completed | upload_mbps, download_mbps |
| Engagement | advanced_settings_opened | - |
| Engagement | config_generated | genre, encoder, bitrate |
| Conversion | config_downloaded | file_size_kb |
| Engagement | guide_item_completed | item_id, category |

**実装:**
- [ ] カスタムイベント送信
  ```typescript
  import { sendGAEvent } from '@/lib/analytics';

  sendGAEvent('genre_selected', { genre_id: 'fps-high' });
  ```
- [ ] コンバージョン設定（ダウンロード完了）
- [ ] ファネル分析設定
  - ジャンル選択 → GPU検出 → 速度測定 → ダウンロード

#### 3. A/Bテスト基盤（2日間）

**Vercel Edge Middleware 活用:**
- [ ] Middleware でバリアント振り分け
  ```typescript
  // middleware.ts
  export function middleware(req: NextRequest) {
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    req.cookies.set('ab_test_variant', variant);
  }
  ```
- [ ] テストパターン例
  - ジャンル選択UI（カード型 vs リスト型）
  - CTAボタン文言（「設定生成」vs「今すぐ作成」）
  - カラースキーム（緑 vs 青）

#### 4. ダッシュボード構築（1日間）

**Vercel Analytics + Google Analytics 4:**
- [ ] リアルタイムユーザー数
- [ ] 完了率（ファネル）
- [ ] GPU検出成功率
- [ ] 平均完了時間
- [ ] デバイス・ブラウザ分布

**工数見積:** 8日間
**成果物:** Sentry統合、GA4イベント、A/Bテスト基盤

---

## 🎓 Phase 6.5: コンテンツ・マーケティング（Week 9-12）

**目的:** SEO強化、流入数増加

### 優先度: 🟢 低

### 実装項目

#### 1. ブログ記事作成（4日間）

**記事タイトル（案）:**
1. 「OBS初心者向け！配信設定を5分で自動生成する方法」
2. 「GPU別おすすめOBS設定まとめ【2026年版】」
3. 「ビットレートの決め方完全ガイド」
4. 「YouTube配信で画質と安定性を両立する設定」
5. 「回線速度別！最適なOBS設定早見表」

**実装:**
- [ ] `/blog` ルート作成
- [ ] MDX 統合（Markdown + React）
- [ ] シンタックスハイライト（Prism.js）
- [ ] 目次自動生成
- [ ] OGP画像自動生成（記事タイトル埋め込み）

#### 2. チュートリアル動画（5日間）

**動画コンテンツ:**
1. 「使い方3分解説」（デモ動画）
2. 「OBSインストールから配信開始まで」（15分）
3. 「よくある質問TOP5」（10分）

**プラットフォーム:**
- YouTube
- ニコニコ動画
- Twitter（短尺版60秒）

**実装:**
- [ ] `/tutorial` ページに動画埋め込み
- [ ] YouTube Embed + プレイリスト

#### 3. SEO最適化（3日間）

**対策:**
- [ ] メタタグ最適化
  - タイトル: 「OBS設定自動生成ツール | 初心者向け無料配信設定」
  - Description: 「GPUと回線速度を自動検出してOBS設定ファイルを生成。初心者でも5分で配信開始できます。」
- [ ] 構造化データ（JSON-LD）
  ```json
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "オートOBS設定",
    "description": "OBS配信設定の自動生成ツール",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0"
    }
  }
  ```
- [ ] sitemap.xml 生成
- [ ] robots.txt 最適化
- [ ] 内部リンク最適化

#### 4. SNS運用（継続的）

**プラットフォーム:**
- Twitter/X: 新機能リリース、Tips投稿
- Reddit: r/Twitch, r/streaming で紹介
- Discord: OBSコミュニティで共有

**工数見積:** 12日間
**成果物:** ブログ記事5本、動画3本、SEO対策

---

## 🔄 継続的改善プロセス

### 週次レビュー（毎週金曜）

1. **KPI確認**
   - 完了率、GPU検出率、Lighthouseスコア
   - ユーザーフィードバック確認
2. **優先順位の見直し**
   - データに基づく調整
   - ユーザー要望の取り込み
3. **次週計画**
   - タスクの追加・削除
   - 工数の再見積

### 月次リリース

- 月初: Phase計画確定
- 月中: 実装・テスト
- 月末: リリース・振り返り

---

## 🎯 3ヶ月後のゴール

**機能面:**
- ✅ Lighthouse スコア 95+
- ✅ LCP < 1.2秒
- ✅ 実際のOBSスクリーンショット10枚
- ✅ 設定プリセット機能
- ✅ GPU検出率95%
- ✅ FAQ・ヘルプセクション
- ✅ Sentry統合
- ✅ GA4イベントトラッキング
- ✅ ブログ記事5本

**ビジネス面:**
- 月間ユーザー数: 1,000人
- 完了率: 70%
- ユーザー満足度: 4.5/5.0
- SNSフォロワー: 500人

---

**次回更新:** 2026-03-01（Alpha リリース後のデータ分析結果を反映）
