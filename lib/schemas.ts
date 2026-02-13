/**
 * Zodバリデーションスキーマ
 * data-schema.mdのバリデーション定義
 */

import { z } from 'zod';

// ジャンル
export const genreIdSchema = z.enum([
  'fps-high',
  'rpg-mid',
  'puzzle-low',
  'chat',
  'retro',
]);

// GPU検知結果
export const gpuDetectionResultSchema = z.object({
  rawName: z.string(),
  normalized: z.string(),
  mapping: z.object({
    gpuName: z.string(),
    vendor: z.enum(['nvidia', 'amd', 'intel', 'apple', 'unknown']),
    encoder: z.string(),
    preset: z.string(),
    maxBitrate: z.number().int().positive(),
    supportsHevc: z.boolean(),
    supportsAv1: z.boolean(),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  }),
  confidence: z.number().min(0).max(1),
});

// 回線速度テスト結果
export const speedTestResultSchema = z.object({
  uploadMbps: z.number().positive(),
  downloadMbps: z.number().positive(),
  latencyMs: z.number().nonnegative(),
  jitterMs: z.number().nonnegative(),
  timestamp: z.coerce.date(),
});

// 設定生成リクエスト
export const obsConfigSchema = z.object({
  encoder: z.string(),
  preset: z.string(),
  bitrate: z.number().int(),
  keyframeInterval: z.number().int(),
  fps: z.union([z.literal(30), z.literal(60)]),
  outputResolution: z.union([z.literal('1920x1080'), z.literal('1280x720')]),
  baseResolution: z.literal('1920x1080'),
  bFrames: z.number().int(),
  lookahead: z.boolean(),
  psychoVisualTuning: z.boolean(),
  gpuScheduling: z.boolean(),
});

export const guideSuggestionSchema = z.enum([
  'add_camera_source',
  'setup_vtuber_capture',
  'add_compressor_filter',
  'add_noise_gate_filter',
  'add_noise_suppression_filter',
]);

export const generateConfigRequestSchema = z.object({
  genre: genreIdSchema,
  gpuDetection: gpuDetectionResultSchema,
  speedTest: speedTestResultSchema,
  overrides: obsConfigSchema.partial().optional(),
  guideUpdates: z.array(guideSuggestionSchema).optional(),
});
