# OBS設定値計算マトリクス
**Project:** オートOBS設定
**Version:** 1.0.0
**Last Updated:** 2026-02-11
**Reference:** YouTube Live Encoder Settings (https://support.google.com/youtube/answer/2853702)

---

## 1. ジャンル別基本設定

### 1.1 ジャンル定義マトリクス

| ジャンルID | 表示名 | 例示ゲーム | FPS優先度 | 画質優先度 | 推奨FPS | ビットレート係数 | キーフレーム間隔 |
|-----------|--------|-----------|----------|-----------|---------|----------------|---------------|
| `fps-high` | 激しいゲーム | Apex, VALORANT, Overwatch 2, COD | 10 | 7 | 60 | 1.0 | 2秒 |
| `rpg-mid` | アクションゲーム | 原神, スト6, エルデンリング, FF14 | 7 | 9 | 60 | 0.85 | 2秒 |
| `puzzle-low` | ゆっくりゲーム | 雀魂, ぷよぷよ, Among Us | 5 | 10 | 30 | 0.7 | 2秒 |
| `chat` | 雑談・歌配信 | 雑談, 歌枠, お絵描き, ASMR | 3 | 10 | 30 | 0.6 | 4秒 |
| `retro` | レトロゲーム | マリオ, ポケモン, ドラクエ | 6 | 8 | 60 | 0.65 | 2秒 |

**パラメータ説明:**
- **FPS優先度**: 1-10（10=最高優先）。動きの激しさを表す。
- **画質優先度**: 1-10（10=最高優先）。静止画の美しさを表す。
- **ビットレート係数**: 基準ビットレート（回線速度×0.7）に掛ける倍率。
- **キーフレーム間隔**: GOPサイズ。YouTubeは2秒推奨。

---

## 2. GPU Tier別設定

### 2.1 NVIDIA GPUマトリクス

| GPU名 | Tier | エンコーダ | デフォルトプリセット | 最大ビットレート | HEVC | AV1 | 備考 |
|-------|------|-----------|-------------------|---------------|------|-----|------|
| **RTX 50シリーズ（Blackwell、2025年〜）** |||||||
| RTX 5090 | 1 | ffmpeg_nvenc | p4 | 15000 kbps | ✅ | ✅ | 最新世代、3,352 TOPS AI性能 |
| RTX 5080 | 1 | ffmpeg_nvenc | p4 | 12000 kbps | ✅ | ✅ | 16GB GDDR7、1,801 TOPS |
| RTX 5070 Ti | 1 | ffmpeg_nvenc | p4 | 10000 kbps | ✅ | ✅ | |
| RTX 5070 | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ✅ | コスパ最強（第5世代） |
| **RTX 40シリーズ（Ada Lovelace、2022年〜）** |||||||
| RTX 4090 | 1 | ffmpeg_nvenc | p4 | 12000 kbps | ✅ | ✅ | 前世代最高性能 |
| RTX 4080 Super | 1 | ffmpeg_nvenc | p4 | 10000 kbps | ✅ | ✅ | |
| RTX 4080 | 1 | ffmpeg_nvenc | p4 | 10000 kbps | ✅ | ✅ | |
| RTX 4070 Ti Super | 1 | ffmpeg_nvenc | p5 | 9500 kbps | ✅ | ✅ | |
| RTX 4070 Ti | 1 | ffmpeg_nvenc | p5 | 9500 kbps | ✅ | ✅ | |
| RTX 4070 Super | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ✅ | |
| RTX 4070 | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ✅ | 配信向け人気モデル |
| RTX 4060 Ti | 2 | ffmpeg_nvenc | p5 | 8000 kbps | ✅ | ❌ | |
| RTX 4060 | 2 | ffmpeg_nvenc | p5 | 8000 kbps | ✅ | ❌ | エントリー40シリーズ |
| **RTX 30シリーズ（Ampere、2020年〜）** |||||||
| RTX 3090 Ti | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ❌ | |
| RTX 3090 | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ❌ | 前々世代ハイエンド |
| RTX 3080 Ti | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ❌ | |
| RTX 3080 | 1 | ffmpeg_nvenc | p5 | 9000 kbps | ✅ | ❌ | |
| RTX 3070 Ti | 2 | ffmpeg_nvenc | p6 | 8000 kbps | ✅ | ❌ | |
| RTX 3070 | 2 | ffmpeg_nvenc | p6 | 8000 kbps | ✅ | ❌ | |
| RTX 3060 Ti | 2 | ffmpeg_nvenc | p6 | 7500 kbps | ✅ | ❌ | |
| RTX 3060 | 2 | ffmpeg_nvenc | p6 | 7000 kbps | ✅ | ❌ | 配信入門者向け |
| **GTX 16シリーズ（Turing、2019年〜）** |||||||
| GTX 1660 Ti | 3 | ffmpeg_nvenc | p6 | 6000 kbps | ❌ | ❌ | エントリー |
| GTX 1660 Super | 3 | ffmpeg_nvenc | p6 | 6000 kbps | ❌ | ❌ | |
| GTX 1660 | 3 | ffmpeg_nvenc | p6 | 6000 kbps | ❌ | ❌ | |
| GTX 1650 Super | 3 | ffmpeg_nvenc | p7 | 5500 kbps | ❌ | ❌ | |
| GTX 1650 | 3 | ffmpeg_nvenc | p7 | 5000 kbps | ❌ | ❌ | 最低限 |

**NVENCプリセット説明:**
- `p1` = 最高画質（激重、非推奨）
- `p4` = 高画質（RTX 40シリーズ推奨）
- `p5` = バランス（RTX 30シリーズ推奨）
- `p6` = 高速（GTX/エントリーRTX推奨）
- `p7` = 最速（低スペックGPU用）

---

### 2.2 AMD GPUマトリクス

| GPU名 | Tier | エンコーダ | デフォルトプリセット | 最大ビットレート | HEVC | AV1 | 備考 |
|-------|------|-----------|-------------------|---------------|------|-----|------|
| **RX 8000シリーズ（RDNA 4、2025年〜）** |||||||
| RX 8800 XT | 1 | ffmpeg_amf | speed | 10000 kbps | ✅ | ✅ | 最新世代、RTとAI性能大幅向上 |
| RX 8700 XT | 2 | ffmpeg_amf | speed | 9000 kbps | ✅ | ✅ | Navi 48、56 CU |
| RX 8600 XT | 2 | ffmpeg_amf | balanced | 8000 kbps | ✅ | ❌ | |
| **RX 7000シリーズ（RDNA 3、2022年〜）** |||||||
| RX 7900 XTX | 1 | ffmpeg_amf | speed | 10000 kbps | ✅ | ❌ | 前世代フラッグシップ |
| RX 7900 XT | 1 | ffmpeg_amf | speed | 9500 kbps | ✅ | ❌ | |
| RX 7900 GRE | 2 | ffmpeg_amf | speed | 9000 kbps | ✅ | ❌ | 中国・グローバル展開 |
| RX 7800 XT | 2 | ffmpeg_amf | speed | 9000 kbps | ✅ | ❌ | コスパ良好 |
| RX 7700 XT | 2 | ffmpeg_amf | balanced | 8000 kbps | ✅ | ❌ | |
| RX 7600 XT | 2 | ffmpeg_amf | balanced | 7000 kbps | ✅ | ❌ | |
| RX 7600 | 2 | ffmpeg_amf | balanced | 7000 kbps | ✅ | ❌ | エントリーRDNA3 |
| **RX 6000シリーズ（RDNA 2、2020年〜）** |||||||
| RX 6950 XT | 1 | ffmpeg_amf | balanced | 8500 kbps | ❌ | ❌ | |
| RX 6900 XT | 2 | ffmpeg_amf | balanced | 8000 kbps | ❌ | ❌ | 前々世代 |
| RX 6800 XT | 2 | ffmpeg_amf | balanced | 8000 kbps | ❌ | ❌ | |
| RX 6800 | 2 | ffmpeg_amf | balanced | 7500 kbps | ❌ | ❌ | |
| RX 6750 XT | 2 | ffmpeg_amf | balanced | 7000 kbps | ❌ | ❌ | |
| RX 6700 XT | 2 | ffmpeg_amf | balanced | 7000 kbps | ❌ | ❌ | |
| RX 6650 XT | 3 | ffmpeg_amf | balanced | 6500 kbps | ❌ | ❌ | |
| RX 6600 XT | 3 | ffmpeg_amf | quality | 6000 kbps | ❌ | ❌ | エントリー |
| RX 6600 | 3 | ffmpeg_amf | quality | 6000 kbps | ❌ | ❌ | |

**AMFプリセット説明:**
- `quality` = 高画質（低速）
- `balanced` = バランス（推奨）
- `speed` = 高速（ハイエンド向け）

---

### 2.3 Intel GPUマトリクス

| GPU名 | Tier | エンコーダ | デフォルトプリセット | 最大ビットレート | HEVC | AV1 | 備考 |
|-------|------|-----------|-------------------|---------------|------|-----|------|
| **Arc Bシリーズ（Battlemage、2024年〜）** |||||||
| Arc B580 | 2 | ffmpeg_qsv | balanced | 7500 kbps | ✅ | ✅ | 最新世代、XeSS 3対応、$249 |
| Arc B570 | 2 | ffmpeg_qsv | balanced | 7000 kbps | ✅ | ✅ | |
| **Arc Aシリーズ（Alchemist、2022年〜）** |||||||
| Arc A770 | 2 | ffmpeg_qsv | speed | 8000 kbps | ✅ | ✅ | 前世代フラッグシップ |
| Arc A750 | 2 | ffmpeg_qsv | balanced | 7000 kbps | ✅ | ✅ | |
| Arc A580 | 2 | ffmpeg_qsv | balanced | 6500 kbps | ✅ | ❌ | |
| Arc A380 | 3 | ffmpeg_qsv | balanced | 6000 kbps | ✅ | ❌ | エントリー |
| **内蔵GPU（Xe、2020年〜）** |||||||
| Iris Xe (12th Gen) | 3 | ffmpeg_qsv | balanced | 6000 kbps | ✅ | ❌ | Alder Lake |
| UHD Graphics 770 | 3 | ffmpeg_qsv | quality | 5000 kbps | ✅ | ❌ | 12th/13th Gen |

**QSVプリセット説明:**
- `quality` = 高画質
- `balanced` = バランス（推奨）
- `speed` = 高速

---

### 2.4 Apple Silicon マトリクス

| SoC名 | Tier | エンコーダ | デフォルトプリセット | 最大ビットレート | HEVC | AV1 | 備考 |
|-------|------|-----------|-------------------|---------------|------|-----|------|
| **M4シリーズ（2024年〜）** |||||||
| M4 Max | 1 | videotoolbox | quality | 11000 kbps | ✅ | ❌ | 最新世代、40コアGPU、546GB/s帯域 |
| M4 Pro | 1 | videotoolbox | quality | 10000 kbps | ✅ | ❌ | 20コアGPU |
| M4 | 2 | videotoolbox | balanced | 9000 kbps | ✅ | ❌ | 10コアGPU |
| **M3シリーズ（2023年〜）** |||||||
| M3 Max | 1 | videotoolbox | quality | 10000 kbps | ✅ | ❌ | 40コアGPU |
| M3 Pro | 1 | videotoolbox | quality | 9000 kbps | ✅ | ❌ | 18コアGPU |
| M3 | 2 | videotoolbox | balanced | 8500 kbps | ✅ | ❌ | 10コアGPU |
| **M2シリーズ（2022年〜）** |||||||
| M2 Ultra | 1 | videotoolbox | quality | 10000 kbps | ✅ | ❌ | 76コアGPU、Mac Studio専用 |
| M2 Max | 1 | videotoolbox | quality | 9000 kbps | ✅ | ❌ | 38コアGPU |
| M2 Pro | 2 | videotoolbox | balanced | 8500 kbps | ✅ | ❌ | 19コアGPU |
| M2 | 2 | videotoolbox | balanced | 8000 kbps | ✅ | ❌ | 10コアGPU |
| **M1シリーズ（2020年〜）** |||||||
| M1 Ultra | 1 | videotoolbox | quality | 9000 kbps | ✅ | ❌ | 64コアGPU、Mac Studio専用 |
| M1 Max | 2 | videotoolbox | balanced | 8000 kbps | ✅ | ❌ | 32コアGPU |
| M1 Pro | 2 | videotoolbox | balanced | 7500 kbps | ✅ | ❌ | 16コアGPU |
| M1 | 2 | videotoolbox | balanced | 7000 kbps | ✅ | ❌ | 8コアGPU |

**VideoToolboxプリセット:**
- `quality` = 高画質
- `balanced` = バランス
- `speed` = 高速

---

## 3. 解像度・FPS別ビットレート推奨値

### 3.1 YouTube公式推奨ビットレート

| 解像度 | FPS | 最小ビットレート | 推奨ビットレート | 最大ビットレート |
|-------|-----|---------------|---------------|---------------|
| 1080p | 60 | 4500 kbps | 6000-9000 kbps | 9000 kbps |
| 1080p | 30 | 3000 kbps | 4000-6000 kbps | 6000 kbps |
| 720p | 60 | 2250 kbps | 3000-6000 kbps | 6000 kbps |
| 720p | 30 | 1500 kbps | 2000-4000 kbps | 4000 kbps |

**本アプリの基準:**
- 常に推奨範囲内に収める
- 回線速度が不足する場合は解像度を720pに下げる
- ビットレートを最小値未満にはしない（画質劣化防止）

---

## 4. ジャンル × GPU × 回線速度 計算例

### 4.1 ケース1: FPSゲーム × RTX 4070 × 15Mbps

**入力:**
- ジャンル: `fps-high`（係数1.0、FPS60推奨）
- GPU: RTX 4070（Tier 1, 上限9000kbps, プリセットp5）
- 回線速度: 15.2 Mbps上り

**計算過程:**
```
基準ビットレート = 15.2 * 1000 * 0.7 = 10,640 kbps
ジャンル係数適用 = 10,640 * 1.0 = 10,640 kbps
GPU上限チェック = min(10,640, 9000) = 9,000 kbps
YouTube範囲チェック = min(9,000, 9000) = 9,000 kbps（1080p60の上限）
丸め処理 = 9,000 kbps
```

**最終設定:**
```ini
[Output]
StreamEncoder=ffmpeg_nvenc
StreamEncoderPreset=p5
VBitrate=9000
KeyframeInterval=2
FPS=60
Resolution=1920x1080
bf=2
lookahead=0
psycho_aq=0
```

---

### 4.2 ケース2: 雑談配信 × RX 6700 XT × 8Mbps

**入力:**
- ジャンル: `chat`（係数0.6、FPS30推奨、画質優先）
- GPU: RX 6700 XT（Tier 2, 上限7000kbps, プリセットbalanced）
- 回線速度: 8.0 Mbps上り

**計算過程:**
```
基準ビットレート = 8.0 * 1000 * 0.7 = 5,600 kbps
ジャンル係数適用 = 5,600 * 0.6 = 3,360 kbps
YouTube範囲チェック（720p30） = max(3,360, 1500) = 3,360 kbps
丸め処理 = 3,400 kbps
```

**最終設定:**
```ini
[Output]
StreamEncoder=ffmpeg_amf
StreamEncoderPreset=quality  # 画質優先のためqualityに変更
VBitrate=3400
KeyframeInterval=4  # 雑談は4秒
FPS=30
Resolution=1280x720  # 画質優先のため720p
bf=2
```

**理由:**
- 雑談は動きが少ないため、720pでビットレートを画質に回す方が良い
- プリセットも`balanced`→`quality`に変更

---

### 4.3 ケース3: アクションゲーム × Arc A750 × 12Mbps

**入力:**
- ジャンル: `rpg-mid`（係数0.85、FPS60推奨）
- GPU: Arc A750（Tier 2, 上限7000kbps, プリセットbalanced）
- 回線速度: 12.0 Mbps上り

**計算過程:**
```
基準ビットレート = 12.0 * 1000 * 0.7 = 8,400 kbps
ジャンル係数適用 = 8,400 * 0.85 = 7,140 kbps
GPU上限チェック = min(7,140, 7000) = 7,000 kbps
YouTube範囲チェック = min(7,000, 9000) = 7,000 kbps
丸め処理 = 7,000 kbps
```

**最終設定:**
```ini
[Output]
StreamEncoder=ffmpeg_qsv
StreamEncoderPreset=balanced
VBitrate=7000
KeyframeInterval=2
FPS=60
Resolution=1920x1080
bf=2
look_ahead=1  # Intel QSV Lookahead有効
```

---

### 4.4 ケース4: 回線速度不足 × GTX 1660 × 5Mbps

**入力:**
- ジャンル: `fps-high`（係数1.0）
- GPU: GTX 1660（Tier 3, 上限6000kbps, プリセットp6）
- 回線速度: 5.0 Mbps上り（⚠️警告レベル）

**計算過程:**
```
基準ビットレート = 5.0 * 1000 * 0.7 = 3,500 kbps
ジャンル係数適用 = 3,500 * 1.0 = 3,500 kbps
YouTube範囲チェック（720p60） = max(3,500, 2250) = 3,500 kbps
丸め処理 = 3,500 kbps
```

**最終設定:**
```ini
[Output]
StreamEncoder=ffmpeg_nvenc
StreamEncoderPreset=p7  # 最速プリセット（GPU負荷軽減）
VBitrate=3500
KeyframeInterval=2
FPS=60
Resolution=1280x720  # 強制的に720p
bf=0  # B-frames無効（負荷軽減）
```

**警告メッセージ:**
```
⚠️ 回線速度がやや不足しています
- 画質を下げて設定しました（720p60）
- 配信中は他のデバイスでインターネットを使わないでください
- 可能であれば有線接続に切り替えてください
```

---

## 5. 詳細パラメータマトリクス

### 5.1 B-frames設定

| 条件 | B-frames値 | 理由 |
|-----|-----------|------|
| NVIDIA + 画質優先度 ≥ 8 | 2 | 高画質化 |
| NVIDIA + FPS優先度 ≥ 9 | 0 | レイテンシ削減 |
| AMD + 画質優先度 ≥ 8 | 2 | |
| Intel QSV（常時） | 2 | QSVはB-frames推奨 |
| x264（ソフトウェア） | 0 | CPU負荷軽減 |

### 5.2 Lookahead設定

| GPU | Tier | Lookahead | 条件 |
|-----|------|-----------|------|
| NVIDIA RTX 40 | 1 | ✅ | FPS60のみ |
| NVIDIA RTX 30 | 1 | ❌ | 負荷大 |
| AMD（全て） | - | ❌ | AMFは非推奨 |
| Intel Arc | 1-2 | ✅ | Tier 2以上 |
| Intel UHD | 3 | ❌ | 内蔵GPUは無効 |

### 5.3 Psycho Visual Tuning

| 条件 | 設定値 | 効果 |
|-----|-------|------|
| NVIDIA + 画質優先度 ≥ 9 | ✅ | 主観的画質向上 |
| その他 | ❌ | ビットレート安定優先 |

---

## 6. 音声設定

### 6.1 音声ビットレート

| 用途 | サンプルレート | ビットレート | コーデック |
|-----|-------------|-------------|----------|
| ゲーム配信 | 48kHz | 160 kbps | AAC |
| 歌配信 | 48kHz | 192 kbps | AAC |
| 雑談 | 48kHz | 128 kbps | AAC |

**設定値（全ジャンル共通）:**
```ini
[Audio]
SampleRate=48000
ChannelSetup=stereo
AudioBitrate=160
```

---

## 7. プロファイル名・シーン構成

### 7.1 デフォルトプロファイル名

```
オートOBS設定_[ジャンル]_[日付]
```

例:
- `オートOBS設定_激しいゲーム_20260211`
- `オートOBS設定_雑談配信_20260211`

### 7.2 デフォルトシーン構成

**α版では最小限のシーン:**
```
シーン1: メイン
├─ ゲームキャプチャ
└─ マイク音声
```

**β版以降で拡張予定:**
```
シーン1: メイン
├─ ゲームキャプチャ
├─ Webカメラ（PinP）
└─ マイク音声

シーン2: 開始/終了画面
├─ 画像ソース
└─ BGM

シーン3: BRB（休憩中）
├─ 画像ソース
└─ BGM
```

---

## 8. エッジケース対応

### 8.1 マルチGPU環境

| 構成 | 処理 |
|-----|------|
| NVIDIA + AMD | NVIDIA優先 |
| 専用GPU + 内蔵GPU | 専用GPU優先 |
| 同ベンダー複数 | 最新世代優先 |

### 8.2 仮想環境・リモートデスクトップ

| 環境 | GPU検知結果 | 対応 |
|-----|-----------|------|
| VMware/VirtualBox | SwiftShader | x264フォールバック |
| Parallels（Mac） | Apple GPU | VideoToolbox使用 |
| リモートデスクトップ | 検知失敗 | ユーザーに手動選択促す |

---

## 9. まとめ

この設定マトリクスは以下を保証します:

1. **YouTube準拠** - 公式推奨値を厳守
2. **GPU最適化** - 各ベンダーの特性を活かす
3. **回線速度適応** - 不足時も必ず配信可能な設定を生成
4. **ジャンル最適化** - 用途に応じた最適バランス

**Next Step:** `implementation-plan.md` で開発ロードマップを策定します。
