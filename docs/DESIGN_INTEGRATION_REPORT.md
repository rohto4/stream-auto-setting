# 設計情報統合レポート
**Project:** オートOBS設定（YouTube Live特化型OBS設定自動生成）
**Version:** 1.0.0
**Generated:** 2026-02-12
**Status:** 🟢 設計完了、実装準備完了

---

## I. Executive Summary（経営層向け要約）

### プロジェクト目標
YouTube Live配信初心者向けに、OBS Studio設定ファイルを**自動生成するWebアプリケーション**を開発します。

### 主要特徴
✅ **専門知識不要** - GPU・回線速度を自動検知し、最適な設定を3分以内に生成
✅ **ユーザー離脱ゼロ** - エラー画面なし、全段階でフォールバック対応
✅ **YouTube公式準拠** - 推奨ビットレート・キーフレーム間隔を厳守
✅ **軽量・高速** - Next.js SSR、CDN配信、初回表示1.5秒以内

### リリーススケジュール
- **α版** → 2026-02-28（MVP、基本機能のみ）
- **β版** → 2026-03-15（動的ガイド画像、分析機能）
- **v1.0** → 2026-04-30（Twitch対応、AI診断）

### 開発体制
- **α版:** 個人開発（フルスタック）
- **β版以降:** チーム拡張（フロントエンド、バックエンド、デザイナー）

---

## II. システムアーキテクチャ

### 2.1 ユーザージャーニー

```
スマホユーザー
  ↓（検索）
[Mobile Landing Page]
  ├─ サービス紹介
  ├─ 動作概要
  └─ PC版誘導（URL + 検索ワード表示）

PC版ユーザー（直接訪問）
  ↓
[Desktop Main Application]
  ├─ Step 1: ジャンル選択（5選択肢）
  ├─ Step 2: GPU検知 + 回線測定（並列実行）
  ├─ Step 3: 結果確認（手動調整UI隠す）
  ├─ Step 4: ダウンロード + 動的ガイド表示
  └─ Post-Download: 必須設定ガイド（Phase 4）
```

### 2.2 技術スタック

| カテゴリ | 技術 | 選定理由 |
|---------|------|---------|
| **Frontend** | Next.js 15 App Router | SSR/SSG → SEO、高速化 |
| **Language** | TypeScript 5 | 型安全性、開発速度向上 |
| **Styling** | Tailwind CSS 4 + shadcn/ui | 高速開発、アクセシビリティ標準 |
| **State** | React Server Components | サーバー状態を直接利用 |
| **Form** | React Hook Form + Zod | バリデーション高速、UX最適 |
| **Animation** | Framer Motion | マイクロインタラクション |
| **Backend API** | Next.js API Routes | フロントと統合、デプロイ簡単 |
| **Database** | SQLite (better-sqlite3) | セットアップ不要、高速、軽量 |
| **File Compression** | JSZip | ブラウザ内で圧縮 |
| **Fuzzy Search** | Fuse.js | GPU名の曖昧マッチング |
| **Hosting** | Vercel | Next.js最適化、自動CDN配信 |

### 2.3 システム全体図

```
┌─ Frontend (Next.js 15) ─────────────────────┐
│                                             │
│  [Mobile Page]      [Desktop Page]         │
│  ├─ Hero Section   ├─ Genre Selector       │
│  ├─ Features      ├─ Environment Detector  │
│  └─ PC Redirect   ├─ Detection Summary     │
│                   └─ Download Guide        │
│                                             │
│  └─ GPU Detector (Client-side)             │
│     └─ WebGL + WEBGL_debug_renderer_info   │
│     └─ Speed Tester (Cloudflare API)       │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Backend (Next.js API) ─────────────────────┐
│                                             │
│  /api/generate       (Main flow)            │
│  /api/gpu/map        (GPU mapping)          │
│  /api/speed-test     (Speed test logging)   │
│                                             │
│  └─ Core Logic Modules                     │
│     ├─ GPU Mapper (Fuse.js fuzzy search)   │
│     ├─ Bitrate Calculator                  │
│     ├─ OBS Template Engine                 │
│     └─ ZIP Generator                       │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Data Layer ────────────────────────────────┐
│                                             │
│  SQLite Database                            │
│  ├─ gpu_mappings (マスターデータ)           │
│  │  └─ 60+ GPU/SoC、各エンコーダ情報       │
│  │                                         │
│  └─ genre_configs (ジャンル設定)            │
│     └─ 5ジャンル、係数・FPS・画質値        │
│                                             │
└─────────────────────────────────────────────┘
           ↓
┌─ Output ───────────────────────────────────┐
│                                             │
│  config.zip (ダウンロード)                  │
│  ├─ basic.ini (OBSプロファイル)            │
│  ├─ service.json (YouTube設定)             │
│  └─ README.txt (使い方)                    │
│                                             │
│  + Dynamic Guide HTML                      │
│    ├─ GPU/OS別画像                         │
│    ├─ 必須設定チェックリスト               │
│    └─ リンク (YouTube Studio, etc.)        │
│                                             │
└─────────────────────────────────────────────┘
```

---

## III. コア機能設計

### 3.1 GPU検知（WebGL + Database Fuzzy Matching）

**精度目標:** 90%以上の確度で正確なエンコーダを判定

```
Input: WebGL Raw Name
  例: "ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)"

  ↓ (正規化処理)

Normalized Name: "NVIDIA GeForce RTX 4070"

  ↓ (DB検索)

Step 1: 完全一致検索
  → Found → Return (confidence: 1.0)

Step 2: Fuse.js 曖昧検索（類似度70%以上）
  → Found & score < 0.2 → Return (confidence: 0.8-0.9)

Step 3: ベンダー判定のみ
  → "nvidia", "amd", "intel", "apple", "unknown"
  → Return fallback (confidence: 0.5)

  ↓

Output: GpuMapping + confidence
  ├─ encoder: "ffmpeg_nvenc"
  ├─ preset: "p5"
  ├─ maxBitrate: 9000
  ├─ tier: 1
  └─ confidence: 0.95
```

**対応GPU:** NVIDIA 60+、AMD 30+、Intel 10+、Apple 10+（計110+ GPU/SoC）

### 3.2 回線速度測定（Cloudflare API）

**計測時間:** 10秒以内
**測定項目:** Upload速度、Download速度、Latency、Jitter

```
Timeline:
├─ 0-2秒: Latency/Jitter測定（5回ping平均）
├─ 2-6秒: Download速度測定（10MB）
├─ 6-10秒: Upload速度測定（5MB）
└─ 結果: { uploadMbps, downloadMbps, latencyMs, jitterMs }

Speed Tier Mapping:
├─ ≥15 Mbps: "excellent" (最高画質対応)
├─ 10-15 Mbps: "good" (推奨設定)
├─ 6-10 Mbps: "fair" (警告表示)
└─ <6 Mbps: "poor" (注意喚起)
```

### 3.3 OBS設定計算（ビットレート・FPS・解像度・エンコーダ決定）

**基準式:**
```
最終ビットレート =
  min(
    回線速度 × 1000 × 0.7 × ジャンル係数,  // 安全マージン 30%
    GPU最大ビットレート,                  // GPU性能上限
    YouTube推奨最大値                     // 4500-9000 kbps
  )

FPS決定 =
  ジャンルのfps_priority ≥ 8 ? 60 : 30

解像度決定 =
  (ビットレート < 5000) OR (雑談 AND 画質優先) ? 720p : 1080p

エンコーダ = GPU Mapping から取得
プリセット = GPU Tier + ジャンルのfps_priority/quality_priority から決定
```

**計算例（FPS高負荷 × RTX 4070 × 15Mbps）:**
```
基準 = 15.2 × 1000 × 0.7 = 10,640 kbps
係数 = 10,640 × 1.0 = 10,640 kbps (fps-high)
GPU上限 = min(10,640, 9000) = 9,000 kbps
最終 = 9,000 kbps → 100kbps単位で丸め → 9000 kbps

FPS = 60 (fps_priority = 10)
解像度 = 1920x1080 (ビットレート ≥ 5000)
エンコーダ = ffmpeg_nvenc, preset = p5
```

### 3.4 ファイル生成

**出力ファイル:**

1. **basic.ini** (OBSプロファイル)
   - [Video] セクション: 1920x1080 base, output 1920x1080 or 1280x720
   - [SimpleOutput] セクション: エンコーダ、プリセット、ビットレート、キーフレーム
   - [Audio] セクション: 48kHz stereo固定

2. **service.json** (YouTube配信設定)
   ```json
   {
     "type": "rtmp_custom",
     "settings": {
       "server": "rtmp://a.rtmp.youtube.com/live2",
       "key": "YOUR_STREAM_KEY_HERE",  // プレースホルダー
       "use_auth": false
     }
   }
   ```

3. **ZIP圧縮** (JSZip使用)
   - `obs-config/basic.ini`
   - `obs-config/service.json`
   - `obs-config/README.txt`

---

## IV. データベース設計

### 4.1 テーブル構成

**Table 1: gpu_mappings**
```sql
CREATE TABLE gpu_mappings (
  gpu_name TEXT PRIMARY KEY,           -- "NVIDIA GeForce RTX 4070"
  vendor TEXT NOT NULL,                -- "nvidia", "amd", "intel", "apple", "unknown"
  encoder TEXT NOT NULL,               -- "ffmpeg_nvenc", "ffmpeg_amf", etc.
  preset TEXT NOT NULL,                -- "p5", "balanced", "quality", etc.
  max_bitrate INTEGER NOT NULL,        -- 9000 kbps (example)
  supports_hevc BOOLEAN DEFAULT 0,     -- HEVC対応フラグ
  supports_av1 BOOLEAN DEFAULT 0,      -- AV1対応フラグ
  tier INTEGER NOT NULL                -- 1=High, 2=Mid, 3=Low
);

CREATE INDEX idx_gpu_vendor ON gpu_mappings(vendor);
CREATE INDEX idx_gpu_tier ON gpu_mappings(tier);
```

**レコード数:** 111 GPU/SoC
- NVIDIA: 35（RTX 50/40/30/16シリーズ）
- AMD: 30（RX 8000/7000/6000シリーズ）
- Intel: 10（Arc B/A、内蔵GPU）
- Apple: 10（M4/M3/M2/M1シリーズ）
- Unknown: 1（フォールバック用）

**Table 2: genre_configs**
```sql
CREATE TABLE genre_configs (
  genre_id TEXT PRIMARY KEY,          -- "fps-high", "rpg-mid", "puzzle-low", "chat", "retro"
  display_name TEXT NOT NULL,         -- "激しいゲーム"
  example_games TEXT NOT NULL,        -- "Apex Legends,VALORANT,..."
  bitrate_multiplier REAL NOT NULL,   -- 1.0, 0.85, 0.7, 0.6, 0.65
  fps_priority INTEGER NOT NULL,      -- 1-10（10=最優先）
  quality_priority INTEGER NOT NULL,  -- 1-10（10=最優先）
  recommended_fps INTEGER NOT NULL,   -- 30, 60
  keyframe_interval INTEGER NOT NULL  -- 2, 4 秒
);
```

**レコード数:** 5ジャンル
1. fps-high: 激しいゲーム (係数1.0, FPS60)
2. rpg-mid: アクションゲーム (係数0.85, FPS60)
3. puzzle-low: ゆっくりゲーム (係数0.7, FPS30)
4. chat: 雑談・歌配信 (係数0.6, FPS30)
5. retro: レトロゲーム (係数0.65, FPS60)

### 4.2 型定義（TypeScript）

```typescript
// GPU関連
type GpuVendor = 'nvidia' | 'amd' | 'intel' | 'apple' | 'unknown';
type GpuTier = 1 | 2 | 3;

interface GpuMapping {
  gpuName: string;
  vendor: GpuVendor;
  encoder: string;
  preset: string;
  maxBitrate: number;
  supportsHevc: boolean;
  supportsAv1: boolean;
  tier: GpuTier;
}

interface GpuDetectionResult {
  rawName: string;
  normalized: string;
  mapping: GpuMapping;
  confidence: number;  // 0-1
}

// ジャンル関連
type GenreId = 'fps-high' | 'rpg-mid' | 'puzzle-low' | 'chat' | 'retro';

interface GenreConfig {
  genreId: GenreId;
  displayName: string;
  exampleGames: string[];
  bitrateMultiplier: number;
  fpsPriority: number;
  qualityPriority: number;
  recommendedFps: 30 | 60;
  keyframeInterval: number;
}

// 回線速度
interface SpeedTestResult {
  uploadMbps: number;
  downloadMbps: number;
  latencyMs: number;
  jitterMs: number;
  timestamp: Date;
}

// OBS設定
interface ObsConfig {
  encoder: string;
  preset: string;
  bitrate: number;
  keyframeInterval: number;
  fps: 30 | 60;
  outputResolution: '1920x1080' | '1280x720';
  baseResolution: '1920x1080';
  bFrames: number;
  lookahead: boolean;
  psychoVisualTuning: boolean;
  gpuScheduling: boolean;
}
```

---

## V. UI/UX設計

### 5.1 モバイルビュー（ランディングページ）

**目的:** PC版への誘導
**構成:**
1. ヒーロー: 3分で配信準備完了
2. 動作概要: 3ステップで説明
3. 特徴メリット: 4項目の検査方法ごとのメリット
4. **PC版誘導: 検索ワード + URLコピー機能**

**UX特徴:**
- シンプルなランディングページ
- スクロール操作のみ
- 実機能なし（PC版へのゲートウェイ）

### 5.2 デスクトップビュー（メインアプリケーション）

#### Step 1: ジャンル選択
- **形式:** 5枚のカード
- **情報:** タイトル、サブタイトル、例示ゲーム3-4個、アイコン、バッジ（推奨）
- **インタラクション:** クリックで選択 → 自動的にStep 2へ

#### Step 2: GPU検知 & 回線測定（並列実行）
- **プログレスバー:** 0-100%でスムーズアニメーション
- **進捗表示:**
  - 0-30%: GPU検知中
  - 30-100%: 回線速度測定中（Tip表示）
- **フォールバック:** 検知失敗時も10Mbpsの保守的値を使用

#### Step 3: 結果確認
- **表示内容:** ジャンル、GPU名、回線速度、推奨設定
- **ステルスUI:** アコーディオン内に手動変更UI（98%のユーザーは触らない）
- **警告:** 回線速度不足時は明確に表示

#### Step 4: ダウンロード & ガイド
- **ダウンロードボタン:** 楽観的UI（即座に「ダウンロード中」に）
- **成功時:** 祝福エフェクト + ガイドセクションへスクロール
- **動的ガイド:** GPU/OS別の画像 + チェックリスト表示

### 5.3 カラーパレット（Tailwind CSS 4）

```typescript
colors = {
  primary: { 50: '#EEF2FF', 500: '#6366F1', 600: '#4F46E5' },  // Indigo
  success: { 500: '#10B981', 600: '#059669' },                 // Emerald
  warning: { 500: '#F59E0B', 600: '#D97706' },                 // Amber
  neutral: { 50: '#F9FAFB', 200: '#E5E7EB', 900: '#111827' }   // Slate
};
```

**アクセシビリティ:** コントラスト比 4.5:1以上（WCAG AA準拠）

### 5.4 パフォーマンス目標

| 項目 | 目標値 | 実装方法 |
|-----|--------|---------|
| 初回表示 | 1.5秒以内 | Next.js SSR、画像最適化 |
| GPU検知 | 2秒以内 | WebGL初期化、キャッシュ |
| 回線測定 | 10秒以内 | 並列実行、タイムアウト15秒 |
| ファイル生成 | 3秒以内 | Server Actions、ストリーミング |
| TTI | 2秒以内 | JavaScript分割、Lazy Load |

---

## VI. セキュリティ設計

### 6.1 脅威対策

| 脅威 | 対策 | 効果 |
|-----|------|------|
| Rate Limiting | IP/セッション単位の制限 | 10req/min, 5生成/hour |
| XSS | Next.js自動エスケープ + CSP Header | コンテンツインジェクション防止 |
| CSRF | Server Actions トークン認証 | クロスサイトリクエスト防止 |
| SQLインジェクション | Prepared Statements | 入力値エスケープ |

### 6.2 プライバシー設計

- **個人情報収集:** なし（メアド、名前等不要）
- **GPU情報:** クライアント側のみ、サーバーに保存しない
- **セッションデータ:** 24時間後自動削除
- **Analytics:** Vercel Analytics（匿名化済み）

---

## VII. 実装ロードマップ

### Phase 0: 環境構築（2/11-2/12）
- [ ] Next.js 15初期化
- [ ] TypeScript + Tailwind CSS設定
- [ ] shadcn/ui基本コンポーネント導入
- [ ] SQLiteデータベース初期化

### Phase 1: コア機能実装（2/13-2/19）
- [ ] GPU検知ロジック（WebGL + Fuse.js）
- [ ] 回線速度測定（Cloudflare API）
- [ ] OBS設定計算ロジック
- [ ] ファイル生成機能（ZIP化）

### Phase 2: UI実装（2/20-2/23）
- [ ] PCビュー: ジャンル選択・GPU検知・結果確認・ダウンロード
- [ ] モバイルビュー: ランディングページ＋PC誘導
- [ ] アニメーション・トースト通知実装

### Phase 3: テスト・調整（2/25-2/27）
- [ ] 実機テスト（Windows 4台, Mac 1台, iOS, Android）
- [ ] GPU検知精度確認（110+ GPU テスト）
- [ ] バグ修正・パフォーマンス最適化
- [ ] ドキュメント整備

### Phase 4: α版デプロイ（2/28）
- [ ] Vercelへデプロイ
- [ ] OGP・メタタグ設定
- [ ] Google Analytics統合
- [ ] リリースチェックリスト確認

### Phase 5: β版機能（実装予定）
- [ ] 動的ガイド画像生成（Sharp.js）
- [ ] OBS連携API（obs-websocket）
- [ ] ユーザー環境統計ダッシュボード

---

## VIII. 非機能要件

### 8.1 スケーラビリティ

| フェーズ | 想定負荷 | インフラ | DB |
|---------|---------|---------|-----|
| α版 | 100セッション/日 | Vercel Hobby（無料） | SQLite |
| β版 | 1,000セッション/日 | Vercel Pro ($20/月) | SQLite |
| v1.0 | 10,000セッション/日 | PostgreSQL移行 | PostgreSQL |

### 8.2 品質基準

| 項目 | 目標値 | 測定方法 |
|-----|--------|---------|
| GPU検知成功率 | 90%以上 | 実機テスト |
| 設定生成成功率 | 99%以上 | エラー監視 |
| ページ表示速度 | 2秒以内 | Lighthouse |
| ファイル生成時間 | 3秒以内 | パフォーマンステスト |

---

## IX. リスク管理

### 9.1 主要リスク

| リスク | 影響度 | 確率 | 対策 |
|-------|--------|------|------|
| GPU検知精度不足 | High | Medium | フォールバック強化、手動選択UI |
| 回線測定API障害 | Medium | Low | タイムアウト処理、保守的デフォルト |
| OBS仕様変更 | High | Low | OBS beta版事前検証 |
| 開発遅延 | Medium | Medium | MVP優先、β版に機能延期 |

### 9.2 技術的負債

| 項目 | 現状（α版） | 理想 | 対応時期 |
|-----|-----------|------|---------|
| DB | SQLite（マスタのみ） | PostgreSQL | v1.0 |
| 画像配信 | Static Files | CDN | β版 |
| GPU検知 | WebGLのみ | + User-Agent | v1.0 |
| 回線測定 | Cloudflare API | 自前測定 | v1.5 |

---

## X. 成功指標（α版）

### 10.1 ユーザーフロー（Funnel分析）

```
100% → Desktop訪問
  90% → ジャンル選択
  85% → GPU検知完了
  80% → 結果確認
  75% → ダウンロード実行
  70% → 設定生成完了（KPI）
```

**目標:** 設定生成完了率 70%以上

### 10.2 主要KPI

| KPI | 目標値 | 測定方法 |
|-----|--------|---------|
| GPU検知成功率 | 90%以上 | ログ分析 |
| ファイルDL率 | 95%以上 | イベントトラッキング |
| OBS Import成功率 | 85%以上 | ユーザーフィードバック |
| 平均滞在時間 | 3分以内 | Session Replay |

---

## XI. ドキュメント参照ガイド

| 詳細が必要な場合 | 参照ドキュメント |
|---------------|-----------------|
| 技術スタック詳細 | `docs/tech-stack.md` |
| アーキテクチャ全体 | `docs/lv1/architecture.md` |
| DB設計・型定義 | `docs/lv1/data-schema.md` |
| ロジック実装詳細 | `docs/lv1/logic-flow.md` |
| UI/UX仕様書 | `docs/lv1/ui-spec.md` |
| 開発ロードマップ | `docs/lv1/implementation-plan.md` |
| 設定値マトリクス | `docs/lv1/obs-config-matrix.md` |
| Post-Download Guide | `docs/POST_DOWNLOAD_GUIDE.md` |
| DDD開発アプローチ | `docs/default/DDD.md` |

---

## XII. 今後の対応（β版・v1.0）

### 12.1 β版で追加予定（3月中旬）

✨ **動的ガイド強化**
- Sharp.jsで GPU/OS別画像を動的生成
- スクリーンショット付き手順書
- 動画ガイド埋め込み

⚡ **回線測定高度化**
- 複数回測定の平均値使用
- ジッター・パケットロス検出
- 測定履歴グラフ表示

📊 **分析機能**
- ユーザー環境統計ダッシュボード
- GPU検知成功率レポート
- 人気ジャンル分析

### 12.2 v1.0で計画中（4月末）

🎮 **Twitch対応**
- Twitch配信キー対応
- マルチストリーム設定

🤖 **AI診断機能**
- マイク音質AI診断
- ノイズ除去設定提案

🎬 **シーン自動生成**
- 配信内容から逆算してシーン自動生成
- OpenAI API、画像認識連携

---

## XIII. 開発ガイドライン

### 13.1 Document-Driven Development (DDD)

このプロジェクトは **DDD方式** で開発されています：

✅ **実装前に設計書を確認**
- `docs/lv1/` の各ドキュメントが「信頼できる唯一の情報源（SSOT）」
- コード生成前に関連ドキュメントを読む

✅ **仕様変更時は設計書を先に更新**
- バグ修正でも、まず `docs/` を更新
- その後、ユーザーの承認を得た上でコード修正

✅ **一貫性保証**
- TypeScript型定義とDBスキーマが整合していることを確認
- UIコンポーネント仕様と実装が乖離していないか確認

### 13.2 質問テンプレート

要件が不明確な場合は、質問をナンバリング：

```
[ARC-001] GPU検知失敗時の手動選択UIをどこに配置すべき？
   選択肢：
   A. メインの結果表示下部
   B. アコーディオン（デフォルト非表示）
   C. 別ページ
```

### 13.3 出力形式

**長文の出力:** ファイル形式で出力
**短文の回答:** インライン回答

---

## XIV. まとめ

### 14.1 プロジェクトの強み

1. ✅ **明確な設計** - 全フェーズが設計ドキュメント化済み
2. ✅ **ユーザー中心** - "ユーザーを手放さない"を全施策の中心に
3. ✅ **テクノロジー選定** - 最新の Next.js 15、TypeScript、Tailwind CSS
4. ✅ **スケーラビリティ** - SQLite → PostgreSQL への移行パスが明確
5. ✅ **品質基準** - 設定生成成功率 99%、GPU検知 90%以上の具体的目標

### 14.2 実装優先度

**Phase 0-3で達成すること（MVP）:**

必須機能：
- ✅ モバイル版：宣伝・動作概要・PC誘導
- ✅ PC版：ジャンル選択・GPU検知・回線測定・設定生成
- ✅ OBS設定ファイル生成（basic.ini, service.json）
- ✅ 基本的なガイド表示

延期する機能：
- ❌ 動的ガイド画像生成（β版）
- ❌ OBS連携API（β版）
- ❌ 詳細な分析ダッシュボード（v1.0）

### 14.3 成功のポイント

🎯 **3つの成功要因**

1. **GPU検知精度**
   - WebGL + Fuse.js で110+ GPUをカバー
   - フォールバックで必ず設定ファイルを生成

2. **ユーザー離脱防止**
   - 各ステップで価値提示
   - プログレス表示で待ち時間を体感短縮
   - エラー画面ゼロ設計

3. **YouTube準拠**
   - 公式推奨値を厳守（1080p60 = 4500-9000kbps）
   - ビットレート計算式は検証済み
   - 配信品質を保証

---

**Next Step:** 実装開始！
推奨開始順序：
1. `lib/db/schema.ts` - テーブル定義・初期データ
2. `lib/gpu-detector.ts` - GPU検知ロジック
3. `lib/speed-tester.ts` - 回線速度測定
4. `lib/obs-config-calculator.ts` - 設定計算
5. `components/desktop/` - UI実装

---

**Document Status:** 🟢 Complete
**Last Updated:** 2026-02-12
**Next Review:** Phase 3テスト時（2026-02-25）
