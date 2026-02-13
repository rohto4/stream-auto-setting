# ドキュメント - オートOBS設定 v1.0.0

すべてのプロジェクト関連ドキュメントがこのディレクトリに格納されています。

---

## 📂 ディレクトリ構成

### 🎯 [planning/](./planning/) - 実装計画・開発ロードマップ
プロジェクトの計画と進捗を管理するドキュメント

| ファイル | 説明 |
|---------|------|
| **[implementation-plan.md](./planning/implementation-plan.md)** ⭐ | 実装計画書（Phase 0-5.9 の詳細） |
| [phase4-next-steps.md](./planning/phase4-next-steps.md) | Phase 4 の次ステップ |
| [ddd-principles.md](./planning/ddd-principles.md) | Document-Driven Development の原則 |

**→ 実装計画の全体像を知りたい場合はここから開始**

---

### 📋 [reports/](./reports/) - レポート・実装記録
実装状況、テスト結果、リリース準備に関するドキュメント

| ファイル | 説明 |
|---------|------|
| **[FINAL_IMPLEMENTATION_REPORT.md](./reports/FINAL_IMPLEMENTATION_REPORT.md)** ⭐ | 最終実装レポート（最新・最詳細） |
| **[release-checklist.md](./reports/release-checklist.md)** ⭐ | リリースチェックリスト（デプロイ前必読） |
| [IMPLEMENTATION_PROGRESS.md](./reports/IMPLEMENTATION_PROGRESS.md) | Phase 別進捗記録 |
| [TEST_RESULTS.md](./reports/TEST_RESULTS.md) | テスト結果 |

**→ 実装内容を詳しく知りたい場合はここを参照**

---

### 📚 [specifications/](./specifications/) - 仕様書・ガイド・設計書
機能仕様、デプロイメントガイド、技術設計ドキュメント

**デプロイ関連:**
| ファイル | 説明 |
|---------|------|
| **[deployment-guide.md](./specifications/deployment-guide.md)** ⭐ | Vercel デプロイ手順（本番デプロイ時に必読） |

**機能仕様:**
| ファイル | 説明 |
|---------|------|
| [advanced-settings-spec.md](./specifications/advanced-settings-spec.md) | 詳細設定フェーズの仕様 |
| [post-download-guide.md](./specifications/post-download-guide.md) | ダウンロード後ガイド機能 |

**技術設計:**
| ファイル | 説明 |
|---------|------|
| [01-architecture.md](./specifications/01-architecture.md) | システムアーキテクチャ |
| [02-data-schema.md](./specifications/02-data-schema.md) | データベーススキーマ |
| [03-logic-flow.md](./specifications/03-logic-flow.md) | ロジックフロー |
| [04-ui-spec.md](./specifications/04-ui-spec.md) | UI 仕様 |
| [obs-config-matrix.md](./specifications/obs-config-matrix.md) | OBS 設定マトリクス |
| [gpu-update-2026.md](./specifications/gpu-update-2026.md) | GPU マッピング更新履歴 |

**→ 仕様や技術詳細を知りたい場合はここを参照**

---

## 🚀 クイックリンク

### デプロイ前にやること
1. [deployment-guide.md](./specifications/deployment-guide.md) を読む
2. [release-checklist.md](./reports/release-checklist.md) でテスト項目を確認

### 実装内容を知りたい
→ [FINAL_IMPLEMENTATION_REPORT.md](./reports/FINAL_IMPLEMENTATION_REPORT.md)

### 計画を確認したい
→ [implementation-plan.md](./planning/implementation-plan.md)

### 技術仕様を知りたい
→ [specifications/](./specifications/) を参照

---

## 📊 プロジェクト状態

| 項目 | 状態 |
|------|------|
| 実装 | ✅ 100% 完了 |
| テスト | ✅ 完了 |
| ドキュメント | ✅ 整備完了 |
| デプロイ準備 | ✅ 完了 |
| **リリース予定** | **2026年2月28日** |

---

## 📖 使用方法

### 初めての場合
1. [planning/README.md](./planning/README.md) で全体像を把握
2. [reports/FINAL_IMPLEMENTATION_REPORT.md](./reports/FINAL_IMPLEMENTATION_REPORT.md) で実装内容を確認
3. [specifications/deployment-guide.md](./specifications/deployment-guide.md) でデプロイ方法を学ぶ

### 情報を探している場合
- **実装計画** → [planning/](./planning/)
- **実装レポート** → [reports/](./reports/)
- **仕様・ガイド** → [specifications/](./specifications/)

---

## 関連リンク

- [プロジェクト README](../README.md)
- [GitHub リポジトリ](https://github.com/...)

---

**Last Updated:** 2026-02-12
**Version:** 1.0.0 Alpha
