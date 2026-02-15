/**
 * プリセット管理ロジック
 * ローカルストレージを使用してプリセートを保存/読み込み
 * Phase 6.3.3で作成
 */

import type { PresetMetadata, PresetConfig } from './types';

const STORAGE_KEY = 'obs-auto-config-presets';

/**
 * 全プリセートをローカルストレージから読み込み
 */
export function loadPresets(): PresetMetadata[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const presets: PresetMetadata[] = JSON.parse(data);

    // Date型の復元
    return presets.map((preset) => ({
      ...preset,
      createdAt: new Date(preset.createdAt),
      updatedAt: new Date(preset.updatedAt),
      config: {
        ...preset.config,
        speedResult: {
          ...preset.config.speedResult,
          timestamp: new Date(preset.config.speedResult.timestamp),
        },
      },
    }));
  } catch (error) {
    console.error('Failed to load presets:', error);
    return [];
  }
}

/**
 * プリセートをローカルストレージに保存
 */
export function savePreset(
  name: string,
  config: PresetConfig,
  description?: string
): PresetMetadata {
  const presets = loadPresets();

  const newPreset: PresetMetadata = {
    id: generateId(),
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    config,
  };

  presets.push(newPreset);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    return newPreset;
  } catch (error) {
    console.error('Failed to save preset:', error);
    throw new Error('プリセートの保存に失敗しました');
  }
}

/**
 * プリセートを更新
 */
export function updatePreset(
  id: string,
  updates: {
    name?: string;
    description?: string;
    config?: PresetConfig;
  }
): PresetMetadata | null {
  const presets = loadPresets();
  const index = presets.findIndex((p) => p.id === id);

  if (index === -1) {
    console.error('Preset not found:', id);
    return null;
  }

  const updatedPreset: PresetMetadata = {
    ...presets[index],
    ...updates,
    updatedAt: new Date(),
  };

  presets[index] = updatedPreset;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
    return updatedPreset;
  } catch (error) {
    console.error('Failed to update preset:', error);
    throw new Error('プリセートの更新に失敗しました');
  }
}

/**
 * プリセートを削除
 */
export function deletePreset(id: string): boolean {
  const presets = loadPresets();
  const filtered = presets.filter((p) => p.id !== id);

  if (filtered.length === presets.length) {
    console.error('Preset not found:', id);
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Failed to delete preset:', error);
    throw new Error('プリセートの削除に失敗しました');
  }
}

/**
 * IDでプリセートを取得
 */
export function loadPresetById(id: string): PresetMetadata | null {
  const presets = loadPresets();
  return presets.find((p) => p.id === id) || null;
}

/**
 * 全プリセートを削除（デバッグ用）
 */
export function clearAllPresets(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear presets:', error);
  }
}

/**
 * UUIDv4の簡易実装
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * プリセート名のバリデーション
 */
export function validatePresetName(name: string): {
  valid: boolean;
  error?: string;
} {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'プリセート名を入力してください' };
  }

  if (name.length > 50) {
    return { valid: false, error: 'プリセート名は50文字以内にしてください' };
  }

  const presets = loadPresets();
  if (presets.some((p) => p.name === name.trim())) {
    return { valid: false, error: 'この名前は既に使用されています' };
  }

  return { valid: true };
}
