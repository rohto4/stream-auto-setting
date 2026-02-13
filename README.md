# オートOBS設定

YouTube Live特化型OBS設定自動生成Webアプリ

## 🎯 プロジェクト概要

配信初心者が「迷わず、迷えず、気づいたら設定が終わっている」状態を作る、YouTube Live特化型OBS設定自動生成ツール。

### 主な機能

- 🖥️ **GPU自動検知**: WebGLを使ってブラウザから直接GPU名を取得
- 📡 **回線速度測定**: Cloudflare APIで正確な速度測定
- 🎮 **ジャンル別最適化**: FPS/RPG/雑談など配信内容に応じた設定
- 📱 **スマホ連携**: スマホで準備、PCで完結するシームレス体験
- 📦 **ワンクリック設定**: OBSにインポートするだけで完了

## 🚀 セットアップ

### 必要環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# データベース初期化
npm run db:init

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

## 📁 プロジェクト構成

```
stream-auto-setting/
├── app/                      # Next.js App Router
│   ├── (mobile)/            # モバイル版ページ
│   ├── (desktop)/           # PC版ページ
│   └── api/                 # APIルート
├── components/              # Reactコンポーネント
│   ├── mobile/              # モバイル専用コンポーネント
│   ├── desktop/             # PC専用コンポーネント
│   └── ui/                  # shadcn/ui コンポーネント
├── lib/                     # ユーティリティ・ロジック
│   ├── db/                  # データベース関連
│   ├── gpu-detector.ts      # GPU検知ロジック
│   ├── speed-tester.ts      # 回線測定ロジック
│   └── obs-config-calculator.ts # 設定計算ロジック
├── data/                    # SQLiteデータベース
├── docs/                    # 設計ドキュメント
│   ├── lv1/                 # 詳細設計書
│   └── default/             # 開発規則
└── scripts/                 # ビルドスクリプト
```

## 🛠️ 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **UI**: Tailwind CSS 4, shadcn/ui
- **Database**: SQLite (better-sqlite3)
- **Animation**: Framer Motion
- **Deployment**: Vercel

## 📖 ドキュメント

詳細な設計書は `docs/lv1/` 配下を参照：

- `architecture.md` - システムアーキテクチャ
- `data-schema.md` - データベース設計
- `ui-spec.md` - UI/UX仕様
- `logic-flow.md` - ロジック詳細
- `obs-config-matrix.md` - OBS設定パラメータ
- `implementation-plan.md` - 開発ロードマップ

## 🎯 開発ロードマップ

- [x] Phase 0: 環境構築（2/11-2/12）
- [x] Phase 1: コア機能実装（2/13-2/19）
- [x] Phase 2: UI実装（2/20-2/24）
- [x] Phase 3: テスト・調整（2/25-2/27）
- [x] Phase 4: Post-Download Guide + UI微調整（2/12完了）
- [x] Phase 5: デプロイ準備完了（2/12完了）
- [ ] Phase 6: α版デプロイ・モニタリング（予定）

## 📝 ライセンス

MIT License

## 🤝 コントリビューション

バグ報告や機能リクエストはIssuesへお願いします。
