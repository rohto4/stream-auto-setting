# カラーシステム設計書
**Version:** 2.0.0
**Created:** 2026-02-14
**Concept:** ビギナーカラー + OBSカラー

---

## コンセプト

### デザイン哲学
> 「生成AIのポン出しサイトと差別化する、個性的で親しみやすいデザイン」

- **ビギナー向けの明るさ**: 黄緑・黄色で親しみやすさと希望を表現
- **OBSのプロ感**: 黒で信頼性とプロフェッショナル感を演出
- **差別化**: 一般的な青紫系を避け、独自のカラーアイデンティティを確立

---

## カラーパレット

### Primary Colors

| 色名 | Hex | HSL | 用途 |
|------|-----|-----|------|
| **Beginner Green** | `#A7D444` | `75, 65%, 55%` | メインボタン、アクセント、進行状態 |
| **Beginner Yellow** | `#EDF28F` | `64, 76%, 75%` | セカンダリボタン、ハイライト、背景アクセント |
| **OBS Black** | `#1A1A1A` | `0, 0%, 10%` | ヘッダー、フッター、ダークモード背景 |

### Semantic Colors

| 色名 | Hex | HSL | 用途 |
|------|-----|-----|------|
| **Success** | `#A7D444` | `75, 65%, 55%` | 成功メッセージ、完了状態 |
| **Warning** | `#F5C842` | `43, 89%, 61%` | 警告、注意喚起 |
| **Error** | `#E74C3C` | `6, 78%, 57%` | エラー、削除確認 |
| **Info** | `#3498DB` | `204, 70%, 53%` | 情報、ヒント |

### Neutral Colors (Light Mode)

| 色名 | Hex | 用途 |
|------|-----|------|
| **Background** | `#FFFFFF` | ページ背景 |
| **Surface** | `#F8F9FA` | カード背景 |
| **Border** | `#E5E7EB` | 境界線 |
| **Text Primary** | `#1F2937` | メインテキスト |
| **Text Secondary** | `#6B7280` | サブテキスト |

### Neutral Colors (Dark Mode)

| 色名 | Hex | 用途 |
|------|-----|------|
| **Background** | `#0D0D0D` | ページ背景 |
| **Surface** | `#1A1A1A` | カード背景（OBS Black） |
| **Border** | `#2D2D2D` | 境界線 |
| **Text Primary** | `#F9FAFB` | メインテキスト |
| **Text Secondary** | `#9CA3AF` | サブテキスト |

---

## グラデーション

### Primary Gradient
```css
background: linear-gradient(135deg, #A7D444 0%, #EDF28F 100%);
```
用途：ヒーローセクション、CTAボタンホバー

### Dark Accent Gradient
```css
background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);
```
用途：ダークモードのヘッダー、フッター

---

## アクセシビリティ

### コントラスト比（WCAG 2.1 AA準拠）

| 組み合わせ | コントラスト比 | 判定 |
|-----------|--------------|------|
| Beginner Green (#A7D444) on White | 3.2:1 | ⚠️ 大きいテキストのみ |
| Beginner Green (#A7D444) on OBS Black (#1A1A1A) | 7.8:1 | ✅ AAA合格 |
| Text Primary (#1F2937) on White | 14.5:1 | ✅ AAA合格 |
| Text Primary (Dark #F9FAFB) on OBS Black | 16.2:1 | ✅ AAA合格 |

**推奨事項:**
- Beginner Greenを白背景に使う場合は、太字または大きいフォントサイズ（18px以上）を使用
- 小さいテキストには必ずOBS Blackまたは濃い色を背景に

---

## 実装

### Tailwind CSS変数（globals.css）

```css
:root {
  /* Brand Colors */
  --beginner-green: 75 65% 55%;      /* #A7D444 */
  --beginner-yellow: 64 76% 75%;     /* #EDF28F */
  --obs-black: 0 0% 10%;             /* #1A1A1A */

  /* Semantic */
  --primary: var(--beginner-green);
  --secondary: var(--beginner-yellow);

  /* Light Mode */
  --background: 0 0% 100%;           /* White */
  --foreground: 220 13% 13%;         /* #1F2937 */
  --card: 210 20% 98%;               /* #F8F9FA */
  --border: 214 32% 91%;             /* #E5E7EB */
}

.dark {
  /* Dark Mode */
  --background: 0 0% 5%;             /* #0D0D0D */
  --foreground: 210 20% 98%;         /* #F9FAFB */
  --card: var(--obs-black);          /* #1A1A1A */
  --border: 0 0% 18%;                /* #2D2D2D */
}
```

### 使用例

```tsx
// ボタン
<button className="bg-[#A7D444] hover:bg-[#95C13A] text-[#1A1A1A]">
  設定を生成
</button>

// カード（ダークモード対応）
<div className="bg-card border border-border">
  <h2 className="text-foreground">タイトル</h2>
</div>
```

---

## デザイントークン対応表

| UIコンポーネント | 使用カラー |
|----------------|-----------|
| プライマリボタン | Beginner Green (#A7D444) |
| セカンダリボタン | Beginner Yellow (#EDF28F) |
| ヘッダー背景 | OBS Black (#1A1A1A) |
| カード背景（Light） | Surface (#F8F9FA) |
| カード背景（Dark） | OBS Black (#1A1A1A) |
| 進行バー | Beginner Green → Beginner Yellow gradient |
| ジャンルカード選択状態 | Beginner Green border |

---

## 参考資料

- OBS Studio公式: https://obsproject.com/ （背景色: #18181B, #09090B）
- YouTube配色: 赤 #FF0000（あえて避ける）
- カラーコントラストチェッカー: https://webaim.org/resources/contrastchecker/
