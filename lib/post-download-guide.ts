/**
 * ダウンロード後ガイド機能
 * OBS手動設定ガイドデータ（10項目）
 */

import type { GuideItem, GuideSuggestion } from './types';

export const staticGuideItems: GuideItem[] = [
  // === 必須設定（3項目） ===
  // (既存の項目は変更なし)
  {
    id: 'youtube-stream-key',
    title: 'YouTube配信キーの設定',
    category: 'required',
    priority: 5,
    impact: 'none',
    description:
      'YouTube Liveの配信キーを設定しないと配信を開始できません。',
    steps: [
      'YouTube Studioを開く（https://studio.youtube.com）',
      '左メニューから「ライブ配信」をクリック',
      '「ストリームキー」をコピー',
      'OBS > 設定 > 配信 > 「ストリームキー」に貼り付け',
      '「OK」をクリック',
    ],
    estimatedTime: 120,
  },
  {
    id: 'microphone-setup',
    title: 'マイク音声の設定',
    category: 'required',
    priority: 5,
    impact: 'low',
    impactDescription: 'CPU +1-2%',
    description:
      'マイクを設定しないと視聴者に声が届きません。',
    steps: [
      'OBS > 設定 > 音声',
      '「マイク音声」でデバイスを選択',
      '「OK」をクリック',
      'OBSメイン画面の音声ミキサーでレベルを確認',
      '声を出してメーターが動くことを確認',
    ],
    estimatedTime: 60,
  },
  {
    id: 'game-capture',
    title: 'ゲーム画面のキャプチャ設定',
    category: 'required',
    priority: 5,
    impact: 'medium',
    impactDescription: 'キャプチャ方式でCPU 5-15%差',
    description:
      '配信する画面（ゲーム画面）をキャプチャする設定です。',
    steps: [
      'OBSのシーンパネルで「+」をクリック',
      '「ゲーム配信」などの名前を入力してOK',
      'ソースパネルで「+」をクリック',
      '「ゲームキャプチャ」を選択',
      'モードを「特定のウィンドウをキャプチャ」に設定（推奨）',
      'ゲームを起動してウィンドウを選択',
      '「OK」をクリック',
    ],
    estimatedTime: 180,
  },

  // === パフォーマンス設定（影響度: 大）（3項目） ===
  {
    id: 'disable-preview',
    title: 'プレビュー画面の無効化',
    category: 'performance-high',
    priority: 3,
    impact: 'high',
    impactDescription: 'CPU -10-15%',
    description:
      '配信中はプレビューを見ないので、無効化してCPU負荷を減らします。',
    steps: [
      'OBSのプレビュー画面を右クリック',
      '「プレビューを有効化」のチェックを外す',
    ],
    estimatedTime: 10,
  },
  {
    id: 'process-priority',
    title: 'プロセス優先度の設定',
    category: 'performance-high',
    priority: 4,
    impact: 'high',
    impactDescription: 'コマ落ち・音ズレ防止',
    description:
      'OBSの優先度を上げて、コマ落ちや音ズレを防ぎます。',
    steps: [
      'OBS > 設定 > 詳細設定',
      '「プロセス優先度」を「高」に設定',
      '「OK」をクリック',
    ],
    estimatedTime: 30,
  },
  {
    id: 'disable-recording',
    title: '自動録画の無効化',
    category: 'performance-high',
    priority: 2,
    impact: 'high',
    impactDescription: 'ディスクI/O削減',
    description:
      '配信と同時に録画すると負荷が高いため、配信のみの場合は無効化します。',
    steps: [
      'OBS > 設定 > 出力',
      '「録画」タブをクリック',
      '「録画を有効にする」のチェックを外す',
      '「OK」をクリック',
    ],
    estimatedTime: 30,
  },

  // === その他の最適化（4項目） ===
  {
    id: 'output-mode',
    title: '出力モードの確認',
    category: 'performance-mid',
    priority: 3,
    impact: 'medium',
    impactDescription: 'エンコーダ設定の最適化',
    description:
      '初心者は「シンプル」モード推奨。詳細制御したい場合は「詳細」を選択。',
    steps: [
      'OBS > 設定 > 出力',
      '出力モードを「シンプル」に設定（初心者向け）',
      'または「詳細」でレート制御を「CBR」に設定（上級者向け）',
      '「OK」をクリック',
    ],
    estimatedTime: 60,
  },
  {
    id: 'windows-game-mode',
    title: 'Windowsゲームモードの有効化',
    category: 'performance-mid',
    priority: 3,
    impact: 'medium',
    impactDescription: 'FPS +5-10%',
    description:
      'WindowsのゲームモードをONにすると、ゲームとOBSのパフォーマンスが向上します。',
    steps: [
      'Windowsキーを押して「設定」を開く',
      '「ゲーム」をクリック',
      '「ゲームモード」をONにする',
    ],
    estimatedTime: 30,
  },
  {
    id: 'browser-hw-accel',
    title: 'ブラウザソースのハードウェアアクセラレーション',
    category: 'optional',
    priority: 1,
    impact: 'low',
    impactDescription: 'ブラウザソース使用時のみ効果',
    description:
      'アラートやチャット画面などでブラウザソースを使う場合に有効化します。',
    steps: [
      'OBS > 設定 > 詳細設定',
      '「ブラウザのハードウェアアクセラレーションを有効にする」をON',
      '「OK」をクリック',
      'OBSを再起動',
    ],
    estimatedTime: 45,
  },
  {
    id: 'audio-monitoring',
    title: '音声モニタリングの設定',
    category: 'optional',
    priority: 3,
    impact: 'low',
    impactDescription: 'レイテンシー +わずか',
    description:
      '自分の声が配信に乗っているか、ヘッドホンで確認できるようにします。',
    steps: [
      'OBSメイン画面の音声ミキサーで歯車アイコンをクリック',
      '「オーディオの詳細プロパティ」を開く',
      'マイクの「音声モニタリング」を「モニターと出力」に設定',
      '「閉じる」をクリック',
    ],
    estimatedTime: 45,
  },
];

// ===============================================
// 動的ガイド項目データ (Phase 6追加)
// ===============================================

const dynamicGuideItems: Record<GuideSuggestion, GuideItem> = {
  add_camera_source: {
    id: 'add-camera-source',
    title: 'Webカメラを画面に追加',
    category: 'required',
    priority: 4,
    impact: 'low',
    impactDescription: 'CPU +2-5%',
    description: 'WebカメラをOBSに追加して、あなたの映像を配信に乗せます。',
    steps: [
      'OBSの「ゲーム配信」シーンを選択',
      'ソースパネルで「+」をクリック',
      '「映像キャプチャデバイス」を選択',
      '「新規作成」を選び、デバイスであなたのWebカメラを選択',
      '解像度/FPSタイプを「カスタム」にし、解像度を「1280x720」に設定',
      '「OK」をクリックし、画面隅に配置・サイズ調整',
    ],
    estimatedTime: 90,
  },
  setup_vtuber_capture: {
    id: 'setup-vtuber-capture',
    title: 'VTuber向けの設定',
    category: 'required',
    priority: 4,
    impact: 'medium',
    impactDescription: 'CPU +5-10%',
    description: 'VTuberとして配信するための、背景が透明なゲームキャプチャ設定です。',
    steps: [
      'OBSの「ゲーム配信」シーンの「ゲームキャプチャ」を右クリック',
      '「プロパティ」を選択',
      '「透過を許可」にチェックを入れる',
      '「OK」をクリック',
      '（ヒント: VTube StudioなどのアプリはOBSより先に起動してください）',
    ],
    estimatedTime: 45,
  },
  add_compressor_filter: {
    id: 'add-compressor-filter',
    title: '音声フィルタ: コンプレッサー',
    category: 'optional',
    priority: 4,
    impact: 'low',
    description: '大きい声と小さい声の音量差を自動で調整し、視聴者が聞き取りやすい音声にします。',
    steps: [
      'OBSメイン画面の音声ミキサーでマイクの「︙」をクリック',
      '「フィルタ」を選択',
      '左下の「+」をクリックし、「コンプレッサー」を選択',
      '設定値はそのままでOK。「閉じる」をクリック',
    ],
    estimatedTime: 60,
  },
  add_noise_gate_filter: {
    id: 'add-noise-gate-filter',
    title: '音声フィルタ: ノイズゲート',
    category: 'optional',
    priority: 3,
    impact: 'low',
    description: 'あなたが話していない時の、キーボードの打鍵音や環境音などをカットします。',
    steps: [
      '音声フィルタの画面を開く（コンプレッサーと同様の手順）',
      '「+」をクリックし、「ノイズゲート」を選択',
      '設定値はそのままでOK。「閉じる」をクリック',
    ],
    estimatedTime: 30,
  },
  add_noise_suppression_filter: {
    id: 'add-noise-suppression-filter',
    title: '音声フィルタ: ノイズ抑制',
    category: 'optional',
    priority: 3,
    impact: 'low',
    description: 'マイクに乗る「サー」というホワイトノイズなどを除去します。',
    steps: [
      '音声フィルタの画面を開く',
      '「+」をクリックし、「ノイズ抑制」を選択',
      '方式は「RNNoise（高品質、CPU使用率・高）」を推奨',
      '「閉じる」をクリック',
    ],
    estimatedTime: 30,
  },
};

// ===============================================
// ガイド生成ロジック (Phase 6追加)
// ===============================================

/**
 * ユーザーの回答に応じて表示するガイド項目を動的に生成する
 * @param suggestions 詳細設定の回答から生成された提案リスト
 * @returns 表示すべきガイド項目の全リスト
 */
export function generateDynamicGuide(suggestions: GuideSuggestion[]): GuideItem[] {
  const allGuides = [...staticGuideItems];
  
  // 提案リストに基づいて、動的ガイド項目を追加
  suggestions.forEach(suggestionId => {
    const itemToAdd = dynamicGuideItems[suggestionId];
    if (itemToAdd && !allGuides.some(g => g.id === itemToAdd.id)) {
      // カテゴリを調整して必須項目として追加
      if (suggestionId === 'add_camera_source' || suggestionId === 'setup_vtuber_capture') {
        allGuides.push({ ...itemToAdd, category: 'required' });
      } else {
        allGuides.push(itemToAdd);
      }
    }
  });

  // 優先度(priority)が高い順にソート
  allGuides.sort((a, b) => b.priority - a.priority);

  return allGuides;
}

// ===============================================
// 既存のヘルパー関数 (変更なし)
// ===============================================

/**
 * ガイド項目をカテゴリ別に取得
 * @deprecated generateDynamicGuideの使用を推奨
 */
export function getGuidesByCategory(
  category: GuideItem['category']
): GuideItem[] {
  return staticGuideItems.filter((item) => item.category === category);
}

/**
 * 必須設定ガイドを取得
 * @deprecated generateDynamicGuideの使用を推奨
 */
export function getRequiredGuides(): GuideItem[] {
  return getGuidesByCategory('required');
}

/**
 * パフォーマンス設定ガイドを取得
 * @deprecated generateDynamicGuideの使用を推奨
 */
export function getPerformanceGuides(): GuideItem[] {
  return [
    ...getGuidesByCategory('performance-high'),
    ...getGuidesByCategory('performance-mid'),
  ];
}

/**
 * 詳細設定ガイドを取得
 * @deprecated generateDynamicGuideの使用を推奨
 */
export function getOptionalGuides(): GuideItem[] {
  return getGuidesByCategory('optional');
}
