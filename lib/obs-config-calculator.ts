/**
 * OBS設定計算ロジック
 * ジャンル・GPU・回線速度から最適な設定を計算
 */

import type {
  GenreConfig,
  GpuMapping,
  SpeedTestResult,
  ObsConfig,
} from './types';

export interface CalculationInput {
  genre: GenreConfig;
  gpu: GpuMapping;
  speed: SpeedTestResult;
  overrides?: Partial<ObsConfig>;
}

/**
 * OBS設定を計算
 */
export function calculateObsConfig(
  input: CalculationInput
): ObsConfig {
  const { genre, gpu, speed, overrides } = input;

  // 1. ビットレート計算
  const bitrate = calculateBitrate(speed.uploadMbps, genre, gpu);

  // 2. FPS決定
  const fps = determineFps(genre, overrides?.fps);

  // 3. 解像度決定
  const resolution = determineResolution(genre, bitrate);

  // 4. エンコーダ設定
  const encoderConfig = determineEncoderSettings(gpu, genre, bitrate);

  // 5. 詳細設定（デフォルト値付き）
  const advancedConfig = calculateAdvancedSettings(gpu, genre, fps);

  return {
    audioBitrate: genre.audioBitrate,
    encoder: encoderConfig.encoder,
    preset: encoderConfig.preset,
    bitrate,
    keyframeInterval: genre.keyframeInterval,
    fps,
    outputResolution: resolution,
    baseResolution: '1920x1080', // 常に1080pベース
    // デフォルト値
    bFrames: 0,
    lookahead: false,
    psychoVisualTuning: false,
    gpuScheduling: false,
    // 詳細設定で上書き
    ...advancedConfig,
    // ユーザー上書き
    ...overrides,
  };
}

/**
 * ビットレート計算
 * 基準: 回線速度の70% × ジャンル係数、GPU上限でキャップ
 */
function calculateBitrate(
  uploadMbps: number,
  genre: GenreConfig,
  gpu: GpuMapping
): number {
  // 基準値 = 回線速度の70%（安全マージン）
  const baseBitrate = uploadMbps * 1000 * 0.7; // kbps

  // ジャンル係数適用
  const genreAdjusted = baseBitrate * genre.bitrateMultiplier;

  // GPU上限でキャップ
  const gpuCapped = Math.min(genreAdjusted, gpu.maxBitrate);

  // YouTube推奨範囲内に制限
  // 1080p60: 4500-9000kbps
  // 1080p30: 3000-6000kbps
  // 720p60: 2250-6000kbps
  // 720p30: 1500-4000kbps
  const minBitrate = genre.recommendedFps === 60 ? 4500 : 3000;
  const maxBitrate = 9000;

  const final = Math.max(
    minBitrate,
    Math.min(gpuCapped, maxBitrate)
  );

  // 100kbps単位で丸め（OBSの推奨）
  return Math.round(final / 100) * 100;
}

/**
 * FPS決定
 * ジャンルのFPS優先度とGPU性能から判定
 */
function determineFps(
  genre: GenreConfig,
  override?: 30 | 60
): 30 | 60 {
  if (override) return override;

  // ジャンル推奨値を使用
  return genre.recommendedFps;
}

/**
 * 解像度決定
 * ビットレートが低い場合は720pに落とす
 */
function determineResolution(
  genre: GenreConfig,
  bitrate: number
): '1920x1080' | '1280x720' {
  // 雑談等の静止画多めジャンルは720pで高画質優先
  if (genre.qualityPriority >= 9 && genre.fpsPriority <= 5) {
    return '1280x720';
  }

  // ビットレートが5000kbps未満なら720p
  if (bitrate < 5000) {
    return '1280x720';
  }

  return '1920x1080';
}

/**
 * エンコーダとプリセット決定
 */
function determineEncoderSettings(
  gpu: GpuMapping,
  genre: GenreConfig,
  bitrate: number
): { encoder: string; preset: string } {
  const { vendor, encoder, preset, tier } = gpu;

  // 1. エンコーダはGPUマッピングから
  let finalEncoder = encoder;
  let finalPreset = preset;

  // 2. ジャンル別プリセット調整
  if (vendor === 'nvidia') {
    // NVIDIA: P4-P7（数字が小さいほど高画質）
    if (genre.qualityPriority >= 9) {
      // 画質優先
      finalPreset = tier === 1 ? 'p4' : tier === 2 ? 'p5' : 'p6';
    } else if (genre.fpsPriority >= 9) {
      // 速度優先
      finalPreset = tier === 1 ? 'p5' : tier === 2 ? 'p6' : 'p7';
    }
  } else if (vendor === 'amd') {
    // AMD: quality/balanced/speed
    if (genre.qualityPriority >= 9) {
      finalPreset = 'quality';
    } else if (genre.fpsPriority >= 9) {
      finalPreset = 'speed';
    } else {
      finalPreset = 'balanced';
    }
  } else if (vendor === 'intel') {
    // Intel QSV: 同様
    if (genre.qualityPriority >= 9) {
      finalPreset = 'quality';
    } else if (genre.fpsPriority >= 9) {
      finalPreset = 'speed';
    } else {
      finalPreset = 'balanced';
    }
  }

  return {
    encoder: finalEncoder,
    preset: finalPreset,
  };
}

/**
 * B-frames, Lookahead等の詳細設定
 */
function calculateAdvancedSettings(
  gpu: GpuMapping,
  genre: GenreConfig,
  fps: number
): Partial<ObsConfig> {
  const { vendor, tier } = gpu;

  const config: Partial<ObsConfig> = {};

  if (vendor === 'nvidia') {
    // B-frames: 高画質ジャンルで有効化
    config.bFrames = genre.qualityPriority >= 8 ? 2 : 0;

    // Lookahead: Tier 1のみ（高負荷）
    config.lookahead = tier === 1 && fps === 60;

    // Psycho Visual Tuning: 画質優先時のみ
    config.psychoVisualTuning = genre.qualityPriority >= 9;

    // GPU Scheduling: 常時有効（Windows 10 2004以降）
    config.gpuScheduling = true;
  } else if (vendor === 'amd') {
    // AMFの詳細設定
    config.bFrames = genre.qualityPriority >= 8 ? 2 : 0;
    config.lookahead = false; // AMFはLookahead非推奨
    config.psychoVisualTuning = false;
    config.gpuScheduling = true;
  } else if (vendor === 'intel') {
    // QSVの詳細設定
    config.bFrames = 2; // QSVはB-frames推奨
    config.lookahead = tier <= 2;
    config.psychoVisualTuning = false;
    config.gpuScheduling = true;
  } else {
    // x264（ソフトウェアエンコード）
    config.bFrames = 0; // CPU負荷軽減
    config.lookahead = false;
    config.psychoVisualTuning = false;
    config.gpuScheduling = false;
  }

  return config;
}

/**
 * GPU検知失敗時の安全な設定
 */
export function getSafeDefaultConfig(): ObsConfig {
  return {
    audioBitrate: 160,
    encoder: 'obs_x264',
    preset: 'veryfast',
    bitrate: 5000,
    keyframeInterval: 2,
    fps: 30,
    outputResolution: '1280x720',
    baseResolution: '1920x1080',
    bFrames: 0,
    lookahead: false,
    psychoVisualTuning: false,
    gpuScheduling: false,
  };
}
