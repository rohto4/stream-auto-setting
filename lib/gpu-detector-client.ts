/**
 * GPU検知ロジック（クライアント専用）
 * WebGLからGPU情報を取得・正規化
 */

'use client';

import type { GpuInfo, GpuVendor } from './types';

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
 */
export function normalizeGpuName(rawName: string): string {
  let normalized = rawName;

  // 1. ANGLEラッパー除去
  normalized = normalized.replace(
    /^ANGLE\s*\((.+?)\s*(Direct3D|OpenGL|Vulkan).*/i,
    '$1'
  );

  // 2. SwiftShaderラッパー除去
  normalized = normalized.replace(
    /^Google SwiftShader/i,
    'SwiftShader'
  );

  // 3. 余分な情報除去
  normalized = normalized
    .replace(/\s+(vs_\d+_\d+|ps_\d+_\d+)/gi, '')
    .replace(/\s+\(\d+(\.\d+)?\s*GB\)/gi, '')
    .replace(/\s+\d{4}MHz/gi, '')
    .replace(/\s+PCIe/gi, '')
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
