# UI/UX仕様書
**Project:** オートOBS設定
**Version:** 1.0.0
**Last Updated:** 2026-02-12
**Design Principle:** ユーザーを手放さない、迷わせない、待たせない

---

## 1. 設計思想

### 1.1 UX原則

| 原則 | 実装方針 | 具体例 |
|-----|---------|--------|
| **専門用語ゼロ** | 全て具体例で説明 | 「ビットレート」→使わない、「高画質」と表現 |
| **選択肢は3つまで** | 認知負荷を最小化 | ジャンルは5択、全て具体的ゲームタイトル例示 |
| **デフォルトを明示** | 迷った時の逃げ道 | 「ほとんどの人はこれでOK」ラベル |
| **エラーを見せない** | 自動リカバリー | GPU検知失敗→自動でフォールバック、警告のみ |
| **待ち時間の体感短縮** | プログレス+娯楽 | 測定中にTips表示、アニメーション |
| **離脱防止** | 各ステップで価値提示 | 「あと30秒で完成」カウンター常時表示 |

### 1.2 カラーパレット

```typescript
// Tailwind CSS 4 カスタムテーマ
export const colors = {
  primary: {
    50: '#EEF2FF',   // 背景薄
    100: '#E0E7FF',
    500: '#6366F1',  // メインCTA
    600: '#4F46E5',  // ホバー
    700: '#4338CA',  // アクティブ
  },
  success: {
    500: '#10B981',  // 検知成功
    600: '#059669',
  },
  warning: {
    500: '#F59E0B',  // 回線速度注意
    600: '#D97706',
  },
  neutral: {
    50: '#F9FAFB',   // カード背景
    200: '#E5E7EB',  // ボーダー
    500: '#6B7280',  // テキスト補助
    900: '#111827',  // テキスト主要
  },
};
```

**アクセシビリティ:**
- コントラスト比 4.5:1 以上（WCAG AA準拠）
- カラーだけに頼らない情報伝達（アイコン併用）

---

## 2. モバイルビュー（スマホ版）

### 2.1 画面構成（ランディングページ）

```
┌─────────────────────────────┐
│  [Logo] オートOBS設定      │ ← ヘッダー（固定）
├─────────────────────────────┤
│                             │
│  🎯 配信の準備、3分で完了   │ ← ヒーローセクション
│  OBSの設定ファイルを        │
│  自動で作成します            │
│                             │
│  専門知識不要               │
│  ✅ GPU自動検知             │
│  ✅ 回線速度測定             │
│  ✅ 最適設定を自動計算       │
│                             │
│  （スクロール）              │
│                             │
│  ┌───────────────────────┐  │
│  │ 🚀 どう使うの？        │  │ ← セクション1
│  │                        │  │   動作概要
│  │ ① ジャンルを選ぶ       │  │
│  │   「激しいゲーム」など  │  │
│  │                        │  │
│  │ ② 自動で測定           │  │
│  │   GPU・回線速度を検知   │  │
│  │                        │  │
│  │ ③ ファイルをダウンロード │  │
│  │   OBSにインポートするだけ│  │
│  └───────────────────────┘  │
│                             │
│  （スクロール）              │
│                             │
│  ┌───────────────────────┐  │
│  │ ✨ こんな人におすすめ   │  │ ← セクション2
│  │                        │  │   特徴・メリット
│  │ ✅ 配信初心者           │  │
│  │    専門用語なしで設定   │  │
│  │                        │  │
│  │ ✅ 設定がよくわからない  │  │
│  │    最適値を自動計算     │  │
│  │                        │  │
│  │ ✅ すぐ配信したい       │  │
│  │    3分で準備完了       │  │
│  └───────────────────────┘  │
│                             │
│  （スクロール）              │
│                             │
│  ┌───────────────────────┐  │
│  │ 💻 PCで使ってください   │  │ ← セクション3
│  │                        │  │   PC版誘導
│  │  検索ワード:            │  │
│  │  ╔═══════════════╗    │  │
│  │  ║ オートOBS設定 ║    │  │   大きく表示
│  │  ╚═══════════════╝    │  │
│  │                        │  │
│  │  または直接アクセス:    │  │
│  │  https://obs.auto      │  │   URL表示
│  │  [URLをコピー]         │  │
│  │                        │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

### 2.2 セクション1: 動作概要

**コンポーネント:** `MobileHowItWorks.tsx`

```typescript
interface HowItWorksStep {
  number: number;
  icon: string;
  title: string;
  description: string;
}

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: 1,
    icon: '🎮',
    title: 'ジャンルを選ぶ',
    description: '「激しいゲーム」「雑談」など、配信する内容を選択',
  },
  {
    number: 2,
    icon: '🔍',
    title: '自動で測定',
    description: 'GPU・回線速度を自動検知。あなたに最適な設定を計算',
  },
  {
    number: 3,
    icon: '📥',
    title: 'ファイルをダウンロード',
    description: 'OBSにインポートするだけで完了',
  },
];
```

**ステップ表示デザイン:**
```
┌─────────────────────────────┐
│  1  🎮                      │
│  ジャンルを選ぶ              │
│  「激しいゲーム」「雑談」など │
└─────────────────────────────┘
```

---

### 2.3 セクション2: 特徴・メリット

**コンポーネント:** `MobileFeatures.tsx`

```typescript
interface Feature {
  icon: string;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: '✅',
    title: '配信初心者',
    description: '専門用語なしで設定完了',
  },
  {
    icon: '✅',
    title: '設定がよくわからない',
    description: '最適値を自動計算',
  },
  {
    icon: '✅',
    title: 'すぐ配信したい',
    description: '3分で準備完了',
  },
];
```

---

### 2.4 セクション3: PC版誘導

**コンポーネント:** `MobilePcRedirect.tsx`

```typescript
interface PcRedirectProps {
  searchKeyword: string;
  url: string;
}
```

**表示デザイン:**
```
╔═══════════════╗
║ オートOBS設定 ║  ← 検索ワード（大きく表示）
╚═══════════════╝

https://obs.auto  ← URL表示

[URLをコピー]  ← コピーボタン
```

**コピー機能:**
```typescript
async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('URLをコピーしました');
  } catch (error) {
    // フォールバック: テキスト選択
    console.error('Copy failed:', error);
  }
}
```

---

### 2.5 マイクロインタラクション

```typescript
// Framer Motion使用例（簡素化）
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
>
  {/* セクション内容 */}
</motion.div>
```

---

## 3. PCビュー（デスクトップ版）

### 3.1 画面構成

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] オートOBS設定              [ヘルプ] [GitHubリンク]   │ ← ヘッダー
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎮 配信する内容を選択してください                    │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ 🎯  激しいゲーム   [FPS向け]                │   │  │ ← Step 1
│  │  │ 60FPS高画質                                  │   │  │   ジャンル選択
│  │  │ 例: Apex Legends, VALORANT, Overwatch 2     │   │  │
│  │  │          [選択する]                          │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ ⚔️  アクションゲーム                         │   │  │
│  │  │ 動きと画質のバランス                         │   │  │
│  │  │ 例: 原神, ストリートファイター6, FF14       │   │  │
│  │  │          [選択する]                          │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  （他のジャンルカード3つ）                            │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🖥️ あなたのPC環境を確認中...                       │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  [████████████░░░░░░] 75%                   │    │  │ ← Step 2
│  │  │                                              │    │  │   GPU検知
│  │  │  ✅ GPU検知完了                             │    │  │   回線測定
│  │  │     → NVIDIA GeForce RTX 4070 を検出        │    │  │
│  │  │                                              │    │  │
│  │  │  🔄 回線速度を測定中...                      │    │  │
│  │  │     → 現在: 12.5 Mbps                       │    │  │
│  │  │                                              │    │  │
│  │  │  💡 Tip: OBSはシーンコレクションで           │    │  │
│  │  │      複数の配信スタイルを管理できます        │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ✅ 検出完了！                                       │  │
│  │                                                       │  │
│  │  🎮 配信内容: 激しいゲーム (Apex/VALORANT系)          │  │
│  │  🖥️ グラフィックカード: RTX 4070                    │  │ ← Step 3
│  │  📡 回線速度: 15.2 Mbps (配信に十分な速度です)       │  │   結果確認
│  │  ⚙️ 推奨設定: 60FPS / 9000kbps / NVENC             │  │
│  │                                                       │  │
│  │  ▼ 検出結果が違う場合のみ開く                        │  │
│  │  ┌─────────────────────────────────────┐           │  │
│  │  │ GPU手動選択: [RTX 4070 ▼]           │           │  │   アコーディオン
│  │  │ 配信内容変更: [激しいゲーム ▼]       │           │  │   （98%は触らない）
│  │  └─────────────────────────────────────┘           │  │
│  │                                                       │  │
│  │              [設定ファイルを作成]                     │  │   CTA（大きく）
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  🎉 完成しました！                                   │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  📦 obs-config.zip (12.3 KB)                │    │  │ ← Step 4
│  │  │                                              │    │  │   ダウンロード
│  │  │  [ダウンロード] ──────────────────────→    │    │  │   + ガイド
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ────────────────────────────────────────────────    │  │
│  │                                                       │  │
│  │  📋 OBSに取り込む手順（PC1画面で完結）               │  │
│  │                                                       │  │
│  │  ┌─ Step 1 ────────────────────────────────────┐   │  │
│  │  │ ✅ ダウンロードしたZIPを解凍                 │   │  │
│  │  │                                              │   │  │
│  │  │ [画像: 解凍後のフォルダ構造]                 │   │  │   動的ガイド
│  │  └──────────────────────────────────────────────┘   │  │   （GPU/OS別）
│  │                                                       │  │
│  │  ┌─ Step 2 ────────────────────────────────────┐   │  │
│  │  │ ✅ OBS > プロファイル > インポート            │   │  │
│  │  │                                              │   │  │
│  │  │ [画像: OBSメニュー画面（RTX 4070版）]        │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  ┌─ Step 3 ────────────────────────────────────┐   │  │
│  │  │ ⚠️ 必ず手動で設定してください                │   │  │
│  │  │                                              │   │  │
│  │  │ □ マイクデバイスを選択                       │   │  │   必須手動設定
│  │  │   → 設定 > 音声 > マイク音声                │   │  │
│  │  │                                              │   │  │
│  │  │ □ YouTube配信キーを入力                      │   │  │
│  │  │   → 設定 > 配信 > ストリームキー             │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                       │  │
│  │  [完了！配信を始める] ──────────────────→           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Step 1: ジャンル選択

**コンポーネント:** `DesktopGenreSelector.tsx`

```typescript
interface GenreCard {
  id: GenreId;
  title: string;
  subtitle: string;
  examples: string[];
  icon: string;
  badge?: string;
}

const GENRE_CARDS: GenreCard[] = [
  {
    id: 'fps-high',
    title: '激しいゲーム',
    subtitle: '60FPS高画質',
    examples: ['Apex Legends', 'VALORANT', 'Overwatch 2'],
    icon: '🎯',
    badge: 'FPS向け',
  },
  {
    id: 'rpg-mid',
    title: 'アクションゲーム',
    subtitle: '動きと画質のバランス',
    examples: ['原神', 'ストリートファイター6', 'FF14'],
    icon: '⚔️',
  },
  {
    id: 'puzzle-low',
    title: 'ゆっくりゲーム',
    subtitle: '超高画質',
    examples: ['雀魂', 'ぷよぷよ', 'Among Us'],
    icon: '🧩',
  },
  {
    id: 'chat',
    title: '雑談・歌配信',
    subtitle: '画質最優先',
    examples: ['雑談', '歌枠', 'お絵描き', 'ASMR'],
    icon: '🎤',
    badge: '初心者おすすめ',
  },
  {
    id: 'retro',
    title: 'レトロゲーム',
    subtitle: 'クラシックゲーム',
    examples: ['マリオ', 'ポケモン', 'ドラクエ'],
    icon: '🕹️',
  },
];
```

**カードインタラクション:**
- クリックで選択 → カード全体がハイライト
- 選択後、自動的に次のステップ（GPU検知）に進む
- キーボード操作対応（↑↓で選択、Enterで確定）

---

### 3.3 Step 2: GPU検知 & 回線測定

**コンポーネント:** `EnvironmentDetector.tsx`

```typescript
interface DetectionProgress {
  stage: 'gpu' | 'speed' | 'complete';
  progress: number; // 0-100
  gpuResult?: GpuDetectionResult;
  speedResult?: SpeedTestResult;
  tip?: string; // 待ち時間中に表示するTips
}

const TIPS = [
  'OBSはシーンコレクションで複数の配信スタイルを管理できます',
  '配信開始前は必ずマイクテストを行いましょう',
  'YouTube Studioで配信のアーカイブを確認できます',
  'OBSのプレビュー画面はCPU負荷が高いので、配信中はオフ推奨',
];
```

**プログレスバー設計:**
```typescript
// 段階的プログレス表示
const stages = [
  { name: 'GPU検知', duration: 2000, weight: 30 },
  { name: '回線測定', duration: 10000, weight: 70 },
];

// スムーズなアニメーション
<motion.div
  className="h-2 bg-primary-500 rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${progress}%` }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
/>
```

**検知中のUI:**
```
┌─────────────────────────────────────────────┐
│  [████████████░░░░░░░░░░░░] 45%            │
│                                             │
│  ✅ GPU検知完了                            │
│     → NVIDIA GeForce RTX 4070 を検出       │
│                                             │
│  🔄 回線速度を測定中... (残り 8秒)          │
│     → 現在: 12.5 Mbps ↑                    │
│     → あと少しで完了です                    │
│                                             │
│  💡 Tip: 配信開始前は必ずマイクテストを     │
│          行いましょう                       │
└─────────────────────────────────────────────┘
```

---

### 3.4 Step 3: 結果確認 & 手動調整

**コンポーネント:** `DetectionSummary.tsx`

**検知結果表示:**
```typescript
interface SummaryCard {
  icon: string;
  label: string;
  value: string;
  subtext?: string;
  status: 'success' | 'warning' | 'info';
}

const summaryCards: SummaryCard[] = [
  {
    icon: '🎮',
    label: '配信内容',
    value: '激しいゲーム (Apex/VALORANT系)',
    status: 'info',
  },
  {
    icon: '🖥️',
    label: 'グラフィックカード',
    value: 'NVIDIA GeForce RTX 4070',
    subtext: 'NVENC H.264エンコーダを使用',
    status: 'success',
  },
  {
    icon: '📡',
    label: '回線速度',
    value: '15.2 Mbps',
    subtext: '配信に十分な速度です',
    status: 'success',
  },
  {
    icon: '⚙️',
    label: '推奨設定',
    value: '60FPS / 9000kbps',
    subtext: '高画質・高フレームレート',
    status: 'success',
  },
];
```

**ステルス・オーバーライド（アコーディオン）:**
```typescript
<Accordion type="single" collapsible className="mt-4">
  <AccordionItem value="manual-override">
    <AccordionTrigger className="text-sm text-neutral-500">
      ▼ 検出結果が違う場合のみ開く
    </AccordionTrigger>
    <AccordionContent>
      <div className="space-y-3">
        <Select
          label="GPU手動選択"
          value={selectedGpu}
          onChange={setSelectedGpu}
        >
          {gpuList.map((gpu) => (
            <option key={gpu.id} value={gpu.id}>
              {gpu.name}
            </option>
          ))}
        </Select>

        <Select
          label="配信内容変更"
          value={selectedGenre}
          onChange={setSelectedGenre}
        >
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.displayName}
            </option>
          ))}
        </Select>

        <p className="text-xs text-neutral-500">
          ※ 変更すると推奨設定が再計算されます
        </p>
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

**UX配慮:**
- デフォルトで折りたたみ（98%のユーザーは開かない）
- 開いた場合も、選択肢は自動検知結果がプリセット
- 変更時は即座にプレビュー更新（楽観的UI）

---

### 3.5 Step 4: ダウンロード & ガイド

**コンポーネント:** `ConfigDownloadGuide.tsx`

**ダウンロードボタン:**
```typescript
async function handleDownload() {
  try {
    // 楽観的UI: ボタン即座に「ダウンロード中...」に変更
    setDownloadState('downloading');

    const response = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify(generateRequest),
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // ダウンロード実行
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obs-config.zip';
    a.click();

    // 成功アニメーション
    setDownloadState('success');
    confetti(); // 祝福エフェクト

    // ガイドセクションにスムーズスクロール
    setTimeout(() => {
      guideRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);

  } catch (error) {
    setDownloadState('error');
    showToast({
      type: 'error',
      title: 'ダウンロードに失敗しました',
      message: '少し待ってからもう一度お試しください',
    });
  }
}
```

**動的ガイド生成:**
```typescript
// GPU/OS別に画像を出し分け
function getGuideImage(step: string, gpu: GpuVendor, os: string): string {
  // 例: step2-nvidia-windows.png
  return `/guide/${step}-${gpu}-${os}.png`;
}

// 必須手動設定チェックリスト（動的生成）
function generateManualSteps(config: ObsConfig): GuideStep[] {
  const steps: GuideStep[] = [];

  // マイク設定（必須）
  steps.push({
    order: 1,
    title: 'マイクデバイスを選択',
    description: 'OBS > 設定 > 音声 > マイク音声デバイス',
    imageUrl: getGuideImage('mic', config.gpu.vendor, userOS),
    isRequired: true,
    category: 'audio',
  });

  // YouTube配信キー（必須）
  steps.push({
    order: 2,
    title: 'YouTube配信キーを入力',
    description: 'YouTube Studio > ライブ配信 > ストリームキーをコピー',
    imageUrl: '/guide/youtube-stream-key.png',
    isRequired: true,
    category: 'video',
  });

  // GPU固有設定（条件付き）
  if (config.gpu.vendor === 'nvidia' && config.encoder === 'ffmpeg_nvenc') {
    steps.push({
      order: 3,
      title: 'NVENC設定の確認',
      description: 'エンコーダ設定で "NVENC H.264" が選択されていることを確認',
      imageUrl: getGuideImage('encoder', 'nvidia', userOS),
      isRequired: false,
      category: 'video',
    });
  }

  return steps;
}
```

**ガイド表示例:**
```
┌─ Step 1 ────────────────────────────────┐
│ ✅ ダウンロードしたZIPを解凍             │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ [解凍後のフォルダ構造の画像]      │   │
│ │                                  │   │
│ │ obs-config/                      │   │
│ │ ├─ basic.ini                     │   │
│ │ └─ service.json                  │   │
│ └──────────────────────────────────┘   │
└──────────────────────────────────────────┘

┌─ Step 2 ────────────────────────────────┐
│ ✅ OBS > プロファイル > インポート        │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ [OBSメニュー画面]                 │   │
│ │ （RTX 4070 + Windows 11版）      │   │
│ └──────────────────────────────────┘   │
│                                          │
│ 📝 インポート時の注意:                  │
│    • 既存設定は上書きされません         │
│    • 新しいプロファイルが追加されます   │
└──────────────────────────────────────────┘

┌─ Step 3 ────────────────────────────────┐
│ ⚠️ 必ず手動で設定してください           │
│                                          │
│ □ マイクデバイスを選択                   │
│   → 設定 > 音声 > マイク音声            │
│                                          │
│ □ YouTube配信キーを入力                  │
│   → 設定 > 配信 > ストリームキー         │
│                                          │
│ [YouTube Studioで確認する] ───→        │
└──────────────────────────────────────────┘
```

---

## 4. 共通コンポーネント

### 4.1 トースト通知

```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // ms
  action?: {
    label: string;
    onClick: () => void;
  };
}

// 使用例
showToast({
  type: 'success',
  title: '設定ファイルを作成しました',
  message: 'ダウンロードが開始されます',
  duration: 3000,
});
```

### 4.2 ローディングスピナー

```typescript
// 3種類のローディング状態
type LoadingState = 'spinner' | 'progress' | 'skeleton';

// Spinner: 即座の応答（<1秒）
<Spinner size="sm" />

// Progress: 進行状況がある（1-15秒）
<ProgressBar value={progress} max={100} />

// Skeleton: コンテンツ構造が見える（初回ロード）
<Skeleton className="h-20 w-full" />
```

### 4.3 エラー境界

```typescript
// グローバルエラーハンドラー
export function GlobalErrorBoundary({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              予期しないエラーが発生しました
            </h1>
            <p className="text-neutral-500 mb-6">
              ページを再読み込みしてください
            </p>
            <Button onClick={() => window.location.reload()}>
              再読み込み
            </Button>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        // エラーログ送信（Vercel Analytics等）
        console.error('Global Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## 5. レスポンシブ設計

### 5.1 ブレークポイント

```typescript
const breakpoints = {
  sm: '640px',  // スマホ縦
  md: '768px',  // タブレット
  lg: '1024px', // PC
  xl: '1280px', // 大画面PC
};
```

### 5.2 モバイル/PC自動切り替え

```typescript
'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';

export function AdaptiveView() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## 6. アクセシビリティ（a11y）

### 6.1 キーボードナビゲーション

| 画面 | 操作 | 動作 |
|-----|------|------|
| コード入力 | Tab | 次の入力欄に移動 |
| コード入力 | Backspace（空欄時） | 前の入力欄に移動 |
| ジャンル選択 | ↑↓ | カード選択移動 |
| ジャンル選択 | Enter/Space | 選択確定 |
| 全画面 | Esc | モーダル/アコーディオンを閉じる |

### 6.2 ARIA属性

```tsx
// プログレスバー
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="環境検知の進捗"
>
  <div style={{ width: `${progress}%` }} />
</div>

// トースト通知
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  {toast.message}
</div>

// 必須フィールド
<label htmlFor="session-code">
  セッションコード
  <span aria-label="必須" className="text-red-500">*</span>
</label>
```

---

## 7. パフォーマンス最適化

### 7.1 画像最適化

```typescript
import Image from 'next/image';

// Next.js Image コンポーネント使用
<Image
  src="/guide/step1-nvidia-windows.png"
  alt="OBSインポート手順（NVIDIA GPU版）"
  width={800}
  height={450}
  loading="lazy" // 遅延ロード
  placeholder="blur" // ぼかしプレースホルダー
  blurDataURL={blurDataUrl}
/>
```

### 7.2 コード分割

```typescript
// 動的インポート（ガイドセクションは初回表示不要）
const DynamicGuide = dynamic(() => import('@/components/DynamicGuide'), {
  loading: () => <Skeleton className="h-96" />,
  ssr: false, // クライアントのみ
});
```

---

## 8. ダウンロード後ガイド画面（Phase 4: 実装済み）

### 8.1 概要

ZIPファイルダウンロード完了後に表示する、OBS手動設定ガイド機能。
basic.ini/service.jsonでは設定できない項目を、初心者向けに画像（またはテキスト）付きで案内する。

**目的:**
- 初心者の離脱を防ぐ（設定ファイルをダウンロードしただけで満足してしまうのを防ぐ）
- 必須設定の漏れを防ぐ（YouTube配信キー、マイク、ゲームキャプチャなど）
- パフォーマンス最適化を支援（影響度を明示して選択させる）

### 8.2 画面構成

#### 8.2.1 完了画面（拡張版）

```
┌─────────────────────────────────────┐
│ 🎉 設定ファイルのダウンロード完了！   │
├─────────────────────────────────────┤
│ ZIPファイル: obs-config-xxxxx.zip   │
│ サイズ: 1.6 KB                       │
│                                     │
│ 次のステップ: OBSで手動設定          │
│                                     │
│ [📥 ZIPファイルのインポート方法]     │
│ [⚙️ 必須設定ガイドを見る] ← 推奨     │
│                                     │
│ [最初に戻る]                         │
└─────────────────────────────────────┘
```

**インタラクション:**
- 「必須設定ガイドを見る」をクリック → 必須設定ガイド画面へ
- 「ZIPファイルのインポート方法」をクリック → インポート手順モーダル表示

#### 8.2.2 必須設定ガイド画面

```
┌─────────────────────────────────────┐
│ ✅ 必須設定（配信前に必ず設定）       │
├─────────────────────────────────────┤
│ 以下の3つは必ず設定してください       │
│ 設定しないと配信を開始できません      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 1️⃣ YouTube配信キーの設定             │
│                                     │
│ 【説明】                             │
│ YouTube Liveの配信キーを設定しないと │
│ 配信を開始できません。               │
│                                     │
│ 推定時間: 2分                        │
│                                     │
│ [📸 画像で見る] [📝 テキストで見る]   │
│                                     │
│ ☐ 設定完了                          │
└─────────────────────────────────────┘

（2, 3も同様）

┌─────────────────────────────────────┐
│ 進捗: 0/3 完了                       │
│                                     │
│ [次へ: パフォーマンス設定]             │
└─────────────────────────────────────┘
```

**インタラクション:**
- 「画像で見る」クリック → 画像モーダル表示（将来実装）
- 「テキストで見る」クリック → 手順テキスト展開
- チェックボックスで完了管理
- 進捗バー表示

#### 8.2.3 パフォーマンス設定ガイド画面

```
┌─────────────────────────────────────┐
│ ⚡ パフォーマンス最適化（推奨）        │
├─────────────────────────────────────┤
│ 配信を快適にするための設定です        │
│ 必要なものだけ選んでください          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ☑️ プレビュー画面を無効化             │
│ 影響度: 🔴 大（CPU使用率 -10-15%）   │
│                                     │
│ 【説明】                             │
│ 配信中はプレビューを見ないので        │
│ 無効化してCPU負荷を減らします         │
│                                     │
│ 推定時間: 10秒                       │
│                                     │
│ [📝 手順を見る]                      │
│                                     │
│ ☐ 設定完了                          │
└─────────────────────────────────────┘

（5, 6も同様）

┌─────────────────────────────────────┐
│ 選択: 0/3                            │
│                                     │
│ [詳細設定を見る] [スキップして完了]    │
└─────────────────────────────────────┘
```

**インタラクション:**
- チェックボックスで設定を選択
- 影響度を色分け表示（🔴大 🟡中 🟢小）
- スキップ可能

#### 8.2.4 詳細設定ガイド画面

```
┌─────────────────────────────────────┐
│ 🔧 その他の最適化設定（任意）         │
├─────────────────────────────────────┤
│ より詳細な設定です（スキップ可）      │
└─────────────────────────────────────┘

（項目7-10を同様のフォーマットで表示）

┌─────────────────────────────────────┐
│ [完了]                               │
└─────────────────────────────────────┘
```

### 8.3 コンポーネント設計

```typescript
// GuideItem型定義
interface GuideItem {
  id: string;
  title: string;
  category: 'required' | 'performance-high' | 'performance-mid' | 'optional';
  priority: number; // 1-5
  impact: 'high' | 'medium' | 'low' | 'none';
  impactDescription?: string;
  description: string;
  steps: string[];
  imageUrl?: string;
  imagePlaceholder?: string; // ASCII図など
  estimatedTime?: number; // 秒
}

// GuideProgress型定義
interface GuideProgress {
  requiredCompleted: number;
  performanceSelected: string[];
  optionalCompleted: number;
  currentStep: 'required' | 'performance' | 'optional' | 'complete';
}
```

### 8.4 ファイル構成

```
components/
├── post-download/
│   ├── guide-complete.tsx         # 完了画面（拡張版）
│   ├── guide-required.tsx         # 必須設定ガイド
│   ├── guide-performance.tsx      # パフォーマンス設定ガイド
│   ├── guide-optional.tsx         # 詳細設定ガイド
│   └── guide-item.tsx             # ガイド項目コンポーネント
```

### 8.5 詳細仕様

詳細な要件定義は `docs/POST_DOWNLOAD_GUIDE.md` を参照。

- 全10項目の設定ガイド
- 画像対応（将来実装、現在はテキストPlaceholder）
- 完了チェック機能
- 進捗表示
- 影響度の視覚化

---

## 9. まとめ

このUI/UX仕様は以下を実現します:

1. **専門知識不要** - 全て具体例・平易な言葉で説明
2. **離脱ゼロ** - 各ステップで価値提示、待ち時間に娯楽
3. **エラーレス** - 自動リカバリー、フォールバック完備
4. **最短経路** - 画面遷移3回以内、入力項目最小限
5. **信頼感** - プログレス表示、検知結果の視覚的フィードバック
6. **手厚いサポート** - ダウンロード後も手動設定をガイド（Phase 4）

**Next Step:** `logic-flow.md` でGPU検知・エンコーダ判定の実装詳細を定義します。
