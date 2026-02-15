# Phase 6以降 実装計画サマリ

**作成日:** 2026-02-15
**対象:** Alpha リリース後の改善・機能追加（3ヶ月計画）
**ドキュメント:** OPT-003 詳細計画

---

## 📋 計画概要

Alpha リリース後の3ヶ月間（2026年3月～6月）で実施する改善・機能追加の詳細計画。

### 関連ドキュメント

1. **phase6-roadmap.md** - 全体ロードマップ（Week 1-12）
2. **phase6-tasks.md** - Phase 6.1 の詳細タスク（すぐ着手可能）

---

## 🎯 5つの重点フェーズ

### Phase 6.1: パフォーマンス最適化（Week 1-2）

**目標:**
- Lighthouse スコア 95+
- LCP < 1.2秒
- First Load JS < 70 KB

**主要施策:**
- next/font 導入（Google Fonts CDN削除）
- next/image 全面適用（WebP/AVIF）
- 動的インポート（Advanced Settings, Post-Download Guide）
- Framer Motion → CSS Animations 置換（-10 KB）
- Lighthouse CI 導入
- Vercel Analytics 有効化

**削減見込:**
- JS バンドル: 78.2 KB → 62.2 KB（**-16 KB**）
- LCP改善: -200ms～-500ms
- パフォーマンススコア: +10～+15ポイント

**工数:** 7日間

---

### Phase 6.2: ビジュアル強化（Week 3-4）

**目標:**
- 実際のOBSスクリーンショット10枚追加
- 説得力・信頼性向上

**主要施策:**
- OBSスクリーンショット撮影（10項目）
  - 必須設定（3枚）
  - パフォーマンス設定（3枚）
  - オプション設定（4枚）
- 画像最適化パイプライン構築
  - WebP変換（品質80%）
  - blur placeholder 生成
  - responsive srcset 対応
- UI更新（guide-item.tsx）
- Fallback 対応（画像読み込み失敗時）

**成果物:**
- 10枚の高品質スクリーンショット（800x450 WebP）
- 画像最適化済み（blur placeholder付き）

**工数:** 7日間

---

### Phase 6.3: 機能追加（Week 5-6）

**目標:**
- ユーザー要望に基づく機能拡充

**主要施策:**
1. **設定プリセット保存・読み込み**（3日間）
   - ローカルストレージに保存
   - JSON エクスポート/インポート
   - プリセット一覧UI
2. **GPU検出精度向上**（2日間）
   - RTX 50シリーズ追加
   - AMD RX 8000シリーズ追加
   - ノートPC判定強化
3. **ダウンロード履歴**（1日間）
   - IndexedDB で履歴保存
   - 再ダウンロード機能
4. **FAQ・ヘルプセクション**（2日間）
   - /faq ページ作成
   - Accordion UI
   - 検索機能（Ctrl+K）

**工数:** 8日間

---

### Phase 6.4: Analytics & モニタリング（Week 7-8）

**目標:**
- データドリブンな意思決定基盤構築

**主要施策:**
1. **Sentry 統合**（2日間）
   - エラートラッキング
   - ユーザーコンテキスト追加
2. **ユーザー行動分析**（3日間）
   - GA4 カスタムイベント設計
   - ファネル分析設定
   - コンバージョン追跡
3. **A/Bテスト基盤**（2日間）
   - Vercel Edge Middleware 活用
   - バリアント振り分け
4. **ダッシュボード構築**（1日間）
   - リアルタイムユーザー数
   - 完了率（ファネル）
   - GPU検出成功率

**主要イベント:**
- `genre_selected`
- `gpu_detected`
- `speed_test_completed`
- `config_generated`
- `config_downloaded`（コンバージョン）
- `guide_item_completed`

**工数:** 8日間

---

### Phase 6.5: コンテンツ・マーケティング（Week 9-12）

**目標:**
- SEO強化、流入数増加

**主要施策:**
1. **ブログ記事作成**（4日間）
   - 5本の記事作成（MDX形式）
   - シンタックスハイライト
   - OGP画像自動生成
2. **チュートリアル動画**（5日間）
   - 使い方3分解説
   - インストールから配信開始まで（15分）
   - よくある質問TOP5（10分）
3. **SEO最適化**（3日間）
   - 構造化データ（JSON-LD）
   - sitemap.xml 生成
   - 内部リンク最適化
4. **SNS運用**（継続的）
   - Twitter/X、Reddit、Discord

**記事タイトル（案）:**
1. OBS初心者向け！配信設定を5分で自動生成する方法
2. GPU別おすすめOBS設定まとめ【2026年版】
3. ビットレートの決め方完全ガイド
4. YouTube配信で画質と安定性を両立する設定
5. 回線速度別！最適なOBS設定早見表

**工数:** 12日間

---

## 📊 KPI目標（3ヶ月後）

| 指標 | 現在（推定） | 目標（3ヶ月後） | 測定方法 |
|------|-------------|----------------|---------|
| 完了率 | - | **70%** | GA4 ファネル |
| GPU検出成功率 | 90% | **95%** | Sentry + GA4 |
| LCP | - | **< 1.2秒** | Lighthouse CI |
| Lighthouse スコア | - | **95+** | Lighthouse CI |
| First Load JS | 78.2 KB | **< 70 KB** | Vercel Analytics |
| 月間ユーザー数 | - | **1,000人** | GA4 |
| ユーザー満足度 | - | **4.5/5.0** | フィードバックフォーム |
| SNSフォロワー | - | **500人** | Twitter Analytics |

---

## 🛠️ 技術スタック追加

### 新規導入ライブラリ

| ライブラリ | 用途 | Phase |
|-----------|------|-------|
| `plaiceholder` | blur placeholder 生成 | 6.1 |
| `@sentry/nextjs` | エラートラッキング | 6.4 |
| `@vercel/analytics` | Real User Monitoring | 6.1 |
| `sharp` | 画像最適化 | 6.2 |
| `@lhci/cli` | Lighthouse CI | 6.1 |

### インフラ追加

- **Sentry:** エラー監視
- **Vercel Analytics:** パフォーマンス監視
- **Google Analytics 4:** ユーザー行動分析
- **Lighthouse CI:** 自動パフォーマンステスト

---

## 📅 リリーススケジュール

### Week 1-2: Phase 6.1 パフォーマンス最適化
- **2026-03-01 ～ 2026-03-14**
- **リリース:** v1.1.0（パフォーマンス改善版）

### Week 3-4: Phase 6.2 ビジュアル強化
- **2026-03-15 ～ 2026-03-28**
- **リリース:** v1.2.0（スクリーンショット追加版）

### Week 5-6: Phase 6.3 機能追加
- **2026-03-29 ～ 2026-04-11**
- **リリース:** v1.3.0（プリセット・FAQ追加版）

### Week 7-8: Phase 6.4 Analytics
- **2026-04-12 ～ 2026-04-25**
- **リリース:** v1.4.0（Analytics統合版）

### Week 9-12: Phase 6.5 コンテンツ
- **2026-04-26 ～ 2026-05-23**
- **リリース:** v1.5.0（ブログ・動画追加版）

---

## 🔄 継続的改善プロセス

### 週次レビュー（毎週金曜 17:00）

1. **KPI確認** - ダッシュボードレビュー
2. **ユーザーフィードバック** - Sentry/GA4データ分析
3. **優先順位見直し** - タスクの追加・削除
4. **次週計画** - スプリント計画

### 月次リリース

- **月初（1日）:** Phase計画確定
- **月中（15日）:** 中間レビュー
- **月末（最終金曜）:** リリース・振り返り

---

## 🚀 すぐに着手可能なタスク

Phase 6.1 の詳細タスクは `phase6-tasks.md` に記載。
Alpha リリース後、即座に着手可能。

### First Step（Day 1）

1. next/font 導入（80分）
2. next/image 設定（20分）
3. Vercel Analytics 導入（40分）

**合計:** 2.5時間で基本的な最適化完了

---

## 📚 参考資料

- **Roadmap:** `docs/planning/phase6-roadmap.md`
- **Tasks:** `docs/planning/phase6-tasks.md`
- **Implementation Report:** `docs/reports/imp-report.md`
- **Release Checklist:** `docs/reports/release-checklist.md`

---

**作成者:** Claude Sonnet 4.5
**最終更新:** 2026-02-15
**次回レビュー:** 2026-03-01（Alpha リリース後）
