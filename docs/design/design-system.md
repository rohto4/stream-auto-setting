# デザインシステム
**Project:** オートOBS設定
**Version:** 2.0.0
**Last Updated:** 2026-02-14
**Status:** UI Redesign Complete

---

## 概要

このデザインシステムは、"生成AIのポン出しサイトと差別化する"ことを目的に、独自のブランドアイデンティティを確立します。

### デザイン哲学
> **"ビギナーの親しみやすさ × OBSのプロフェッショナル感"**

- 明るい黄緑・黄色で初心者向けの優しさを表現
- 黒で信頼性とプロフェッショナルを演出
- アニメーションで楽しさとモダンさを追加

---

## カラーシステム

詳細は `color-system.md` を参照。

### ブランドカラー

| カラー名 | Hex | 用途 |
|---------|-----|------|
| Beginner Green | `#A7D444` | メインCTA、進行状態、アクセント |
| Beginner Yellow | `#EDF28F` | セカンダリボタン、ハイライト |
| OBS Black | `#1A1A1A` | ヘッダー、フッター、ダークモード背景 |

### グラデーション

```css
/* Primary Gradient */
background: linear-gradient(135deg, #A7D444 0%, #EDF28F 100%);

/* Used for: Hero titles, CTA buttons (gradient variant) */
```

---

## タイポグラフィ

### フォントファミリー

```css
font-family: var(--font-noto-sans-jp), var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

- **日本語**: Noto Sans JP (400, 500, 700, 900)
- **英数字**: Inter (variable font)
- **フォールバック**: システムフォント

### フォント設定

```css
body {
  font-feature-settings: 'palt' 1; /* プロポーショナルメトリクス */
  letter-spacing: 0.02em;
  line-height: 1.7;
}

h1, h2, h3, h4, h5, h6 {
  line-height: 1.4;
  letter-spacing: 0.01em;
  font-weight: 700;
}
```

### フォントスケール

| 要素 | Tailwind Class | サイズ | 用途 |
|------|---------------|--------|------|
| H1 (Hero) | `text-5xl` / `text-4xl` | 48px / 36px | ページタイトル（desktop/mobile） |
| H2 (Section) | `text-2xl` | 24px | セクションタイトル |
| Body Large | `text-xl` | 20px | サブタイトル、重要テキスト |
| Body | `text-base` | 16px | 本文 |
| Small | `text-sm` | 14px | 補足テキスト |
| Tiny | `text-xs` | 12px | キャプション |

---

## アイコンシステム

### ジャンルアイコン（lucide-react）

| ジャンル | 絵文字（旧） | アイコン（新） |
|---------|------------|--------------|
| 激しいゲーム | 🎮 | Crosshair |
| アクションゲーム | ⚔️ | Swords |
| ゆっくりゲーム | 🧩 | Puzzle |
| 雑談・歌配信 | 🎤 | Mic |
| レトロゲーム | 🕹️ | Gamepad2 |

### ステータスアイコン

| 状態 | 絵文字（旧） | アイコン（新） |
|------|------------|--------------|
| 成功 | ✅ | CheckCircle2 |
| エラー | ❌ | XCircle |
| 警告 | ⚠️ | AlertTriangle |
| 情報 | 💡 | Info |
| 処理中 | 🔄 | Loader2 (spinning) |
| 設定 | ⚙️ | Settings |

### アイコンスタイル

```tsx
// アイコン背景（ジャンルカード）
<div className="p-2 rounded-lg bg-primary/10">
  <GenreIcon genreId={genreId} className="text-primary" size={28} />
</div>

// ステータスアイコン（タイトル）
<StatusIcon type="success" size={24} className="text-primary" />
```

---

## コンポーネントスタイル

### ボタン

```tsx
// Variant: default
<Button>テキスト</Button>
// bg-primary + shadow-sm + hover:shadow-md

// Variant: gradient (NEW)
<Button variant="gradient">テキスト</Button>
// bg-beginner-gradient + shadow-md + hover:opacity-90
```

### カード

```tsx
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明</CardDescription>
  </CardHeader>
  <CardContent>
    {/* コンテンツ */}
  </CardContent>
</Card>

// スタイル: bg-card + border-2 + rounded-lg
// ホバー: hover:border-primary/50
```

### ラジオボタン / チェックボックス

**カスタムデザイン:**
- ネイティブinputは `sr-only` (アクセシビリティ維持)
- カスタムビジュアル: ラジオ（円形）、チェックボックス（四角形）
- 選択時: border-primary + bg-primary
- 未選択: border-muted-foreground/50

**アニメーション:**
- ラジオ: 内側の円がscale (0 → 1)
- チェックボックス: チェックマークがscale + rotate (-90° → 0°)
- トランジション: Spring (stiffness: 300, damping: 20)

---

## アニメーション

### Framer Motion設定

```tsx
// Staggered animation (genre cards, options)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Spring animation (selection)
transition={{ type: 'spring', stiffness: 300, damping: 20 }}
```

### トランジション原則

- **カード選択**: 200ms ease-in-out
- **ホバー効果**: 150ms
- **ローディング**: Spinner with infinite rotation
- **ページ遷移**: Staggered fade-in

---

## スペーシング

### パディング

| 要素 | Tailwind Class | サイズ |
|------|---------------|--------|
| Card内部 | `p-4` | 16px |
| Section間 | `space-y-8` | 32px |
| 要素間（小） | `gap-2` | 8px |
| 要素間（中） | `gap-4` | 16px |

### マージン

- ページコンテナ: `max-w-4xl mx-auto py-12`
- カード間: `space-y-4`

---

## レスポンシブ

### ブレークポイント

| サイズ | Tailwind | 用途 |
|-------|----------|------|
| Mobile | `< 768px` | デフォルト |
| Desktop | `≥ 768px` | md: prefix |

### モバイル最適化

- フォントサイズ: H1 `text-4xl` → `text-5xl` (desktop)
- パディング: `p-4` → `p-8` (desktop)
- 最大幅: `max-w-md` (mobile) → `max-w-4xl` (desktop)

---

## ダークモード

### カラー対応

| 要素 | Light Mode | Dark Mode |
|------|-----------|-----------|
| Background | `#FFFFFF` | `#0D0D0D` |
| Card | `#F8F9FA` | `#1A1A1A` (OBS Black) |
| Border | `#E5E7EB` | `#2D2D2D` |
| Text Primary | `#1F2937` | `#F9FAFB` |
| Text Secondary | `#6B7280` | `#9CA3AF` |

### コントラスト比

- ✅ Beginner Green on OBS Black: 7.8:1 (AAA)
- ✅ Text Primary on Background: 14.5:1+ (AAA)

---

## アクセシビリティ

### ARIA属性

```tsx
// カード選択
<Card
  role="button"
  tabIndex={0}
  aria-label={`${title}: ${subtitle}`}
  onKeyDown={(e) => handleKeyPress(e)}
>

// プログレスバー
<Progress
  value={progress}
  aria-label="GPU検知進捗"
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
/>
```

### キーボードナビゲーション

- Enter / Space: カード選択
- Tab: フォーカス移動
- Escape: モーダル閉じる

---

## 実装ファイル

### カラーシステム
- `app/globals.css` - CSS変数定義
- `tailwind.config.ts` - Tailwind拡張
- `docs/design/color-system.md` - 詳細ドキュメント

### アイコンシステム
- `lib/icons/genre-icons.tsx` - ジャンルアイコン
- `lib/icons/status-icons.tsx` - ステータスアイコン

### コンポーネント
- `components/ui/button.tsx` - ボタン variants
- `components/ui/card.tsx` - カード
- `components/desktop/question-item.tsx` - カスタムラジオ/チェックボックス

### フォント
- `app/layout.tsx` - フォント読み込み
- `app/globals.css` - フォント設定

---

## 今後の拡張

### Phase 6以降で検討
- [ ] OGP画像の自動生成（カラーシステム反映）
- [ ] アニメーション設定のカスタマイズ（ユーザー設定）
- [ ] ハイコントラストモード対応
- [ ] アニメーション無効化設定（アクセシビリティ）

---

## 参考資料

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
