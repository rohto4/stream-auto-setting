/**
 * 詳細設定フェーズ - 設定計算ロジック
 * ヒアリング回答から最終設定を計算
 * (Phase 6: 2026-02-12改訂)
 */

import type {
  AdvancedSettingsAnswers,
  GuideSuggestion,
  ObsConfig,
} from './types';
import {
  PERFORMANCE_PRIORITY_OPTIONS,
  PERSONA_OPTIONS,
  AUDIO_CONCERN_OPTIONS,
} from './advanced-settings-options';

/**
 * ヒアリング結果から最終設定とガイドの更新内容を計算
 * @param baseConfig 自動検知による基本設定
 * @param answers ヒアリング回答
 * @returns 計算済みの設定値と、ガイドに追加すべき提案のリスト
 */
export function calculateAdvancedSettings(
  baseConfig: ObsConfig,
  answers: AdvancedSettingsAnswers
): { config: ObsConfig; guideUpdates: GuideSuggestion[] } {
  const config = { ...baseConfig };
  const guideUpdates: GuideSuggestion[] = [];

  // 1. エンコーダプリセット調整（Q1: パフォーマンス優先度の影響）
  const perfChoice = PERFORMANCE_PRIORITY_OPTIONS.find(
    (o) => o.id === answers.performancePriority
  )!;
  config.preset = adjustPreset(
    config.preset,
    config.encoder,
    perfChoice.effects.presetAdjustment
  );

  // 2. ガイド内容の更新（Q2: 見せ方の影響）
  const personaChoice = PERSONA_OPTIONS.find((o) => o.id === answers.persona)!;
  guideUpdates.push(...personaChoice.effects.guideSuggestions);

  // 3. ガイド内容の更新（Q3: 音声の悩みの影響）
  answers.audioConcerns.forEach((concernId) => {
    const concernChoice = AUDIO_CONCERN_OPTIONS.find(
      (o) => o.id === concernId
    )!;
    guideUpdates.push(...concernChoice.effects.guideSuggestions);
  });

  return { config, guideUpdates };
}

/**
 * プリセットを軽量化/高画質化する
 * @param currentPreset 現在のプリセット
 * @param encoder エンコーダ種別
 * @param adjustment -1=軽量化, 0=維持, 1=高画質化
 */
function adjustPreset(
  currentPreset: string,
  encoder: string,
  adjustment: number
): string {
  if (adjustment === 0) return currentPreset;

  // NVENCの場合（p4 ~ p7）
  if (encoder === 'ffmpeg_nvenc') {
    const presets = ['p4', 'p5', 'p6', 'p7'];
    const currentIndex = presets.indexOf(currentPreset);
    if (currentIndex === -1) return currentPreset;

    // adjustmentが1（高画質化）ならインデックスを-1、-1（軽量化）ならインデックスを+1
    const newIndex = Math.max(
      0,
      Math.min(presets.length - 1, currentIndex - adjustment)
    );
    return presets[newIndex];
  }

  // AMFの場合（quality/balanced/speed）
  if (encoder === 'ffmpeg_amf') {
    const presets = ['quality', 'balanced', 'speed'];
    const currentIndex = presets.indexOf(currentPreset);
    if (currentIndex === -1) return currentPreset;

    const newIndex = Math.max(
      0,
      Math.min(presets.length - 1, currentIndex - adjustment)
    );
    return presets[newIndex];
  }

  // QSVの場合（quality/balanced/speed）
  if (encoder === 'ffmpeg_qsv') {
    const presets = ['quality', 'balanced', 'speed'];
    const currentIndex = presets.indexOf(currentPreset);
    if (currentIndex === -1) return currentPreset;

    const newIndex = Math.max(
      0,
      Math.min(presets.length - 1, currentIndex - adjustment)
    );
    return presets[newIndex];
  }

  // VideoToolboxの場合（quality/balanced）
  if (encoder === 'videotoolbox') {
    const presets = ['quality', 'balanced'];
    const currentIndex = presets.indexOf(currentPreset);
    if (currentIndex === -1) return currentPreset;

    const newIndex = Math.max(
      0,
      Math.min(presets.length - 1, currentIndex - adjustment)
    );
    return presets[newIndex];
  }

  // x264の場合（ultrafast ~ medium）
  if (encoder === 'obs_x264') {
    const presets = [
      'ultrafast',
      'superfast',
      'veryfast',
      'faster',
      'fast',
      'medium',
    ];
    const currentIndex = presets.indexOf(currentPreset);
    if (currentIndex === -1) return currentPreset;
    
    // adjustmentが1（高画質化）ならインデックスを+1、-1（軽量化）ならインデックスを-1
    const newIndex = Math.max(
      0,
      Math.min(presets.length - 1, currentIndex + adjustment)
    );
    return presets[newIndex];
  }

  return currentPreset;
}
