/**
 * GPU検知ロジック
 * WebGLからGPU情報を取得し、DBマッピングと照合
 */

import Fuse from 'fuse.js';
import type {
  GpuInfo,
  GpuDetectionResult,
  GpuMapping,
  GpuVendor,
} from './types';
import {
  findGpuByName,
  getAllGpuMappings,
  getFallbackGpuByVendor,
} from './db/queries';

/**
 * WebGLからGPU情報を取得
 * クライアント側で実行される
 */
export function detectGpuWebGL(): GpuInfo | null {
  if (typeof window === 'undefined') {
    return null; // サーバー側では実行しない
  }

  try {
    // Canvas要素作成（非表示）
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      console.warn('WebGL not supported');
      return null;
    }

    const webglVersion =
      gl instanceof WebGL2RenderingContext ? 2 : 1;

    // デバッグ拡張機能取得
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (!debugInfo) {
      // フォールバック: 基本情報のみ
      return {
        rawName: gl.getParameter(gl.RENDERER) || 'Unknown',
        vendor: gl.getParameter(gl.VENDOR) || 'Unknown',
        renderer: gl.getParameter(gl.RENDERER) || 'Unknown',
        webglVersion,
      };
    }

    // GPU名取得（マスクされていない実際のGPU名）
    const renderer = gl.getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL
    );
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);

    return {
      rawName: renderer || 'Unknown',
      vendor: vendor || 'Unknown',
      renderer: renderer || 'Unknown',
      webglVersion,
    };
  } catch (error) {
    console.error('GPU detection failed:', error);
    return null;
  }
}

/**
 * WebGLから取得した生のGPU名を正規化
 * 例: "ANGLE (NVIDIA GeForce RTX 4070 Direct3D11)" → "NVIDIA GeForce RTX 4070"
 */
export function normalizeGpuName(rawName: string): string {
  let normalized = rawName;

  // 1. ANGLEラッパー除去（Chromium系ブラウザ）
  normalized = normalized.replace(
    /^ANGLE\s*\((.+?)\s*(Direct3D|OpenGL|Vulkan).*/i,
    '$1'
  );

  // 2. SwiftShaderラッパー除去（ソフトウェアレンダリング）
  normalized = normalized.replace(
    /^Google SwiftShader/i,
    'SwiftShader'
  );

  // 3. 余分な情報除去
  normalized = normalized
    .replace(/\s+(vs_\d+_\d+|ps_\d+_\d+)/gi, '') // シェーダーバージョン
    .replace(/\s+\(\d+(\.\d+)?\s*GB\)/gi, '') // VRAM容量
    .replace(/\s+\d{4}MHz/gi, '') // クロック周波数
    .replace(/\s+PCIe/gi, '') // PCIe情報
    .trim();

  // 4. ベンダー名統一
  normalized = normalized
    .replace(/^NVIDIA Corporation/i, 'NVIDIA')
    .replace(/^Advanced Micro Devices,?\s*Inc\.?/i, 'AMD')
    .replace(/^Intel\(R\)\s*/i, 'Intel ')
    .replace(/^Apple\s*/i, 'Apple ');

  // 5. GeForce/Radeon表記統一
  normalized = normalized
    .replace(/GeForce\s+GTX/gi, 'GeForce GTX')
    .replace(/GeForce\s+RTX/gi, 'GeForce RTX')
    .replace(/Radeon\s+RX/gi, 'Radeon RX');

  // 6. 複数スペースを単一スペースに統一
  normalized = normalized
    .replace(/\s+/g, ' ')
    .trim();

  // 7. Ti/Super/Ultimateのスペース統一（前後のスペースを確保）
  normalized = normalized
    .replace(/\s+(Ti|Super|Ultra|Ultimate|OC|XT|XTX|XTXE|Pro|Max)\b/gi, ' $1');

  return normalized;
}

/**
 * GPU名からベンダーを推測
 */
export function detectVendor(gpuName: string): GpuVendor {
  const name = gpuName.toLowerCase();

  if (
    name.includes('nvidia') ||
    name.includes('geforce') ||
    name.includes('gtx') ||
    name.includes('rtx')
  ) {
    return 'nvidia';
  }
  if (
    name.includes('amd') ||
    name.includes('radeon') ||
    name.includes('rx ')
  ) {
    return 'amd';
  }
  if (
    name.includes('intel') ||
    name.includes('arc') ||
    name.includes('iris') ||
    name.includes('uhd')
  ) {
    return 'intel';
  }
  if (
    name.includes('apple') ||
    name.includes('m1') ||
    name.includes('m2') ||
    name.includes('m3') ||
    name.includes('m4')
  ) {
    return 'apple';
  }

  return 'unknown';
}

/**
 * GPU名からマッピング情報を検索
 * 1. 完全一致 → 2. 部分一致（モデル番号優先） → 3. あいまい検索 → 4. ベンダー判定のみ
 */
export function findGpuMapping(
  normalizedName: string
): { mapping: GpuMapping; confidence: number } {
  console.log('🔍 GPU Mapping Search:', normalizedName);

  // 1. 完全一致検索
  const exactMatch = findGpuByName(normalizedName);
  if (exactMatch) {
    console.log('  ✅ Exact match found');
    return {
      mapping: exactMatch,
      confidence: 1.0,
    };
  }

  // 2. モデル番号による部分一致検索（例: "3060 Ti" で検索）
  const allMappings = getAllGpuMappings();

  // モデル番号を抽出（例: "RTX 3060 Ti" から "3060 Ti"）
  const modelMatch = normalizedName.match(/\b(\d{4})\s*(Ti|Super|XT|XTX)?\b/i);
  if (modelMatch) {
    const modelNumber = modelMatch[1]; // "3060"
    const suffix = modelMatch[2] || ''; // "Ti" または ""

    console.log(`  🔎 Searching by model: ${modelNumber} ${suffix}`);

    // モデル番号とサフィックスでフィルタリング
    const modelMatches = allMappings.filter((gpu) => {
      const gpuModel = gpu.gpuName.match(/\b(\d{4})\s*(Ti|Super|XT|XTX)?\b/i);
      if (!gpuModel) return false;

      const gpuNumber = gpuModel[1];
      const gpuSuffix = gpuModel[2] || '';

      return gpuNumber === modelNumber &&
             gpuSuffix.toLowerCase() === suffix.toLowerCase();
    });

    if (modelMatches.length > 0) {
      // ベンダー名でさらに絞り込み
      const vendor = detectVendor(normalizedName);
      const vendorMatch = modelMatches.find((gpu) => gpu.vendor === vendor);

      if (vendorMatch) {
        console.log(`  ✅ Model match found: ${vendorMatch.gpuName}`);
        return {
          mapping: vendorMatch,
          confidence: 0.85,
        };
      }

      // ベンダー一致がなくても最初のマッチを返す
      console.log(`  ⚠️ Model match (no vendor): ${modelMatches[0].gpuName}`);
      return {
        mapping: modelMatches[0],
        confidence: 0.75,
      };
    }
  }

  // 3. あいまい検索（Fuse.js使用）
  const fuse = new Fuse(allMappings, {
    keys: ['gpuName'],
    threshold: 0.4, // 厳密化: 60%以上の類似度を要求（Phase 6.3.1）
    includeScore: true,
    minMatchCharLength: 4,
  });

  const fuzzyResults = fuse.search(normalizedName);

  if (fuzzyResults.length > 0) {
    const bestMatch = fuzzyResults[0];
    console.log(`  🔎 Fuzzy match: ${bestMatch.item.gpuName} (score: ${bestMatch.score})`);

    // スコア閾値を厳密化: 0.3未満（= 70%以上の類似度）を要求（Phase 6.3.1）
    if (bestMatch.score! < 0.3) {
      return {
        mapping: bestMatch.item,
        confidence: Math.max(0.7, 1 - bestMatch.score! * 1.5), // 最低信頼度 0.7（Phase 6.3.1）
      };
    }
  }

  // 4. ベンダー判定のみ（フォールバック）
  const vendor = detectVendor(normalizedName);
  const fallbackMapping = getFallbackGpuByVendor(vendor);

  console.log(`  ⚠️ Fallback to vendor: ${vendor}`);

  return {
    mapping: fallbackMapping,
    confidence: 0.5,
  };
}

/**
 * GPU検知メイン関数
 * WebGL検知 → 正規化 → マッピング検索
 */
export function detectGpu(): GpuDetectionResult | null {
  // 1. WebGL GPU情報取得
  const gpuInfo = detectGpuWebGL();
  if (!gpuInfo) {
    return null;
  }

  // 2. GPU名正規化
  const normalized = normalizeGpuName(gpuInfo.rawName);

  // 3. DBマッピング検索
  const { mapping, confidence } = findGpuMapping(normalized);

  return {
    rawName: gpuInfo.rawName,
    normalized,
    mapping,
    confidence,
  };
}

/**
 * GPU検知失敗時の安全なデフォルト設定
 */
export function getSafeDefaultGpu(): GpuDetectionResult {
  return {
    rawName: 'Unknown GPU',
    normalized: 'Unknown GPU',
    mapping: getFallbackGpuByVendor('unknown'),
    confidence: 0.0,
  };
}
