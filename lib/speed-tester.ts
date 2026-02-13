/**
 * 回線速度測定機能
 * Cloudflare APIを使用したアップロード/ダウンロード速度測定
 */

import type { SpeedTestResult, SpeedAssessment, SpeedTier } from './types';

/**
 * Cloudflare CDNを使った回線速度測定（複数回測定して収束）
 * @param onProgress 進捗コールバック（0-100）
 */
export async function measureSpeed(
  onProgress?: (progress: number) => void
): Promise<SpeedTestResult> {
  try {
    // 1. Latency測定（10%）
    onProgress?.(0);
    const latencyResults = await measureLatency();
    onProgress?.(10);

    // 2. Download速度測定（30%）- 3回測定
    const downloadSamples: number[] = [];
    for (let i = 0; i < 3; i++) {
      const downloadMbps = await measureDownload((p) => {
        onProgress?.(10 + (i * 10) + p * 10);
      });
      downloadSamples.push(downloadMbps);
      await sleep(500); // 500ms待機
    }
    onProgress?.(40);

    // 3. Upload速度測定（60%）- 3回測定
    const uploadSamples: number[] = [];
    for (let i = 0; i < 3; i++) {
      const uploadMbps = await measureUpload((p) => {
        onProgress?.(40 + (i * 20) + p * 20);
      });
      uploadSamples.push(uploadMbps);
      await sleep(500); // 500ms待機
    }
    onProgress?.(100);

    // 中央値を計算（外れ値を除外）
    const downloadMedian = calculateMedian(downloadSamples);
    const uploadMedian = calculateMedian(uploadSamples);

    console.log('📊 Speed Test Results:');
    console.log('  Upload samples:', uploadSamples.map(v => v.toFixed(1)), '→ Median:', uploadMedian.toFixed(1), 'Mbps');
    console.log('  Download samples:', downloadSamples.map(v => v.toFixed(1)), '→ Median:', downloadMedian.toFixed(1), 'Mbps');

    return {
      uploadMbps: uploadMedian,
      downloadMbps: downloadMedian,
      latencyMs: latencyResults.average,
      jitterMs: latencyResults.jitter,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Speed test failed:', error);

    // フォールバック: 保守的な値を返す
    return {
      uploadMbps: 10.0, // 10Mbps想定
      downloadMbps: 50.0,
      latencyMs: 50,
      jitterMs: 10,
      timestamp: new Date(),
    };
  }
}

/**
 * 中央値を計算（外れ値に強い）
 */
function calculateMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  } else {
    return sorted[mid];
  }
}

/**
 * Latency & Jitter測定（5回pingの平均）
 */
async function measureLatency(): Promise<{
  average: number;
  jitter: number;
}> {
  const pings: number[] = [];
  const endpoint = 'https://cloudflare.com/cdn-cgi/trace';

  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    await fetch(endpoint, { method: 'HEAD', cache: 'no-store' });
    const end = performance.now();
    pings.push(end - start);

    // 100ms間隔を空ける
    await sleep(100);
  }

  const average = pings.reduce((a, b) => a + b, 0) / pings.length;

  // Jitter = 標準偏差
  const variance =
    pings.reduce((sum, ping) => sum + Math.pow(ping - average, 2), 0) /
    pings.length;
  const jitter = Math.sqrt(variance);

  return { average, jitter };
}

/**
 * Download速度測定（API Route経由でCORS回避）
 */
async function measureDownload(
  onProgress?: (progress: number) => void
): Promise<number> {
  onProgress?.(0);

  const response = await fetch('/api/speed-test/download');

  if (!response.ok) {
    throw new Error('Download test failed');
  }

  const data = await response.json();
  onProgress?.(1);

  return data.downloadMbps;
}

/**
 * Upload速度測定（API Route経由でCORS回避）
 */
async function measureUpload(
  onProgress?: (progress: number) => void
): Promise<number> {
  onProgress?.(0);

  const response = await fetch('/api/speed-test/measure', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Upload test failed');
  }

  const data = await response.json();
  onProgress?.(1);

  return data.uploadMbps;
}

/**
 * 回線速度から配信品質を評価
 */
export function assessSpeed(uploadMbps: number): SpeedAssessment {
  if (uploadMbps >= 15) {
    return {
      tier: 'excellent',
      uploadMbps,
      recommendedMaxBitrate: 9000,
      message: '配信に十分な速度です（最高画質対応）',
    };
  }

  if (uploadMbps >= 10) {
    return {
      tier: 'good',
      uploadMbps,
      recommendedMaxBitrate: 7000,
      message: '配信に十分な速度です',
    };
  }

  if (uploadMbps >= 6) {
    return {
      tier: 'fair',
      uploadMbps,
      recommendedMaxBitrate: 5000,
      message: '配信可能ですが、やや速度が不足しています',
      warning:
        '配信中に他のデバイスでインターネットを使用すると画質が低下する可能性があります',
    };
  }

  return {
    tier: 'poor',
    uploadMbps,
    recommendedMaxBitrate: 3000,
    message: '配信には速度が不足しています',
    warning:
      '画質を大幅に下げる必要があります。可能であれば有線接続に切り替えてください。',
  };
}

/**
 * 回線測定失敗時の保守的な設定
 */
export function getConservativeSpeedConfig(): SpeedTestResult {
  return {
    uploadMbps: 10.0, // 10Mbps想定
    downloadMbps: 50.0,
    latencyMs: 50,
    jitterMs: 10,
    timestamp: new Date(),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
