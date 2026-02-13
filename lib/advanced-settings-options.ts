/**
 * 詳細設定フェーズ - 選択肢定義
 * ヒアリング項目の選択肢と効果を定義
 * (Phase 6: 2026-02-12改訂)
 */

import type {
  PerformancePriority,
  Persona,
  AudioConcern,
  GuideSuggestion,
} from './types';

// ========================================
// Q1: PCパフォーマンス vs 配信画質
// ========================================

export interface PerformancePriorityOption {
  id: PerformancePriority;
  label: string;
  description: string;
  effects: {
    presetAdjustment: -1 | 0 | 1; // -1=軽量化(速度優先), 0=維持, 1=高画質化
  };
}

export const PERFORMANCE_PRIORITY_OPTIONS: PerformancePriorityOption[] = [
  {
    id: 'performance',
    label: 'ゲームをサクサク快適にプレイしたい',
    description: 'PCへの負荷を最も軽くする設定を優先します。',
    effects: {
      presetAdjustment: -1,
    },
  },
  {
    id: 'quality',
    label: '視聴者に少しでも綺麗な映像を届けたい',
    description: 'PCへの負荷は少し上がりますが、配信の画質を優先します。',
    effects: {
      presetAdjustment: 1,
    },
  },
  {
    id: 'balanced',
    label: 'おまかせ（推奨）',
    description: 'ゲームの快適さと配信画質を両立する、バランスの取れた設定です。',
    effects: {
      presetAdjustment: 0,
    },
  },
];

// ========================================
// Q2: 配信でのあなたの見せ方
// ========================================

export interface PersonaOption {
  id: Persona;
  label: string;
  description: string;
  effects: {
    guideSuggestions: GuideSuggestion[];
  };
}

export const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: 'camera',
    label: 'Webカメラで自分を映す（顔出し）',
    description: 'ゲーム画面の隅にあなたの映像を表示します。',
    effects: {
      guideSuggestions: ['add_camera_source'],
    },
  },
  {
    id: 'avatar',
    label: 'アバターやキャラクターを代わりに表示する（VTuberなど）',
    description: 'VTube Studioなどのアプリと連携する場合に選びます。',
    effects: {
      guideSuggestions: ['setup_vtuber_capture'],
    },
  },
  {
    id: 'voice_only',
    label: '声だけで、画面には登場しない',
    description: 'ゲーム画面のみを配信します。最もシンプルな構成です。',
    effects: {
      guideSuggestions: [],
    },
  },
];

// ========================================
// Q3: マイク音声の悩み（複数選択）
// ========================================

export interface AudioConcernOption {
  id: AudioConcern;
  label: string;
  description: string;
  effects: {
    guideSuggestions: GuideSuggestion[];
  };
}

export const AUDIO_CONCERN_OPTIONS: AudioConcernOption[] = [
  {
    id: 'volume',
    label: '自分の声が小さすぎたり、大きすぎたりしないか心配',
    description: '声量を自動で一定に保つフィルタの設定をガイドに追加します。',
    effects: {
      guideSuggestions: ['add_compressor_filter'],
    },
  },
  {
    id: 'noise',
    label: 'キーボードの音や、周りの生活音が入らないか心配',
    description: '不要なノイズや環境音だけを消すフィルタの設定をガイドに追加します。',
    effects: {
      guideSuggestions: ['add_noise_suppression_filter', 'add_noise_gate_filter'],
    },
  },
];
