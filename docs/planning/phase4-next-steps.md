# Phase 4.2～4.4: 実装計画

**作成日:** 2026-02-12
**対象:** Phase 4.1完了後の改善・調整作業
**総工数見積:** 7-10時間
**優先度:** 中

---

## 📋 全体概要

Phase 4.1（ガイド機能の基本実装）が完了したため、次のステップとして以下の3つのフェーズで改善・調整を行います：

1. **Phase 4.2: UIの微調整** - 見た目と使いやすさの向上
2. **Phase 4.3: 画像の置き換え** - ASCII図を実際のスクリーンショットに置き換え
3. **Phase 4.4: 最終調整** - エラーハンドリング、パフォーマンス、アクセシビリティ

---

## 🎨 Phase 4.2: UIの微調整

### 工数見積
**2-3時間**

### 優先度
**中** - 機能的には動作しているが、UX向上に必要

### 実装項目

#### 1. フォント・色・スペーシング調整 (1時間)

**目的:** 初心者向けに見やすさを最優先

**作業内容:**
- [ ] 全体的なフォントサイズの見直し
  - 現在の最小フォントサイズを確認（text-base = 16px）
  - 必要に応じて拡大（text-lg = 18px以上）

- [ ] コントラスト比の確認
  - WCAG AA準拠（4.5:1以上）を確認
  - 背景色と前景色の組み合わせチェック
  - ダークモード対応も確認

- [ ] スペーシング調整
  - カード間の余白（space-y-6 → space-y-8）
  - ボタン周りの余白
  - テキストブロックの行間

**修正対象ファイル:**
- `components/post-download/guide-required.tsx`
- `components/post-download/guide-performance.tsx`
- `components/post-download/guide-optional.tsx`
- `components/post-download/guide-item.tsx`

#### 2. 案内文言の見直し (1時間)

**目的:** より分かりやすい日本語表現に

**作業内容:**
- [ ] 専門用語の補足説明追加
  - 例: 「エンコーダ」→「エンコーダ（映像圧縮方式）」
  - 例: 「ビットレート」→「ビットレート（画質の基準値）」

- [ ] 指示の具体化
  - 「設定してください」→「以下の手順で設定してください」
  - 曖昧な表現を明確に

- [ ] トーンの統一
  - 丁寧語・敬体の統一
  - 指示形式の統一

**修正対象ファイル:**
- `lib/post-download-guide.ts` - ガイドデータの description/steps
- `components/post-download/guide-*.tsx` - UI上の説明文

#### 3. ボタン配置の最適化 (30分)

**目的:** アクセシビリティとタッチデバイス対応

**作業内容:**
- [ ] ボタンサイズの確認
  - 最小タッチターゲットサイズ: 44x44px（iOS）/ 48x48px（Android）
  - 現在のボタンサイズを確認し、必要に応じて拡大

- [ ] ボタン間のスペース確保
  - 最小8px以上の間隔

- [ ] フォーカス状態の視覚化
  - キーボードナビゲーション時の明確な枠線

**修正対象ファイル:**
- `components/post-download/guide-*.tsx` - ボタンコンポーネント

#### 4. レスポンシブ対応の確認 (30分)

**目的:** モバイルでの表示崩れ防止

**作業内容:**
- [ ] モバイル表示の確認（375px幅）
- [ ] タブレット表示の確認（768px幅）
- [ ] 横スクロール防止
- [ ] 長いテキストの折り返し

**テスト方法:**
```bash
# ブラウザのデベロッパーツールで確認
# iPhone SE (375x667)
# iPad (768x1024)
# Desktop (1920x1080)
```

### 完了条件
- [ ] 全画面でWCAG AA準拠
- [ ] 専門用語に補足説明あり
- [ ] ボタンが44x44px以上
- [ ] モバイル・タブレット・デスクトップで表示崩れなし

---

## 📸 Phase 4.3: 画像の置き換え

### 工数見積
**3-4時間**

### 優先度
**中** - ASCII図でも動作するが、画像の方が分かりやすい

### 実装項目

#### 1. OBSスクリーンショット撮影 (2時間)

**目的:** 各ガイド項目の実際の画面を撮影

**撮影リスト（10枚）:**

**必須設定（3枚）:**
1. YouTube配信キー設定
   - YouTube Studio の「ストリームキー」画面
   - OBSの「設定 > 配信」画面

2. マイク音声設定
   - OBSの「設定 > 音声」画面
   - マイクデバイス選択部分を強調

3. ゲームキャプチャ設定
   - OBSの「ソース追加」画面
   - ゲームキャプチャのプロパティ画面

**パフォーマンス設定（5枚）:**
4. プレビュー無効化
   - プレビュー画面の右クリックメニュー

5. プロセス優先度
   - OBSの「設定 > 詳細設定」画面

6. 自動録画無効化
   - OBSの「設定 > 出力 > 録画」タブ

7. 出力モード
   - OBSの「設定 > 出力」画面

8. Windowsゲームモード
   - Windows設定の「ゲーム > ゲームモード」画面

**オプション設定（2枚）:**
9. ブラウザHWアクセラ
   - OBSの「設定 > 詳細設定」画面

10. 音声モニタリング
    - OBSの「音声ミキサー > 歯車 > 詳細プロパティ」画面

**撮影手順:**
```bash
# 1. OBSを開く
# 2. 該当の画面に移動
# 3. Windows + Shift + S でスクリーンショット
# 4. 重要な箇所を赤枠で強調（ペイント等）
# 5. 1280x720にリサイズ
# 6. PNG形式で保存
```

**保存先:**
```
public/guide-images/
├── youtube-stream-key.png
├── microphone-setup.png
├── game-capture.png
├── disable-preview.png
├── process-priority.png
├── disable-recording.png
├── output-mode.png
├── windows-game-mode.png
├── browser-hw-accel.png
└── audio-monitoring.png
```

#### 2. 画像パスの追加 (30分)

**目的:** GuideItemデータに画像パスを追加

**修正箇所:**
`lib/post-download-guide.ts` の各 GuideItem に imageUrl を追加

```typescript
{
  id: 'youtube-stream-key',
  title: 'YouTube配信キーの設定',
  // ... 既存フィールド
  imageUrl: '/guide-images/youtube-stream-key.png', // 追加
  imagePlaceholder: `...`, // 削除せず残す（fallback用）
}
```

**修正対象:**
- 全10項目に imageUrl を追加

#### 3. 画像最適化 (1時間)

**目的:** ページ読み込み速度の最適化

**作業内容:**
- [ ] WebP形式への変換
  ```bash
  # ImageMagickまたはSharpで一括変換
  for file in *.png; do
    cwebp -q 80 "$file" -o "${file%.png}.webp"
  done
  ```

- [ ] Picture要素でfallback対応
  ```tsx
  <picture>
    <source srcSet={item.imageUrl.replace('.png', '.webp')} type="image/webp" />
    <img src={item.imageUrl} alt={item.title} />
  </picture>
  ```

- [ ] 遅延ロード実装
  ```tsx
  <img
    src={item.imageUrl}
    alt={item.title}
    loading="lazy"
    decoding="async"
  />
  ```

**修正対象ファイル:**
- `components/post-download/guide-item.tsx` - 画像表示部分

#### 4. 画像プリロード（オプション） (30分)

**目的:** 初回アクセス時の画像読み込みを高速化

**実装内容:**
```tsx
// components/post-download/guide-required.tsx
useEffect(() => {
  const guides = getRequiredGuides();
  guides.forEach((guide) => {
    if (guide.imageUrl) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = guide.imageUrl;
      document.head.appendChild(link);
    }
  });
}, []);
```

### 完了条件
- [ ] 全10項目のスクリーンショット撮影完了
- [ ] 画像ファイルを `/public/guide-images/` に配置
- [ ] GuideItemデータに imageUrl 追加
- [ ] WebP形式への変換完了（PNG fallback付き）
- [ ] 遅延ロード実装
- [ ] 画像表示動作確認（全ガイド項目）

---

## 🔧 Phase 4.4: 最終調整

### 工数見積
**2-3時間**

### 優先度
**中** - 品質向上とエラー対策

### 実装項目

#### 1. エラーハンドリング強化 (1時間)

**目的:** ユーザー体験の向上とエラー対策

**作業内容:**

**a. ネットワークエラー時の再試行**
```typescript
// lib/api-client.ts（新規作成）
async function fetchWithRetry(url: string, options: RequestInit, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

**b. タイムアウト処理**
```typescript
// GPU検出、速度測定にタイムアウト追加
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒

try {
  const response = await fetch('/api/gpu/map', {
    signal: controller.signal,
    // ...
  });
} finally {
  clearTimeout(timeoutId);
}
```

**c. エラーメッセージの改善**
- 汎用エラー「エラーが発生しました」→ 具体的なメッセージ
- 復旧方法の提示（「ページをリロードしてください」など）

**修正対象ファイル:**
- `components/desktop/gpu-detector.tsx`
- `components/desktop/speed-tester.tsx`
- `components/desktop/desktop-view.tsx` (generateステップ)

#### 2. ローディング状態の改善 (1時間)

**目的:** 待ち時間の体感速度を向上

**作業内容:**

**a. スケルトンUI追加**
```tsx
// components/ui/skeleton.tsx（shadcn/ui）
import { Skeleton } from '@/components/ui/skeleton';

// ローディング中
<Card>
  <CardHeader>
    <Skeleton className="h-8 w-[200px]" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-4 w-full mb-2" />
    <Skeleton className="h-4 w-3/4" />
  </CardContent>
</Card>
```

**b. プログレスバーのアニメーション**
- 現在: 静的なプログレスバー
- 改善: スムーズなアニメーション（transition: width 300ms）

**c. ローディングメッセージの工夫**
```tsx
const loadingMessages = [
  '💡 GPU情報を取得しています...',
  '🔍 最適なエンコーダを選択中...',
  '⚙️ 設定を計算しています...',
];
```

**修正対象ファイル:**
- `components/desktop/gpu-detector.tsx`
- `components/desktop/speed-tester.tsx`
- `components/desktop/desktop-view.tsx` (generateステップ)

#### 3. アクセシビリティ確認 (1時間)

**目的:** 支援技術対応とキーボード操作

**作業内容:**

**a. キーボードナビゲーション**
- [ ] Tabキーで全要素を移動可能
- [ ] Enterキーでボタン操作可能
- [ ] Escapeキーでモーダル閉じる

**b. ARIA属性の追加**
```tsx
// チェックボックス
<input
  type="checkbox"
  role="checkbox"
  aria-checked={completed}
  aria-labelledby={`guide-${item.id}-title`}
/>

// プログレスバー
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="GPU検出進行状況"
>
```

**c. フォーカス管理**
```tsx
// モーダルを開いたとき、最初の要素にフォーカス
useEffect(() => {
  if (showModal) {
    modalRef.current?.focus();
  }
}, [showModal]);
```

**d. スクリーンリーダー対応**
- alt属性の適切な設定
- aria-label による説明追加
- visually-hidden クラスでスクリーンリーダー専用テキスト

**テスト方法:**
```bash
# Lighthouse Accessibility Score 確認
# Chrome DevTools > Lighthouse > Accessibility
# 目標: 90点以上
```

**修正対象ファイル:**
- 全UIコンポーネント

### 完了条件
- [ ] ネットワークエラー時に3回まで自動再試行
- [ ] 30秒タイムアウト実装
- [ ] エラーメッセージが具体的で復旧方法を提示
- [ ] スケルトンUI実装
- [ ] プログレスバーがスムーズにアニメーション
- [ ] Tabキーで全要素移動可能
- [ ] ARIA属性が適切に設定
- [ ] Lighthouse Accessibility Score 90点以上

---

## 📊 全体スケジュール

```
Phase 4.2 (UI微調整): 2-3時間
├─ フォント・色調整: 1時間
├─ 案内文言見直し: 1時間
└─ ボタン配置最適化: 0.5時間

Phase 4.3 (画像置き換え): 3-4時間
├─ スクリーンショット撮影: 2時間
├─ 画像パス追加: 0.5時間
└─ 画像最適化: 1時間

Phase 4.4 (最終調整): 2-3時間
├─ エラーハンドリング: 1時間
├─ ローディング改善: 1時間
└─ アクセシビリティ: 1時間

合計: 7-10時間
```

---

## ✅ チェックリスト

### Phase 4.2開始前
- [ ] Phase 4.1の動作確認完了
- [ ] 現在のフォントサイズ・色の記録
- [ ] WCAG基準の確認

### Phase 4.3開始前
- [ ] OBSインストール済み
- [ ] スクリーンショットツール準備
- [ ] 画像編集ツール準備（ペイント等）

### Phase 4.4開始前
- [ ] エラーシナリオのリストアップ
- [ ] テストケースの作成
- [ ] Lighthouse準備

### 全Phase完了後
- [ ] 全機能の動作確認
- [ ] パフォーマンステスト
- [ ] ブラウザ互換性確認（Chrome, Edge, Firefox）
- [ ] ドキュメント更新

---

## 🎯 優先順位判定

ユーザーの状況に応じて、以下の優先順位で実装を検討：

### パターンA: 早期リリース優先
```
Phase 4.4（最終調整）を先に実装
→ エラーハンドリングとアクセシビリティを確保
→ Phase 4.2, 4.3は後回し
```

### パターンB: UX重視
```
Phase 4.2（UI微調整）を先に実装
→ 見た目を改善
→ Phase 4.3（画像）はASCII図のまま運用
→ Phase 4.4は必要に応じて
```

### パターンC: 完璧主義
```
Phase 4.2 → 4.3 → 4.4 の順に全て実装
→ 最高品質を目指す
```

---

## 📝 実装判断基準

**各Phaseを実装するか判断する際の基準:**

### Phase 4.2（UI微調整）
- ✅ 実装推奨: 初心者向けアプリのため、見やすさは重要
- ⚠️ スキップ可: 現状でも十分機能している場合

### Phase 4.3（画像置き換え）
- ⚠️ 後回し可: ASCII図でも理解できる
- ✅ 実装推奨: 初心者により分かりやすく伝えたい場合

### Phase 4.4（最終調整）
- ✅ 実装推奨: エラーハンドリングとアクセシビリティは品質に直結
- ⚠️ 一部スキップ可: 時間制約がある場合、エラーハンドリングのみ実装

---

**作成者:** Claude Sonnet 4.5
**作成日:** 2026-02-12
