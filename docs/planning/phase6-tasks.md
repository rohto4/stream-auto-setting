# Phase 6 実装タスク詳細

**作成日:** 2026-02-15
**対象:** Phase 6.1 パフォーマンス最適化 の詳細タスク
**形式:** すぐに着手可能なチェックリスト

---

## 🚀 Phase 6.1.1: フォント最適化（Day 1）

### 目標
- Google Fonts CDN → next/font（self-hosted）
- FOUT/FOIT 解消
- サブセット化で読み込み高速化

### タスクリスト

- [ ] **Task 1.1: next/font 導入（30分）**
  ```typescript
  // app/layout.tsx
  import { Inter, Noto_Sans_JP } from 'next/font/google';

  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
  });

  const notoSansJP = Noto_Sans_JP({
    weight: ['400', '500', '700', '900'],
    subsets: ['latin'], // 日本語は自動的に含まれる
    variable: '--font-noto-sans-jp',
    display: 'swap',
    preload: true,
  });

  export default function RootLayout({ children }) {
    return (
      <html lang="ja" className={`${inter.variable} ${notoSansJP.variable}`}>
        <body>{children}</body>
      </html>
    );
  }
  ```

- [ ] **Task 1.2: globals.css 更新（15分）**
  ```css
  body {
    font-family: var(--font-noto-sans-jp), var(--font-inter), sans-serif;
  }
  ```

- [ ] **Task 1.3: Google Fonts CDN 削除（10分）**
  - layout.tsx から `<link>` タグ削除
  - 不要な `@import` 削除

- [ ] **Task 1.4: ビルド＆検証（15分）**
  ```bash
  npm run build
  # フォントファイルが .next/static/media/ に生成されることを確認
  ```

- [ ] **Task 1.5: Lighthouse 測定（10分）**
  - Before/After のスコア比較
  - LCP改善を確認（目標: -200ms）

**所要時間:** 80分

---

## 🖼️ Phase 6.1.2: 画像最適化（Day 1-2）

### 目標
- next/image 全面導入
- WebP/AVIF 対応
- Lazy loading 実装

### タスクリスト

- [ ] **Task 2.1: next.config.ts 更新（20分）**
  ```typescript
  // next.config.ts
  const nextConfig: NextConfig = {
    images: {
      formats: ['image/avif', 'image/webp'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 31536000, // 1年
    },
  };
  ```

- [ ] **Task 2.2: アイコン画像の移行（1時間）**
  - `lib/icons/genre-icons.tsx` → SVGはそのまま（最適）
  - 外部画像がある場合のみ next/image 化

- [ ] **Task 2.3: OGP画像最適化（30分）**
  ```typescript
  // app/layout.tsx
  export const metadata: Metadata = {
    openGraph: {
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'オートOBS設定 - 配信設定自動生成ツール',
        },
      ],
    },
  };
  ```

- [ ] **Task 2.4: blur placeholder 追加（1時間）**
  ```bash
  npm install plaiceholder sharp
  ```
  ```typescript
  // lib/get-blur-data.ts
  import { getPlaiceholder } from 'plaiceholder';

  export async function getBlurData(src: string) {
    const buffer = await fetch(src).then(res => res.arrayBuffer());
    const { base64 } = await getPlaiceholder(Buffer.from(buffer));
    return base64;
  }
  ```

- [ ] **Task 2.5: Loading skeleton 実装（1時間）**
  ```tsx
  // components/ui/image-skeleton.tsx
  export function ImageSkeleton({ width, height }: { width: number; height: number }) {
    return (
      <div
        className="animate-pulse bg-muted rounded-lg"
        style={{ width, height }}
      />
    );
  }
  ```

**所要時間:** 3.5時間

---

## ⚡ Phase 6.1.3: JavaScript バンドル最適化（Day 2-3）

### 目標
- First Load JS < 70 KB（現在 78.2 KB → -8.2 KB）
- 動的インポートで初期ロード削減

### タスクリスト

#### A. lucide-react 個別インポート化（1時間）

- [ ] **Task 3.1: lib/icons/genre-icons.tsx 修正**
  ```typescript
  // Before
  import * as Icons from 'lucide-react';

  // After（必要なアイコンのみ）
  import { Crosshair, Swords, Puzzle, Mic, Gamepad2 } from 'lucide-react';
  ```
  **削減見込:** -3 KB

- [ ] **Task 3.2: lib/icons/status-icons.tsx 修正**
  ```typescript
  import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    Loader2,
    Settings,
  } from 'lucide-react';
  ```
  **削減見込:** -2 KB

#### B. 動的インポート実装（2時間）

- [ ] **Task 3.3: Advanced Settings を遅延ロード**
  ```typescript
  // components/desktop/desktop-view.tsx
  import dynamic from 'next/dynamic';

  const AdvancedSettingsPage = dynamic(
    () => import('./advanced-settings-page').then(mod => mod.AdvancedSettingsPage),
    {
      loading: () => <div>読み込み中...</div>,
      ssr: false, // クライアントサイドのみ
    }
  );
  ```
  **削減見込:** -5 KB（初期ロードから除外）

- [ ] **Task 3.4: Post-Download Guide を遅延ロード**
  ```typescript
  const GuideRequired = dynamic(() => import('@/components/post-download/guide-required'));
  const GuidePerformance = dynamic(() => import('@/components/post-download/guide-performance'));
  const GuideOptional = dynamic(() => import('@/components/post-download/guide-optional'));
  ```
  **削減見込:** -4 KB

- [ ] **Task 3.5: GPU Selector Modal を遅延ロード**
  ```typescript
  const GpuSelectorModal = dynamic(() => import('./gpu-selector-modal'));
  ```
  **削減見込:** -2 KB

#### C. Framer Motion 最適化（2時間）

- [ ] **Task 3.6: 使用箇所の洗い出し**
  ```bash
  grep -r "framer-motion" components/ lib/
  ```

- [ ] **Task 3.7: 簡単なアニメーションをCSS Transitionsに置換**
  ```tsx
  // Before（Framer Motion）
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>

  // After（CSS）
  <div className="animate-fade-in">
    {children}
  </div>
  ```
  ```css
  /* globals.css */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }
  ```
  **削減見込:** -10 KB（完全削除の場合）

- [ ] **Task 3.8: 複雑なアニメーションのみFramer Motion維持**
  - カスタムラジオ/チェックボックスのspring animation
  - Staggered children animations

**所要時間:** 5時間
**削減見込:** -16 KB（目標達成: 78.2 - 16 = 62.2 KB）

---

## 🗜️ Phase 6.1.4: キャッシュ戦略（Day 3）

### タスクリスト

- [ ] **Task 4.1: vercel.json 更新（30分）**
  ```json
  {
    "headers": [
      {
        "source": "/static/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/api/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
          }
        ]
      }
    ]
  }
  ```

- [ ] **Task 4.2: revalidate 設定（各API Route）**
  ```typescript
  // app/api/gpu/list/route.ts
  export const revalidate = 3600; // 1時間キャッシュ
  ```

**所要時間:** 30分

---

## 📊 Phase 6.1.5: Lighthouse CI 導入（Day 4）

### タスクリスト

- [ ] **Task 5.1: Lighthouse CI インストール（20分）**
  ```bash
  npm install -D @lhci/cli
  ```

- [ ] **Task 5.2: lighthouserc.json 作成（30分）**
  ```json
  {
    "ci": {
      "collect": {
        "startServerCommand": "npm run start",
        "url": ["http://localhost:3000"],
        "numberOfRuns": 3
      },
      "assert": {
        "assertions": {
          "categories:performance": ["error", { "minScore": 0.95 }],
          "categories:accessibility": ["error", { "minScore": 0.95 }],
          "categories:best-practices": ["error", { "minScore": 0.95 }],
          "categories:seo": ["error", { "minScore": 0.95 }]
        }
      },
      "upload": {
        "target": "temporary-public-storage"
      }
    }
  }
  ```

- [ ] **Task 5.3: GitHub Actions ワークフロー作成（1時間）**
  ```yaml
  # .github/workflows/lighthouse.yml
  name: Lighthouse CI
  on: [push]
  jobs:
    lighthouse:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
        - run: npm ci
        - run: npm run build
        - run: npm run start & npx wait-on http://localhost:3000
        - run: npx @lhci/cli autorun
  ```

- [ ] **Task 5.4: package.json にスクリプト追加（10分）**
  ```json
  {
    "scripts": {
      "lighthouse": "lhci autorun",
      "lighthouse:mobile": "lhci autorun --preset=mobile"
    }
  }
  ```

**所要時間:** 2時間

---

## 📈 Phase 6.1.6: Vercel Analytics 導入（Day 4）

### タスクリスト

- [ ] **Task 6.1: @vercel/analytics インストール（10分）**
  ```bash
  npm install @vercel/analytics
  ```

- [ ] **Task 6.2: layout.tsx に追加（10分）**
  ```typescript
  import { Analytics } from '@vercel/analytics/react';

  export default function RootLayout({ children }) {
    return (
      <html lang="ja">
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    );
  }
  ```

- [ ] **Task 6.3: Web Vitals レポート設定（20分）**
  ```typescript
  // app/web-vitals.tsx
  'use client';

  import { useReportWebVitals } from 'next/web-vitals';

  export function WebVitals() {
    useReportWebVitals((metric) => {
      console.log(metric);
      // Google Analytics に送信
      window.gtag?.('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_label: metric.label,
      });
    });
  }
  ```

**所要時間:** 40分

---

## ✅ Phase 6.1 完了チェックリスト

### パフォーマンス指標

- [ ] Lighthouse Performance スコア: **95+**
- [ ] LCP (Largest Contentful Paint): **< 1.2秒**
- [ ] FID (First Input Delay): **< 100ms**
- [ ] CLS (Cumulative Layout Shift): **< 0.1**
- [ ] First Load JS: **< 70 KB**

### 実装完了

- [ ] next/font 導入
- [ ] next/image 全面適用
- [ ] 動的インポート実装（3箇所以上）
- [ ] Framer Motion 最適化
- [ ] Cache-Control ヘッダー設定
- [ ] Lighthouse CI セットアップ
- [ ] Vercel Analytics 有効化

### ドキュメント更新

- [ ] `docs/reports/imp-report.md` に Phase 6.1 記録追加
- [ ] `docs/specifications/04-ui-spec.md` のパフォーマンス章更新
- [ ] README.md にLighthouseバッジ追加

---

## 🎨 Phase 6.2 タスク（次のフェーズ）

Phase 6.1 完了後、Phase 6.2（ビジュアル強化）に進みます。
詳細タスクは `phase6-roadmap.md` の Phase 6.2 セクション参照。

---

**作成者:** Claude Sonnet 4.5
**最終更新:** 2026-02-15
