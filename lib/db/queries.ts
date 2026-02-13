/**
 * データベースクエリ関数
 * GPU、ジャンル、セッション関連のCRUD操作
 */

import { getDb } from './client';
import type {
  GpuMapping,
  GenreConfig,
  GenreId,
  GpuVendor,
} from '../types';

// ========================================
// GPU Mappings
// ========================================

/**
 * GPU名で完全一致検索
 */
export function findGpuByName(gpuName: string): GpuMapping | null {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM gpu_mappings WHERE gpu_name = ?
  `);

  const row = stmt.get(gpuName) as any;
  if (!row) return null;

  return {
    gpuName: row.gpu_name,
    vendor: row.vendor,
    encoder: row.encoder,
    preset: row.preset,
    maxBitrate: row.max_bitrate,
    supportsHevc: Boolean(row.supports_hevc),
    supportsAv1: Boolean(row.supports_av1),
    tier: row.tier,
  };
}

/**
 * 全GPUマッピングを取得（あいまい検索用）
 */
export function getAllGpuMappings(): GpuMapping[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM gpu_mappings');
  const rows = stmt.all() as any[];

  return rows.map((row) => ({
    gpuName: row.gpu_name,
    vendor: row.vendor,
    encoder: row.encoder,
    preset: row.preset,
    maxBitrate: row.max_bitrate,
    supportsHevc: Boolean(row.supports_hevc),
    supportsAv1: Boolean(row.supports_av1),
    tier: row.tier,
  }));
}

/**
 * ベンダー別フォールバックGPU設定を取得
 */
export function getFallbackGpuByVendor(vendor: GpuVendor): GpuMapping {
  // フォールバック設定（DB未登録時の安全値）
  const fallbacks: Record<GpuVendor, GpuMapping> = {
    nvidia: {
      gpuName: 'NVIDIA (Generic)',
      vendor: 'nvidia',
      encoder: 'ffmpeg_nvenc',
      preset: 'p5',
      maxBitrate: 8000,
      supportsHevc: false,
      supportsAv1: false,
      tier: 2,
    },
    amd: {
      gpuName: 'AMD (Generic)',
      vendor: 'amd',
      encoder: 'ffmpeg_amf',
      preset: 'balanced',
      maxBitrate: 7000,
      supportsHevc: false,
      supportsAv1: false,
      tier: 2,
    },
    intel: {
      gpuName: 'Intel (Generic)',
      vendor: 'intel',
      encoder: 'ffmpeg_qsv',
      preset: 'balanced',
      maxBitrate: 6000,
      supportsHevc: false,
      supportsAv1: false,
      tier: 3,
    },
    apple: {
      gpuName: 'Apple (Generic)',
      vendor: 'apple',
      encoder: 'com.apple.videotoolbox.videoencoder.h264',
      preset: 'quality',
      maxBitrate: 8000,
      supportsHevc: false,
      supportsAv1: false,
      tier: 2,
    },
    unknown: {
      gpuName: 'Unknown GPU',
      vendor: 'unknown',
      encoder: 'obs_x264',
      preset: 'veryfast',
      maxBitrate: 5000,
      supportsHevc: false,
      supportsAv1: false,
      tier: 3,
    },
  };

  return fallbacks[vendor];
}

// ========================================
// Genre Configs
// ========================================

/**
 * ジャンルIDで検索
 */
export function findGenreById(genreId: GenreId): GenreConfig | null {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM genre_configs WHERE genre_id = ?
  `);

  const row = stmt.get(genreId) as any;
  if (!row) return null;

  return {
    genreId: row.genre_id,
    displayName: row.display_name,
    exampleGames: row.example_games.split(','),
    bitrateMultiplier: row.bitrate_multiplier,
    fpsPriority: row.fps_priority,
    qualityPriority: row.quality_priority,
    recommendedFps: row.recommended_fps,
    keyframeInterval: row.keyframe_interval,
  };
}

/**
 * 全ジャンル設定を取得
 */
export function getAllGenres(): GenreConfig[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM genre_configs');
  const rows = stmt.all() as any[];

  return rows.map((row) => ({
    genreId: row.genre_id,
    displayName: row.display_name,
    exampleGames: row.example_games.split(','),
    bitrateMultiplier: row.bitrate_multiplier,
    fpsPriority: row.fps_priority,
    qualityPriority: row.quality_priority,
    recommendedFps: row.recommended_fps,
    keyframeInterval: row.keyframe_interval,
  }));
}

