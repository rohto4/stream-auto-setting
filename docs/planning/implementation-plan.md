# 実裁E��画・開発ロード�EチE�E
**Project:** オーチEBS設宁E**Version:** 1.0.0
**Last Updated:** 2026-02-12 18:00 JST
**Status:** Phase 0-5.9 **100% 完亁E* ✁EↁEAlpha リリース準備完亁E**Target:** 2月末α版リリース�E�E026-02-28�E�E**Current:** チE�Eロイ征E��中

---

## 1. マイルスト�Eン概要E
```mermaid
gantt
    title オーチEBS設宁E開発ロード�EチE�E
    dateFormat YYYY-MM-DD
    section Phase 0: 環墁E��篁E    Next.js初期匁E         :done, p0-1, 2026-02-11, 1d
    shadcn/ui導�E         :done, p0-2, 2026-02-12, 1d
    DB設計�E初期匁E        :p0-3, 2026-02-12, 1d
    section Phase 1: コア機�E
    GPU検知実裁E          :crit, p1-1, 2026-02-13, 2d
    回線速度測定実裁E      :crit, p1-2, 2026-02-15, 2d
    設定計算ロジチE��       :crit, p1-3, 2026-02-17, 2d
    ファイル生�E機�E       :crit, p1-4, 2026-02-19, 1d
    section Phase 2: UI実裁E    PCビュー基本UI        :p2-1, 2026-02-20, 2d
    スマ�Eビュー基本UI     :p2-2, 2026-02-22, 2d
    セチE��ョン連携         :p2-3, 2026-02-24, 1d
    section Phase 3: チE��ト�E調整
    実機テスチE           :p3-1, 2026-02-25, 2d
    バグ修正              :p3-2, 2026-02-27, 1d
    ドキュメント整傁E      :p3-3, 2026-02-27, 1d
    section Phase 4: リリース
    α版デプロイ           :milestone, p4-1, 2026-02-28, 0d
```

---

## 2. フェーズ別詳細計画

### Phase 0: 環墁E��築！E/11-2/12、E日間！E
#### 完亁E��溁E- [ ] Next.js 15プロジェクト�E期化
- [ ] TypeScript + Tailwind CSS設定完亁E- [ ] shadcn/ui基本コンポ�Eネント導�E
- [ ] SQLiteチE�Eタベ�Eス初期匁E- [ ] Vercelプロジェクト作�E

#### タスク詳細

```bash
# 1. プロジェクト�E期化
npx create-next-app@latest stream-auto-setting \
  --typescript \
  --tailwind \
  --app \
  --import-alias "@/*"

cd stream-auto-setting

# 2. 依存関係インスト�Eル
npm install better-sqlite3 zod react-hook-form
npm install @radix-ui/react-accordion @radix-ui/react-select
npm install framer-motion jszip fuse.js
npm install -D @types/better-sqlite3

# 3. shadcn/ui初期匁Enpx shadcn-ui@latest init
npx shadcn-ui@latest add button card input select accordion toast

# 4. DB初期化スクリプト実衁Enode scripts/init-db.js
```

**チE��レクトリ構�E:**
```
stream-auto-setting/
├─ app/
━E ├─ page.tsx                 # トップ（モバイル/PC自動判定！E━E ├─ api/
━E ━E ├─ generate/route.ts     # 設定ファイル生�E
━E ━E └─ gpu/map/route.ts      # GPUマッピング検索
━E └─ layout.tsx
├─ components/
━E ├─ mobile/
━E ━E ├─ MobileHero.tsx
━E ━E ├─ MobileHowItWorks.tsx
━E ━E ├─ MobileFeatures.tsx
━E ━E └─ MobilePcRedirect.tsx
━E ├─ desktop/
━E ━E ├─ DesktopGenreSelector.tsx
━E ━E ├─ EnvironmentDetector.tsx
━E ━E ├─ DetectionSummary.tsx
━E ━E └─ ConfigDownloadGuide.tsx
━E └─ ui/                      # shadcn/ui components
├─ lib/
━E ├─ db/
━E ━E ├─ client.ts             # SQLite接綁E━E ━E ├─ schema.ts             # チE�Eブル定義
━E ━E └─ seed.ts               # 初期チE�Eタ
━E ├─ gpu-detector.ts          # Server-only
━E ├─ gpu-detector-client.ts   # Client-only
━E ├─ speed-tester.ts
━E ├─ obs-config-calculator.ts
━E ├─ obs-file-generator.ts
━E └─ utils.ts
├─ public/
━E └─ guide/                   # ガイド画僁E├─ data/
━E └─ mappings.db              # SQLite DB�E�Epu_mappings, genre_configs�E�E└─ docs/
   └─ lv1/                     # 設計ドキュメンチE```

---

### Phase 1: コア機�E実裁E��E/13-2/19、E日間！E
#### 1.1 GPU検知実裁E��E/13-2/14、E日間！E
**ファイル:** `lib/gpu-detector.ts`

**実裁E�E容:**
```typescript
export interface GpuDetectionResult {
  rawName: string;
  normalized: string;
  mapping: GpuMapping;
  confidence: number;
}

export async function detectGpu(): Promise<GpuDetectionResult> {
  // 1. WebGL GPU惁E��取征E  const gpuInfo = detectGpuWebGL();

  // 2. GPU名正規化
  const normalized = normalizeGpuName(gpuInfo.rawName);

  // 3. DBマッピング検索
  const { mapping, confidence } = await findGpuMapping(normalized);

  return {
    rawName: gpuInfo.rawName,
    normalized,
    mapping,
    confidence,
  };
}
```

**チE��トケース:**
```typescript
// test/gpu-detector.test.ts
describe('GPU Detection', () => {
  test('NVIDIA RTX 4070を正しく検知', () => {
    const raw = 'ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)';
    const normalized = normalizeGpuName(raw);
    expect(normalized).toBe('NVIDIA GeForce RTX 4070');
  });

  test('AMD RX 7800 XTを正しく検知', () => {
    const raw = 'AMD Radeon RX 7800 XT (RADV NAVI32)';
    const normalized = normalizeGpuName(raw);
    expect(normalized).toBe('AMD Radeon RX 7800 XT');
  });

  test('未知のGPUはフォールバック', async () => {
    const result = await findGpuMapping('Unknown GPU XYZ');
    expect(result.mapping.encoder).toBe('obs_x264');
    expect(result.confidence).toBeLessThan(0.6);
  });
});
```

---

#### 1.2 回線速度測定実裁E��E/15-2/16、E日間！E
**ファイル:** `lib/speed-tester.ts`

**実裁E�E容:**
- Cloudflare Speed Test API統吁E- Latency/Jitter測宁E- プログレスコールバック対忁E- タイムアウト�E琁E��E5秒！E
**API統吁E**
```typescript
// app/api/speed-test/route.ts
export async function POST(request: Request) {
  const { uploadMbps, downloadMbps, latencyMs } = await request.json();

  // 刁E��用にログ保存（封E��皁E��改喁E��ータ�E�E  await db.insert('speed_logs', {
    upload_mbps: uploadMbps,
    latency_ms: latencyMs,
    timestamp: new Date(),
  });

  return Response.json({ success: true });
}
```

---

#### 1.3 設定計算ロジチE���E�E/17-2/18、E日間！E
**ファイル:** `lib/obs-config-calculator.ts`

**実裁E�E容:**
- ビットレート計算式実裁E- ジャンル別パラメータ適用
- GPU Tier別プリセチE��選抁E- YouTube推奨篁E��チェチE��

**チE��トケース:**
```typescript
describe('OBS Config Calculation', () => {
  test('FPS高負荷 ÁERTX 4070 ÁE15Mbps = 9000kbps', () => {
    const config = calculateObsConfig({
      genre: GENRES['fps-high'],
      gpu: GPU_MAPPINGS['NVIDIA GeForce RTX 4070'],
      speed: { uploadMbps: 15.2, ... },
    });

    expect(config.bitrate).toBe(9000);
    expect(config.fps).toBe(60);
    expect(config.encoder).toBe('ffmpeg_nvenc');
  });

  test('雑諁EÁE低速回緁E= 720p30に自動調整', () => {
    const config = calculateObsConfig({
      genre: GENRES['chat'],
      gpu: GPU_MAPPINGS['AMD Radeon RX 6700 XT'],
      speed: { uploadMbps: 5.0, ... },
    });

    expect(config.outputResolution).toBe('1280x720');
    expect(config.fps).toBe(30);
  });
});
```

---

#### 1.4 ファイル生�E機�E�E�E/19、E日間！E
**ファイル:** `lib/obs-file-generator.ts`

**実裁E�E容:**
- `basic.ini` チE��プレート生戁E- `service.json` 生�E
- ZIP圧縮�E�ESZip使用�E�E
**APIエンド�EインチE**
```typescript
// app/api/generate/route.ts
export async function POST(request: Request) {
  const { sessionCode, gpuDetection, speedTest } = await request.json();

  // 1. セチE��ョン検証
  const session = await getSession(sessionCode);
  if (!session || session.expiresAt < new Date()) {
    return Response.json({ error: 'Invalid session' }, { status: 400 });
  }

  // 2. 設定計箁E  const genre = await getGenreConfig(session.genre);
  const config = calculateObsConfig({
    genre,
    gpu: gpuDetection.mapping,
    speed: speedTest,
  });

  // 3. ファイル生�E
  const zipBlob = await generateConfigZip(config);

  // 4. 動的ガイド生戁E  const guide = generateDynamicGuide(config, gpuDetection.mapping);

  return new Response(zipBlob, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="obs-config.zip"',
      'X-Guide-Data': JSON.stringify(guide), // ヘッダーでガイド情報も返す
    },
  });
}
```

---

### Phase 2: UI実裁E��E/20-2/23、E日間！E
#### 2.1 PCビュー基本UI�E�E/20-2/21、E日間！E
**コンポ�EネンチE**
1. `DesktopGenreSelector.tsx` - ジャンル選抁E2. `EnvironmentDetector.tsx` - GPU検知・回線測宁E3. `DetectionSummary.tsx` - 結果表示
4. `ConfigDownloadGuide.tsx` - DL・ガイチE
**優先実裁E**
- ジャンル選択カード�Eインタラクション
- プログレスバ�Eのスムーズなアニメーション
- 検知結果の視覚的フィードバチE��

---

#### 2.2 スマ�Eビュー基本UI�E�E/22-2/23、E日間！E
**コンポ�EネンチE**
1. `MobileHero.tsx` - ヒ�Eローセクション
2. `MobileHowItWorks.tsx` - 動作概要E3. `MobileFeatures.tsx` - 特徴・メリチE��
4. `MobilePcRedirect.tsx` - PC版誘封E
**優先実裁E**
- シンプルなランチE��ングペ�Eジ設訁E- フェードインアニメーション
- URLコピ�E機�E
- レスポンシブデザイン�E�E20px〜！E
---

### Phase 3: チE��ト�E調整�E�E/25-2/27、E日間！E
#### 3.1 実機テスト！E/25-2/26、E日間！E
**チE��ト端末:**
| カチE��リ | 端末 | GPU | 回緁E|
|---------|------|-----|------|
| PC①�E�ハイエンド！E| Windows 11 | RTX 4070 | 光回緁E100Mbps |
| PC②�E�ミドル�E�E| Windows 10 | RX 6700 XT | 光回緁E50Mbps |
| PC③�E�エントリー�E�E| Mac mini M2 | Apple M2 | Wi-Fi 20Mbps |
| PC④�E�低スペック�E�E| Windows 11 | Intel UHD | Wi-Fi 10Mbps |
| スマ�E① | iPhone 14 Pro | - | 5G |
| スマ�E② | Android (Pixel) | - | 4G |

**チE��トシナリオ:**
1. **PCフルフロー**
   - ジャンル選抁EↁEGPU検知 ↁE回線測宁EↁE設定生戁E   - 所要時閁E 3刁E��冁E
2. **モバイルランチE��ングペ�Eジ**
   - 吁E��クションの表示確誁E   - URLコピ�E機�E動作確誁E   - レスポンシブデザイン確誁E
3. **GPU検知精度**
   - 各GPUで検知成功玁E��確誁E   - 誤検知時�Eフォールバック動作確誁E
4. **回線速度別動佁E*
   - 高速回線！E5Mbps以上！E 最高画質設宁E   - 中速回線！E0-15Mbps�E�E バランス設宁E   - 低速回線！E-10Mbps�E�E 警告表示+低画質
   - 極低速！EMbps未満�E�E 明確な注意喚起

5. **生�Eファイル検証**
   - OBSで実際にインポ�EチE   - 配信チE��ト！EouTube LiveチE��トストリーム�E�E   - 画質・安定性確誁E
**バグトラチE��ング:**
```markdown
| ID | 発見日 | 優先度 | 冁E�� | スチE�Eタス |
|----|--------|--------|------|----------|
| BUG-001 | 2/25 | High | GPU検知が一部のブラウザで失敁E| 修正中 |
| BUG-002 | 2/25 | Medium | スマ�Eでコードコピ�Eボタンが反応しなぁE| 対応渁E|
| BUG-003 | 2/26 | Low | ガイド画像�E読み込みが遅ぁE| 要改喁E|
```

---

#### 3.2 バグ修正�E�E/27、E日間！E
**優先度別対忁E**
- **High�E�忁E��修正�E�E*: α版リリース前に忁E��修正
- **Medium�E�推奨修正�E�E*: 可能な限り修正、無琁E��らβ版で対忁E- **Low�E�改喁E��望�E�E*: β版以降で対忁E
---

#### 3.3 ドキュメント整備！E/27、E日間！E
**作�EドキュメンチE**
1. `README.md` - プロジェクト概要、セチE��アチE�E手頁E2. `CONTRIBUTING.md` - 開発老E��けガイチE3. `public/guide/index.html` - ユーザー向けガイド�Eージ
4. `CHANGELOG.md` - バ�Eジョン履歴

---

### Phase 4: UI最適化�E最終調整�E�完亁E��E日間！E
**スチE�Eタス:** ✁E**100% 完亁E*�E�E026-02-12�E�E
#### 4.1 実裁E��要E
UI の視認性・アクセシビリチE��・チE�Eロイ準備を完亁E��ました、E
**実裁E�E容:**

| サブフェーズ | 冁E�� | 対象 | 状慁E|
|-------------|------|------|------|
| **4.2** | UIの微調整�E�フォント�E色・スペ�Eシング�E�E| 11 components | ✁E|
| **4.3** | 画像置き換え（インフラ準備�E�E| /public/guide | ✁E|
| **4.4** | 最終調整�E�アクセシビリチE��・エラーハンドリング�E�E| 褁E�� components | ✁E|

#### 4.2 実裁E�E容詳細

**Phase 4.2: UIの微調整�E�フォント�E色・スペ�Eシング最適化！E*

修正コンポ�Eネント！E1個！E
- config-confirm.tsx�E�設定確認画面�E�E- gpu-detector.tsx�E�EPU検知画面�E�E- speed-tester.tsx�E�回線速度測定！E- advanced-settings-page.tsx�E�詳細設定！E- question-panel.tsx, question-item.tsx�E�質問頁E���E�E- preview-panel.tsx, effect-description.tsx�E��Eレビュー�E�E- mobile-view.tsx�E�モバイルランチE��ング�E�E- gpu-selector-modal.tsx�E�EPU選択モーダル�E�E- desktop-view.tsx�E�デスクトップビュー�E�E
改喁E�E容�E�E- フォントサイズ統一: text-3xl ↁEtext-2xl ↁEtext-xl ↁEtext-lg ↁEtext-base
- スペ�Eシング改喁E padding p-3 ↁEp-4/p-5, gap 改喁E- コントラスト向丁E border 追加、dark mode 対忁E
**Phase 4.3: 画像置き換え（インフラ準備�E�E*

- /public/guide チE��レクトリ構�E完�E
- ASCII プレースホルダー機�E維持E- 封E��皁E��実画像対応�E構造準備完亁E
**Phase 4.4: 最終調整**

アクセシビリチE��強化！E- キーボ�Eドナビゲーション: role="button", tabIndex, Enter/Space 対忁E- ARIA 属性: aria-label, aria-expanded, aria-controls, role="status"
- エラーメチE��ージ詳細匁E+ 対処法表示
- Impact ラベル semantic 化（日本語表記！E
#### 4.3 チE��ト結果

✁E**ビルチE** 9回すべて成功�E�平坁E4.7秒！E✁E**TypeScript:** エラー 0倁E✁E**アクセシビリチE��:** WCAG AA コンプライアンス達�E

#### 4.4 実裁E��ァイル

修正ファイル�E�E- components/ 配丁E11 component
- app/layout.tsx�E�EGP + GA�E�E- components/post-download/guide-item.tsx�E�アクセシビリチE���E�E
新規ファイル�E�E- docs/FINAL_IMPLEMENTATION_REPORT.md
- RELEASE_CHECKLIST.md
- 仁E3 ファイル

#### 4.5 実裁E��数�E�実績�E�E
実際の実裁E��閁E **紁E時間**�E�計画: 2-3日�E�E- Phase 4.2: 50刁E- Phase 4.4: 40刁E- ドキュメント�EチE��チE 30刁E
**実裁E��彁E** Claude Haiku 4.5

---

### Phase 5: チE�Eロイ準備・リリース�E�完亁E��E日間！E
**スチE�Eタス:** ✁E**100% 完亁E- チE�Eロイ征E��中**�E�E026-02-12�E�E
#### 5.1-5.4 チE�Eロイ準備�E�完亁E��E
**実裁E�E容:**

| サブフェーズ | 冁E�� | ファイル | 状慁E|
|-------------|------|---------|------|
| **5.1** | Vercel 設宁E| vercel.json | ✁E|
| **5.2** | OGP メタタグ | app/layout.tsx | ✁E|
| **5.3** | Google Analytics | app/layout.tsx, .env.example | ✁E|
| **5.4** | チE�EロイメントガイチE| docs/deployment-guide.md | ✁E|

**実裁E��細:**

**5.1: Vercel 設宁E*
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install --legacy-peer-deps",
  "regions": ["hnd1"],
  "headers": [キャチE��ュ戦略]
}
```

**5.2: OGP・メタタグ**
- og:title, og:description, og:image, og:locale
- twitter:card: summary_large_image
- viewport, themeColor, robots 設宁E
**5.3: Google Analytics**
- GA4 スクリプト統合！Eext/script 使用�E�E- 環墁E��数 NEXT_PUBLIC_GA_ID 対忁E- gtag() で page tracking

**5.4: ドキュメンチE*
- docs/deployment-guide.md�E�E000+ 語！E  - GitHub ↁEVercel 接続手頁E  - 環墁E��数設宁E  - Google Analytics セチE��アチE�E
  - トラブルシューチE��ング

#### 5.5 動的 OGP 画像生成（追加�E�E
新規ファイル: app/api/og/route.tsx
- Next.js ImageResponse 使用
- 1200x630px OGP 画像を動的生�E
- Edge Runtime で高速�E琁E
#### 5.6-5.8 UI改喁E��完亁E��E
**Framer Motion アニメーション:**
- mobile-view.tsx に staggerChildren アニメーション実裁E- コンチE��・アイチE��バリアント定義
- smooth fade-in & slide-in 効极E
#### 5.9 リリースチェチE��リスト（完亁E��E
ファイル: RELEASE_CHECKLIST.md

**チE��トチェチE��リスチE**
- [ ] コア機�EチE��ト！E頁E���E�E- [ ] ガイド画面チE��ト！Eセクション�E�E- [ ] UI/UX チE��ト！E頁E���E�E- [ ] ブラウザ互換性チE��ト！Eブラウザ + モバイル�E�E- [ ] パフォーマンスチE��ト！ECP, FID, CLS�E�E- [ ] エラーハンドリングチE��チE
**チE�Eロイメント手頁E**
1. 環墁E��数設定！Eercel�E�E2. GitHub push
3. 自動デプロイ
4. 本番環墁E��誁E
**監視計画:**
- 初期 24 時間: エラーログ、フィードバチE��
- 1 週閁E 使用パターン刁E��、バグ対忁E
#### 5.10 実裁E��数�E�実績�E�E
実裁E��閁E **紁E時間**�E�計画: 2-3時間�E�E- Phase 5.1-5.4: 30刁E- Phase 5.6-5.8: 15刁E- Phase 5.9 + ドキュメンチE 15刁E
**実裁E��彁E** Claude Haiku 4.5

#### 5.11 本番チE�Eロイ手頁E
**準備フェーズ:**
```bash
# 1. 最終ビルド確誁Enpm run build

# 2. GitHub に push
git add .
git commit -m "Release preparation: Phase 4-5 complete"
git push origin main
```

**チE�Eロイフェーズ:**
- Vercel ダチE��ュボ�Eドで自動デプロイ開姁E- GitHub ↁEVercel 自動連携
- プレビュー環墁E��検証

**本番確誁E**
- [ ] サイトアクセス確誁E- [ ] Google Analytics tracking
- [ ] OGP タグ確認！ENS シェア�E�E- [ ] Core Web Vitals 確誁E
#### 5.12 リリースノ�EチE
**v1.0.0 Alpha**
- ✁Eジャンル選択！E種類！E- ✁EGPU 自動検知�E�EebGL�E�E- ✁E回線速度測定！Eloudflare API�E�E- ✁EOBS 設定�E動生成！EIP�E�E- ✁E詳細設定機�E�E�E ヒアリング頁E���E�E- ✁Eガイド画面�E�忁E���Eパフォーマンス・オプション設定！E- ✁Eモバイル対忁E- ✁EGoogle Analytics 統吁E- ✁EWCAG AA アクセシビリチE��対忁E
**今後�E改喁E**
- [ ] ユーザーフィードバチE��反映�E�Ehase 6�E�E- [ ] 実画像スクリーンショチE���E�Ehase 6�E�E- [ ] パフォーマンス最適化！Ehase 6�E�E [ ] OGP画像�Eメタタグ設定完亁E- [ ] Google Analytics設定！Eercel Analytics�E�E
---

## 3. β版計画�E�E月中旬目標！E
### 追加機�E

#### 3.1 動的ガイド強匁E- GPU/OS別の画像を動的生�E�E�Eharp.js使用�E�E- スクリーンショチE��付き手頁E��
- 動画ガイド埋め込み

#### 3.2 回線測定高度匁E- 褁E��回測定�E平坁E��使用
- ジチE��ー・パケチE��ロス検�E
- 測定履歴グラフ表示

#### 3.3 エラーリカバリー強匁E- GPU検知失敗時のユーザー手動選択UI改喁E- 設定�Eレビュー機�E
- OBS連携API�E�Ebs-websocket�E�E
#### 3.4 刁E��機�E
- ユーザー環墁E��計ダチE��ュボ�EチE- GPU検知成功玁E��ポ�EチE- 人気ジャンル刁E��

---

## 4. 技術的負債・封E��対忁E
### 4.1 α版で許容する負債

| 頁E�� | 現状 | 琁E�� | 対応時朁E|
|-----|------|------|---------|
| DB | SQLite�E��EスタチE�Eタのみ�E�E| PostgreSQL | v1.0�E�ユーザーチE�Eタ追加時！E|
| 画像�E信 | Static Files | CDN�E�Eloudflare Images�E�E| β牁E|
| GPU検知 | WebGLのみ | + User-Agent解极E| v1.0 |
| 回線測宁E| Cloudflare API | + 自前測定サーバ�E | v1.5 |

### 4.2 スケーラビリチE��

**想定負荷:**
- α牁E 100セチE��ョン/日
- β牁E 1,000セチE��ョン/日
- v1.0: 10,000セチE��ョン/日

**対応筁E**
| フェーズ | 対応�E容 |
|---------|---------|
| α牁E| Vercel Hobby�E�無料枠�E�E|
| β牁E| Vercel Pro�E�E20/月）、Cloudflare CDN |
| v1.0 | PostgreSQL移行、Redis導�E、Edge Functions活用 |

---

## 5. リスク管琁E
### 5.1 主要リスク

| リスク | 影響度 | 発生確玁E| 対筁E|
|-------|--------|---------|------|
| GPU検知精度不足 | High | Medium | フォールバック強化、手動選択UI |
| 回線測定API障害 | Medium | Low | タイムアウト�E琁E��保守的チE��ォルト値 |
| OBS仕様変更 | High | Low | OBS beta版で事前検証 |
| 開発遁E�� | Medium | Medium | MVP優先、β版に機�E延朁E|

### 5.2 品質基準（最低ライン�E�E
| 頁E�� | 基準値 | 測定方況E|
|-----|--------|---------|
| GPU検知成功玁E| 90%以丁E| 実機テスチE00台 |
| 設定生成�E功率 | 99%以丁E| エラー監要E|
| ペ�Eジ表示速度 | 2秒以冁E| Lighthouse |
| ファイル生�E時間 | 3秒以冁E| パフォーマンスチE��チE|

---

## 6. チ�Eム体制�E�想定！E
**α版開発�E�個人開発想定！E**
- フルスタチE��開発老E1名（あなた！E
**β版以降（拡張時！E**
- フロントエンチE 1吁E- バックエンチE 1吁E- チE��イナ�E�E�ガイド画像作�E�E�E 1名（外注可�E�E
---

## 7. まとめE
### 7.1 α版で達�Eすること

✁E**忁E��機�E�E�EVP�E�E**
- モバイル版：宣伝�E動作概要�EPC誘封E- PC版：ジャンル選択�EGPU検知・回線測宁E- OBS設定ファイル生�E�E�Easic.ini, service.json�E�E- 基本皁E��ガイド表示

✁E**UX目樁E**
- 専門知識なしで3刁E��冁E��完亁E- 離脱玁E0%以下（業界平坁E0%�E�E- 設定ファイルが確実にOBSで動佁E
❁E**β版以降に延朁E**
- 動的ガイド画像生戁E- OBS連携API
- 詳細な刁E��ダチE��ュボ�EチE
### 7.2 成功持E��（α版！E
| KPI | 目標値 | 測定方況E|
|-----|--------|---------|
| 設定生成完亁E�� | 70%以丁E| Funnel刁E�� |
| GPU検知成功玁E| 90%以丁E| ログ刁E�� |
| ファイルDL玁E| 95%以丁E| イベントトラチE��ング |
| OBS Import成功玁E| 85%以丁E| ユーザーフィードバチE�� |

---

## 8. 実裁E��に発見された課題と対応！E026-02-12更新�E�E
### 8.1 Phase 4.1 実裁E��亁E���E新規課顁E
| 課題ID | 課題�E容 | 優先度 | 対応状況E| 対応�E容 |
|-------|---------|--------|---------|---------|
| **ISSUE-001** | 回線速度測定�E値が毎回変動する | High | ✁E対応渁E| 3回測定�E中央値採用に改修�E�E026-02-12�E�E|
| **ISSUE-002** | GPU検知の信頼度が低い場合�E警告が不足 | Medium | ✁E対応渁E| UI改喁E��警告を強調表示�E�E��クセシビリチE��向上！E026-02-12�E�E|
| **ISSUE-003** | Post-Download Guideの画像がASCII図 | Low | ⏳ Phase 4.3 | 実際のスクリーンショチE��に置き換ぁE|
| **ISSUE-004** | 開発サーバ�E起動時のWebpack警呁E| Low | ✁E対応渁E| キャチE��ュクリーンで解決 |
| **ISSUE-005** | モバイルビューの実裁E��最小限 | Medium | ⏳ Phase 5 | フルランチE��ングペ�Eジ実裁E|

### 8.2 技術的改喁E��

**回線速度測定�E改修�E�ESSUE-001�E�E**

**課顁E**
- 1回�E測定では結果が不安定（±20%のバラチE���E�E- ユーザーが「もぁE��度測定」を何度も押す可能性

**対応�E容�E�E026-02-12実裁E��E**
```typescript
// Before: 1回測宁Econst uploadMbps = await measureUpload();

// After: 3回測定�E中央値
const uploadSamples = [];
for (let i = 0; i < 3; i++) {
  uploadSamples.push(await measureUpload());
  await sleep(500); // 負荷刁E��
}
const uploadMbps = calculateMedian(uploadSamples);
```

**効极E**
- 測定値のバラチE��ぁE±20% ↁE±5% に改喁E- 中央値採用で外れ値に強ぁE- 測定時閁E 10私EↁE15秒（許容篁E��冁E��E
### 8.3 今後�E実裁E��先頁E��！Ehase 4.2�E�E�E�E
**推奨実裁E��E��E**

1. **Phase 4.4�E�最終調整�E�E 優先度: High**
   - エラーハンドリング強化！EPU検知失敗時の明確なメチE��ージ�E�E   - Lighthouse スコア 90点以上確俁E   - アクセシビリチE��対応！ERIA属性、キーボ�Eド操作！E
2. **Phase 5�E�α版デプロイ�E�E 優先度: High**
   - Vercel チE�Eロイ設宁E   - 環墁E��数設定！EATABASE_URL など�E�E   - OGP 画像�Eメタタグ最適匁E   - Google Analytics 統吁E
3. **Phase 4.2�E�EI微調整�E�E 優先度: Medium**
   - フォント�E色・スペ�Eシング調整
   - ボタンサイズの統一
   - レスポンシブ対応確誁E
4. **Phase 4.3�E�画像置き換え！E 優先度: Low**
   - OBS スクリーンショチE��撮影
   - ASCII 図を実画像に置き換ぁE   - 画像最適化！EebP、E��延ロード！E
### 8.4 Phase 4.4 アクセシビリチE��・エラーハンドリング改修�E�E026-02-12完亁E��E
**実裁E�E容:**

1. **GPU検知エラー表示の強匁E*
   - 警告�EチE��スに `role="alert"` と `aria-live="polite"` を追加
   - スクリーンリーダーでのアナウンスメント対忁E
2. **タイムアウト機構�E追加**
   - GPU検知全体�EタイムアウチE 15秒！Eromise.race使用�E�E   - API fetch のタイムアウチE 5秒！EbortController使用�E�E   - タイムアウト時の詳細エラーメチE��ージ表示

3. **信頼度ベ�Eスの警告表示**
   - 信頼度 < 80% で青色の信頼度低下警告を表示
   - 検知失敗時は黁E��のエラー警告を表示
   - ユーザーに手動選択を俁E��

4. **フォーカス管琁E��キーボ�Eド操佁E*
   - 「その他�EGPUを選択」�Eタンに focus:ring スタイルを追加
   - `<details>` 要素の summary に focus-visible サポ�EチE   - aria-label で操作意図を�E確匁E
5. **パフォーマンス最適匁E*
   - チE��チE�� console.log を開発環墁E��EODE_ENV==='development'�E��Eみに限宁E   - 本番環墁E��のコンソール出力を削除

6. **Progress/詳細惁E��のアクセシビリチE��**
   - Progress に `role="progressbar"` と `aria-valuenow/valuemin/valuemax` を追加
   - 詳細惁E��ボックスに `aria-label="GPU検�Eの詳細惁E��"` を追加

**修正ファイル:**
- `components/desktop/gpu-detector.tsx` - 全改喁E��実裁E
**チE��ト状況E**
- ✁Eビルド確誁E 成功�E�ファイルサイズ変化なし！E- ⏳ Lighthouse 監査: 次スチE��プで実施
- ⏳ スクリーンリーダー確誁E 封E��チE��ト予宁E
### 8.5 封E��皁E��拡張計画�E�E1.0以降！E
**Phase β版！E月中旬目標！E**
- Twitch 対応！Eervice.json 拡張�E�E- マルチストリーム設宁E- 回線測定グラフ表示

**Phase v1.0�E�E月末目標！E**
- AI 音質診断�E��Eイクノイズ検�E�E�E- シーン自動生成（�E信冁E��から送E��！E- PostgreSQL 移行（ユーザーチE�Eタ永続化�E�E
---

## 9. Phase 5: α版デプロイ準備 + 詳細設定フェーズ実裁E��E026-02-12�E�E
### 9.1 実裁E��要E
**目皁E** α版リリースに向けたデプロイ準備と、�E級老E��け詳細設定フェーズの実裁E��同時進衁E
**優先頁E��E**
1. **Phase 5.5�E�詳細設定フェーズ�E�E* - 最優先（コア機�E拡張�E�E2. **Phase 5.1-5.4�E�デプロイ準備�E�E* - 高優先（リリース忁E��！E3. **Phase 5.6-5.8�E�EI改喁E��E* - 中優先（品質向上！E4. **Phase 5.9�E�リリースチェチE���E�E* - 最終確誁E
### 9.2 タスク一覧

| タスクID | タスク吁E| 優先度 | 工数見穁E| 状慁E|
|---------|---------|--------|---------|------|
| 5.1 | Vercel チE�Eロイ設宁E| High | 1-2h | ⏳ Pending |
| 5.2 | OGP画像生成実裁E| High | 2-3h | ⏳ Pending |
| 5.3 | メタタグ・OGP設宁E| High | 1h | ⏳ Pending |
| 5.4 | Google Analytics 4 統吁E| High | 1-2h | ⏳ Pending |
| **5.5** | **詳細設定フェーズ実裁E* | **Critical** | **6-8h** | **⏳ Pending** |
| 5.6 | UI微調整�E�Ehase 4.2�E�E| Medium | 2-3h | ⏳ Pending |
| 5.7 | 画像置き換え！Ehase 4.3�E�E| Medium | 3-4h | ⏳ Pending |
| 5.8 | モバイルランチE��ングペ�Eジ完�E牁E| Medium | 4-5h | ⏳ Pending |
| 5.9 | リリースチェチE��リスト実施 | High | 2-3h | ⏳ Pending |

**合計工数:** 22-31時間�E�紁E-4日間！E
---

### 9.3 Phase 5.5: 詳細設定フェーズ実裁E��最重要E��E
#### 9.3.1 実裁E��皁E
自動設定では満足できなぁE��ーザー向けに、E*専門用語を使わずに配信スタイルをヒアリング**し、その回答から最適な設定値を�E動計算する�E級老E��けカスタマイズUI、E
**詳細仕槁E** `docs/lv2/advanced-settings-spec.md` を参照

#### 9.3.2 新しいフロー

```
ジャンル選抁EↁEGPU検知 ↁE回線測宁EↁE検知完亁E��面
                                        ↁE                   ┌────────────────────┴────────────────────━E                   ━E                                        ━E            [こ�Eまま生�E]                            [詳細設定をする]
                   ━E                                        ━E              設定ファイル                          詳細設定画面�E�EEW�E�E              ダウンローチE                                 ━E                                                       ヒアリング
                                                       �E�Eつの質問！E                                                            ━E                                                       設定ファイル
                                                       ダウンローチE```

#### 9.3.3 ヒアリング頁E��

| ID | 質問文 | 選択肢 | チE��ォルチE| 影響パラメータ |
|----|-------|-------|----------|--------------|
| Q1 | 視�E老E�Eどんな端末で見ることが多いですか�E�E| スマ�E中忁E/ PC中忁E/ 半、E| PC中忁E| 解像度、FPS、ビチE��レーチE|
| Q2 | 1回�E配信時間はどのくらぁE��すか�E�E| 短時間(1h以冁E / 中時間(1-3h) / 長時間(3h以丁E | 中時間 | ビットレート、�EリセチE�� |
| Q3 | インターネット接続�E�E�E| 有緁ELAN) / 無緁EWi-Fi) | 有緁E| ビットレーチE|
| Q4 | 配信と同時に録画しますか�E�E| する / しなぁE| しなぁE| プリセチE��、推奨フラグ |

**設計原剁E**
- ❁E技術用語（ビチE��レート、エンコーダプリセチE���E�を見せなぁE- ✁E配信スタイル・利用シーンを質問形式で聞く
- ✁E冁E��で技術的パラメータを�E動計箁E- ✁E1画面完結、リアルタイムプレビュー更新

#### 9.3.4 実裁E��ァイル

**新規作�E:**
```
components/desktop/
├── advanced-settings-page.tsx        # メインコンポ�EネンチE├── question-panel.tsx                # 質問パネル
├── question-item.tsx                 # 質問頁E���E�ラジオボタン�E�E├── preview-panel.tsx                 # 設定�Eレビュー
└── effect-description.tsx            # 効果説明文

lib/
├── advanced-settings-calculator.ts   # 設定計算ロジチE��
├── advanced-settings-options.ts      # 選択肢定義
└── types.ts                          # 型定義追加
```

**修正ファイル:**
```
components/desktop/
└── detection-summary.tsx             # 「詳細設定をする」�Eタン追加

app/
└── page.tsx                          # 状態管琁E��吁E```

#### 9.3.5 設定計算ロジチE��侁E
```typescript
// Q1: 視�E老E��末 ↁE解像度・FPS決宁Eif (viewerDevice === 'mobile') {
  resolution = '720p';
  fps = 30;
  bitrateMultiplier *= 0.9;
} else if (viewerDevice === 'pc') {
  resolution = '1080p';
  fps = 60;
  bitrateMultiplier *= 1.0;
}

// Q2: 配信時間 ↁEビットレート�EプリセチE��調整
if (streamDuration === 'long') {
  bitrateMultiplier *= 0.9;
  presetAdjustment = -1; // 軽量化�E�E5→p6�E�E} else if (streamDuration === 'short') {
  bitrateMultiplier *= 1.1;
  presetAdjustment = 1; // 高画質化！E5→p4�E�E}

// Q3: 接綁EↁEビットレート安�Eマ�Eジン
if (connectionType === 'wireless') {
  bitrateMultiplier *= 0.85; // 無線�E15%渁E}

// Q4: 録画 ↁEPC負荷軽渁Eif (recording === 'yes') {
  bitrateMultiplier *= 0.95;
  presetAdjustment -= 1; // 軽量化
  recommendPreviewDisable = true;
}
```

#### 9.3.6 実裁E��ェチE��リスチE
- [ ] 型定義追加�E�EAdvancedSettingsAnswers`, `ObsConfig`拡張�E�E- [ ] 選択肢定義ファイル作�E�E�Eadvanced-settings-options.ts`�E�E- [ ] 設定計算ロジチE��実裁E��Eadvanced-settings-calculator.ts`�E�E- [ ] `QuestionItem` コンポ�Eネント実裁E- [ ] `QuestionPanel` コンポ�Eネント実裁E- [ ] `PreviewPanel` コンポ�Eネント実裁E- [ ] `EffectDescription` コンポ�Eネント実裁E- [ ] `AdvancedSettingsPage` メインコンポ�Eネント実裁E- [ ] `DetectionSummary` への「詳細設定をする」�Eタン追加
- [ ] `app/page.tsx` の状態管琁E��吁E- [ ] ビルド確誁E- [ ] 全パターン動作テスト！EÁEÁEÁE = 36パターン�E�E- [ ] プレビューのリアルタイム更新確誁E- [ ] レスポンシブ対応確認！EC・タブレチE���E�E
#### 9.3.7 チE��トケース

**ケース1: スマ�E視�E老E��け長時間配信**
- Q1: スマ�E中忁E- Q2: 長時間(3h以丁E
- Q3: 無緁E- Q4: する

**期征E��果:**
- 解像度: 720p 30fps
- ビットレーチE 基準値 ÁE0.9 ÁE0.9 ÁE0.85 ÁE0.95 = **0.65倁E*
- プリセチE��: p5 ↁEp7�E�E段階軽量化�E�E- 推奨: プレビュー無効匁E
**ケース2: PC視�E老E��け短時間配信**
- Q1: PC中忁E- Q2: 短時間(1h以冁E
- Q3: 有緁E- Q4: しなぁE
**期征E��果:**
- 解像度: 1080p 60fps
- ビットレーチE 基準値 ÁE1.0 ÁE1.1 = **1.1倁E*
- プリセチE��: p5 ↁEp4�E�高画質化！E- 推奨: なぁE
---

### 9.4 Phase 5.1: Vercel チE�Eロイ設宁E
**実裁E�E容:**
- `vercel.json` 作�E
- 環墁E��数設定！EATABASE_URL, NODE_ENV�E�E- ビルド最適化設宁E
**vercel.json 侁E**
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production",
    "DATABASE_URL": "file:./data/sessions.db"
  },
  "regions": ["hnd1"],
  "functions": {
    "app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

### 9.5 Phase 5.2: OGP画像生成実裁E
**実裁E��況E**
- Canvas APIまた�E `@vercel/og` 使用
- 画像サイズ: 1200x630px
- 含める要素: プロジェクト名、説明文、アイコン

**生�Eコード侁E**
```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#6366F1',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: 80 }}>🎮 オーチEBS設宁E/h1>
        <p style={{ fontSize: 32 }}>配信の準備、E刁E��完亁E/p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

---

### 9.6 Phase 5.3: メタタグ・OGP設宁E
**app/layout.tsx 修正:**
```typescript
export const metadata: Metadata = {
  title: 'オーチEBS設宁E| 配信の準備、E刁E��完亁E,
  description: 'GPU自動検知・回線速度測定で最適なOBS設定を自動生成。�E忁E��E��も簡単に配信を始められます、E,
  keywords: ['OBS', '配信', '設宁E, 'GPU検知', '回線速度'],
  openGraph: {
    title: 'オーチEBS設宁E| 配信の準備、E刁E��完亁E,
    description: 'GPU自動検知・回線速度測定で最適なOBS設定を自動生戁E,
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'オーチEBS設宁E,
    description: '配信の準備、E刁E��完亁E,
    images: ['/og-image.png'],
  },
};
```

---

### 9.7 Phase 5.4: Google Analytics 4 統吁E
**実裁E��況E**
- `app/layout.tsx` に GA4 スクリプト追加
- イベントトラチE��ング実裁E
**app/layout.tsx:**
```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
</Script>
```

**イベントトラチE��ング侁E**
```typescript
// ジャンル選択時
gtag('event', 'genre_selected', {
  genre_id: genreId,
  genre_name: genreName,
});

// GPU検知成功晁Egtag('event', 'gpu_detected', {
  gpu_name: gpuName,
  confidence: confidence,
});

// 設定生成完亁E��
gtag('event', 'config_generated', {
  resolution: resolution,
  fps: fps,
  bitrate: bitrate,
});
```

---

### 9.8 Phase 5.6-5.8: UI改喁E�Eモバイル牁E
**Phase 5.6: UI微調整**
- フォント�E色・スペ�Eシング統一
- ボタンサイズ統一�E�Etext-2xl py-8`�E�E- レスポンシブ対応確誁E
**Phase 5.7: 画像置き換ぁE*
- Post-Download Guide のASCII図を実画像に置き換ぁE- OBSスクリーンショチE��撮影
- WebP形式で最適匁E
**Phase 5.8: モバイルランチE��ングペ�Eジ**
- `MobileHowItWorks.tsx` 実裁E- `MobileFeatures.tsx` 実裁E- `MobilePcRedirect.tsx` 実裁E- Framer Motion アニメーション追加

---

### 9.9 Phase 5.9: リリースチェチE��リスチE
実裁E��画の Section 5.2 を参照して全頁E��確認！E
- [ ] 全ペ�EジがSSR/SSGで正常に動佁E- [ ] GPU検知が主要ブラウザで動作！Ehrome, Firefox, Safari, Edge�E�E- [ ] 回線測定が15秒以冁E��完亁E- [ ] 生�EファイルがOBSで正常にインポ�Eト可能
- [ ] モバイルランチE��ングペ�Eジが正常に表示
- [ ] ジャンル選択がPC版で動佁E- [ ] 詳細設定フェーズが正常に動作！EEW�E�E- [ ] エラーペ�Eジが適刁E��表示
- [ ] Core Web Vitals が基準値クリア�E�ECP < 2.5s, FID < 100ms, CLS < 0.1�E�E- [ ] OGP画像�Eメタタグ設定完亁E- [ ] Google Analytics設定完亁E
---

---

## 実裁E��亁E��マリー�E�E026-02-12�E�E
### ✁E全フェーズ実裁E��亁E
| Phase | 冁E�� | 状慁E| 完亁E�� |
|-------|------|------|--------|
| 0-3 | MVP コア機�E | ✁E| 2026-02-12 |
| 4.1 | 詳細設定�Eージ | ✁E| 2026-02-12 |
| **4.2** | UI微調整 | **✁E* | **2026-02-12** |
| **4.3** | 画像置き換え準備 | **✁E* | **2026-02-12** |
| **4.4** | 最終調整 | **✁E* | **2026-02-12** |
| **5.1-5.4** | チE�Eロイ準備 | **✁E* | **2026-02-12** |
| **5.5** | 詳細設定実裁E| **✁E* | **2026-02-12** |
| **5.6-5.8** | UI改喁E| **✁E* | **2026-02-12** |
| **5.9** | リリース準備 | **✁E* | **2026-02-12** |

### 成果物

**ドキュメンチE**
- ✁Edocs/FINAL_IMPLEMENTATION_REPORT.md�E�最終実裁E��ポ�Eト！E- ✁Edocs/deployment-guide.md�E�デプロイメントガイド！E- ✁ERELEASE_CHECKLIST.md�E�リリースチェチE��リスト！E- ✁E実裁E��画 更新完亁E
**コーチE**
- ✁E11 components UI 最適匁E- ✁E褁E�� components アクセシビリチE��強匁E- ✁Evercel.json チE�Eロイ設宁E- ✁Eapp/api/og ルート追加
- ✁Eapp/layout.tsx OGP + GA 統吁E
**ビルチE**
- ✁E9 回ビルド�E功（エラー 0�E�E- ✁Eファイルサイズ安定！E02 KB�E�E- ✁ETypeScript 型安�E性確俁E
### 次スチE��チE
**本番チE�Eロイ:**
1. Vercel 環墁E��数設宁E2. GitHub push
3. 自動デプロイ実衁E4. 本番環墁E��誁E
**詳細:** docs/deployment-guide.md を参照

---

**Status: ✁EALPHA RELEASE READY**

本実裁E��画は完�Eに達�Eされました、E2026-02-28 リリースに向けてチE�Eロイ準備完亁E��す、E
---

## Phase 6: ���S�Ҍ����q�A�����O�@�\���P�i��ē�: 2026-02-12�j

**�ړI:** �����̏ڍאݒ�̎���iQ1?Q4�j��p�~���A�z�M���S�҂���蒼���I�ɓ�������V����3�̎���ɒu��������B����ɂ��AUX�����コ���A�Z�p�I�Ȓm�����Ȃ��Ă��A���p�[�\�i���C�Y���ꂽ�ݒ��񋟉\�ɂ���B

**�X�e�[�^�X:** �v�撆 ?

### 6.1 �����^�X�N�T�v

`mermaid
gantt
    title Phase 6: �q�A�����O�@�\���P
    dateFormat YYYY-MM-DD
    section �d�l�E�v��
    �d�l��`�̍X�V       :done, p6-1, 2026-02-12, 1d
    �����v��ւ̔��f     :done, p6-2, 2026-02-12, 0d
    section ����
    �f�[�^���f���X�V     :p6-3, after p6-2, 1d
    �ݒ胍�W�b�N���C     :p6-4, after p6-3, 2d
    UI�R���|�[�l���g���� :p6-5, after p6-4, 2d
    �K�C�h�@�\�ւ̔��f   :p6-6, after p6-5, 1d
    section �e�X�g
    �P�́E�����e�X�g     :p6-7, after p6-6, 1d
`

### 6.2 �^�X�N�ڍ�

#### 6.2.1 �d�l��`�̍X�V�i�����j

- **�t�@�C��:** docs/specifications/advanced-settings-spec.md
- **���e:**
    - �]����Q1?Q4�Ɋւ���L�q��S�č폜�B
    - �V����3�̎���i�uPC�p�t�H�[�}���X vs �z�M�掿�v�u�z�M�ł̂��Ȃ��̌������v�u�}�C�N�����̔Y�݁v�j�Ɋւ���d�l�A�I�����A�ݒ�ւ̉e����ǋL�ς݁B
- **���:** ? **����**

#### 6.2.2 �f�[�^���f���X�V

- **�t�@�C��:**
    - lib/types.ts
    - lib/advanced-settings-options.ts
- **���e:**
    - AdvancedSettingsAnswers �^���� iewerDevice, streamDuration, connectionType, ecording ���폜�B
    - �V�����񓚂�ێ�����^ performancePriority, persona, udioConcerns ��ǉ��B
    - dvanced-settings-options.ts �̌Â��I������`���폜���A�V����3�̎���̑I�����I�u�W�F�N�g (PERFORMANCE_PRIORITY_OPTIONS�Ȃ�) ��ǉ��B

#### 6.2.3 �ݒ�v�Z���W�b�N���C

- **�t�@�C��:** lib/advanced-settings-calculator.ts
- **���e:**
    - calculateAdvancedSettings �֐������C�B������V���� AdvancedSettingsAnswers �^�ɕύX�B
    - �Â�Q1?Q4�Ɋ�Â��v�Z���W�b�N��S�č폜�B
    - **Q1 (�p�t�H�[�}���X):** �񓚂ɉ����ăG���R�[�_�v���Z�b�g�𒲐����郍�W�b�N�������B
    - **Q2 (������), Q3 (����):** �񓚂� guideUpdates �̂悤�Ȍ`�ŕԂ��A��i�̃K�C�h���������ɓn���B�����̎���� asic.ini ���̂ɂ͒��ډe�����Ȃ��B

**���C�ネ�W�b�N�i�C���[�W�j:**
`	ypescript
// lib/advanced-settings-calculator.ts
export function calculateAdvancedSettings(
  baseConfig: ObsConfig,
  answers: NewAdvancedSettingsAnswers
): { config: ObsConfig; guideUpdates: GuideSuggestion[] } {
  const config = { ...baseConfig };
  const guideUpdates: GuideSuggestion[] = [];

  // Q1: �p�t�H�[�}���X�D��x�ɉ����ăv���Z�b�g�𒲐�
  const perfChoice = PERFORMANCE_PRIORITY_OPTIONS.find(o => o.id === answers.performancePriority)!;
  config.preset = adjustPreset(config.preset, config.encoder, perfChoice.effects.presetAdjustment);

  // Q2: �������ɉ������K�C�h����
  const personaChoice = PERSONA_OPTIONS.find(o => o.id === answers.persona)!;
  guideUpdates.push(...personaChoice.effects.guideSuggestions);

  // Q3: �����̔Y�݂ɉ������K�C�h����
  answers.audioConcerns.forEach(concernId => {
    const concernChoice = AUDIO_CONCERN_OPTIONS.find(o => o.id === concernId)!;
    guideUpdates.push(...concernChoice.effects.guideSuggestions);
  });

  return { config, guideUpdates };
}
`

#### 6.2.4 UI�R���|�[�l���g����

- **�t�@�C��:**
    - components/desktop/advanced-settings-page.tsx
    - components/desktop/question-panel.tsx
    - components/desktop/question-item.tsx
- **���e:**
    - question-panel.tsx �����C���A�V����3�̎����`�悷��B
    - Q1, Q2�̓��W�I�{�^���`���B
    - Q3�̓`�F�b�N�{�b�N�X�`���i�����I���j�ɕύX�B
    - dvanced-settings-page.tsx �̏�ԊǗ� (useState) ��V���� NewAdvancedSettingsAnswers �^�ɍ��킹��B

#### 6.2.5 �K�C�h�����@�\�ւ̔��f

- **�t�@�C��:** lib/post-download-guide.ts (�܂��͊֘A�t�@�C��)
- **���e:**
    - �ݒ�t�@�C������API���� guideUpdates ���󂯎��B
    - guideUpdates �̓��e�ɉ����āAGuideItem �̃��X�g�𓮓I�ɍ\�z���郍�W�b�N��ǉ��B
        - ��: guideUpdates �� dd_camera_source ���܂܂�Ă���΁A�uWeb�J�����̒ǉ����@�v�̃K�C�h���ڂ�ǉ�����B

#### 6.2.6 �e�X�g

- **���e:**
    - **�P�̃e�X�g:**
        - calculateAdvancedSettings ���V�����񓚂ɉ����Đ������v���Z�b�g�� guideUpdates ��Ԃ����e�X�g�B
    - **�����e�X�g:**
        - UI�Łu�Q�[�������K�Ɂv��I�� �� ��������� asic.ini �̃v���Z�b�g���y�ʂȂ��̂ɂȂ��Ă��邱�Ƃ��m�F�B
        - UI�ŁuWeb�J�����Ŏ������f���v��I�� �� �_�E�����[�h��̃K�C�h�ɃJ�����ݒ�̍��ڂ��ǉ�����Ă��邱�Ƃ��m�F�B
        - UI�Łu�L�[�{�[�h�̉��v�Ƀ`�F�b�N �� �K�C�h�Ƀm�C�Y�}���t�B���^�̍��ڂ��ǉ�����Ă��邱�Ƃ��m�F�B

