/**
 * 型定義
 * data-schema.mdの型定義をTypeScriptで実装
 */

// ========================================
// GPU関連
// ========================================

export type GpuVendor = 'nvidia' | 'amd' | 'intel' | 'apple' | 'unknown';
export type GpuTier = 1 | 2 | 3; // 1=High, 2=Mid, 3=Low

export interface GpuMapping {
  gpuName: string;
  vendor: GpuVendor;
  encoder: string;
  preset: string;
  maxBitrate: number; // kbps
  supportsHevc: boolean;
  supportsAv1: boolean;
  tier: GpuTier;
}

export interface GpuDetectionResult {
  rawName: string; // WebGLから取得した生の文字列
  normalized: string; // 正規化後のGPU名
  mapping: GpuMapping; // マッピング結果
  confidence: number; // 検知信頼度(0-1)
}

export interface GpuInfo {
  rawName: string;
  vendor: string;
  renderer: string;
  webglVersion: number;
}

// ========================================
// ジャンル関連
// ========================================

export type GenreId = 'fps-high' | 'rpg-mid' | 'puzzle-low' | 'chat' | 'retro';

export interface GenreConfig {
  genreId: GenreId;
  displayName: string;
  exampleGames: string[];
  bitrateMultiplier: number;
  fpsPriority: number; // 1-10
  qualityPriority: number; // 1-10
  recommendedFps: 30 | 60;
  keyframeInterval: number; // seconds
  audioBitrate: number; // kbps
}

// ========================================
// 回線速度
// ========================================

export interface SpeedTestResult {
  uploadMbps: number;
  downloadMbps: number; // 参考値
  latencyMs: number;
  jitterMs: number;
  timestamp: Date;
}

export type SpeedTier = 'excellent' | 'good' | 'fair' | 'poor';

export interface SpeedAssessment {
  tier: SpeedTier;
  uploadMbps: number;
  recommendedMaxBitrate: number; // kbps
  message: string;
  warning?: string;
}

// ========================================
// OBS設定
// ========================================

export interface ObsConfig {
  // basic.ini [Audio] セクション
  audioBitrate: number; // kbps

  // basic.ini [Output] セクション
  encoder: string;
  preset: string;
  bitrate: number; // kbps
  keyframeInterval: number; // seconds
  fps: 30 | 60;

  // basic.ini [Video] セクション
  outputResolution: '1920x1080' | '1280x720';
  baseResolution: '1920x1080';

  // 詳細設定
  bFrames: number;
  lookahead: boolean;
  psychoVisualTuning: boolean;
  gpuScheduling: boolean;
}

export interface ServiceConfig {
  type: 'rtmp_custom';
  settings: {
    server: string;
    key: string; // プレースホルダー
    use_auth: boolean;
  };
}

// ========================================
// 生成リクエスト/レスポンス
// ========================================

export interface GenerateConfigRequest {
  genre: GenreId;
  gpuDetection: GpuDetectionResult;
  speedTest: SpeedTestResult;
  overrides?: Partial<ObsConfig>; // 手動変更値
}

export interface GenerateConfigResponse {
  config: ObsConfig;
  files: {
    basicIni: string;
    serviceJson: string;
  };
  guide: DynamicGuide;
  warnings?: string[]; // 回線速度低下等の警告
}

// ========================================
// 動的ガイド
// ========================================

export interface DynamicGuide {
  steps: GuideStep[];
  estimatedTime: number; // 秒
}

export interface GuideStep {
  order: number;
  title: string;
  description: string;
  imageUrl?: string; // GPU/OS別画像
  isRequired: boolean;
  category: 'import' | 'audio' | 'video' | 'scene';
}

// ========================================
// Post-Download Guide (Phase 4)
// ========================================

export type GuideCategory =
  | 'required'
  | 'performance-high'
  | 'performance-mid'
  | 'optional';

export type PerformanceImpact = 'high' | 'medium' | 'low' | 'none';

export interface GuideItem {
  id: string;
  title: string;
  category: GuideCategory;
  priority: number; // 1-5 (5が最重要)
  impact: PerformanceImpact;
  impactDescription?: string; // 例: "CPU -10-15%"
  description: string;
  steps: string[]; // 手順のリスト
  imageUrl?: string; // 画像URL（将来実装）
  imagePlaceholder?: string; // 画像の代替テキスト（ASCII図など）
  estimatedTime?: number; // 設定にかかる推定時間（秒）
  completed?: boolean; // ユーザーが完了マークを付けたか
}

export interface GuideProgress {
  requiredCompleted: number; // 必須設定の完了数
  performanceSelected: string[]; // 選択されたパフォーマンス設定のID
  optionalCompleted: number; // 任意設定の完了数
  currentStep: 'required' | 'performance' | 'optional' | 'complete';
}

// ========================================
// 詳細設定フェーズ (Phase 6改訂)
// ========================================

export type PerformancePriority = 'performance' | 'quality' | 'balanced';
export type Persona = 'camera' | 'avatar' | 'voice_only';
export type AudioConcern = 'volume' | 'noise';

export type GuideSuggestion =
  | 'add_camera_source'
  | 'setup_vtuber_capture'
  | 'add_compressor_filter'
  | 'add_noise_gate_filter'
  | 'add_noise_suppression_filter';

export interface AdvancedSettingsAnswers {
  performancePriority: PerformancePriority;
  persona: Persona;
  audioConcerns: AudioConcern[]; // 複数選択可能
}
