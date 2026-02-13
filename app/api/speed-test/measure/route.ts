/**
 * POST /api/speed-test/measure
 * 回線速度測定（CORS回避のためサーバー経由）
 */

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const testSize = 5 * 1024 * 1024; // 5MB
    const testUrl = 'https://speed.cloudflare.com/__up';

    // ランダムデータ生成
    const data = new Uint8Array(testSize);

    // Node.js環境ではcrypto.getRandomValuesではなく、randomFillSyncを使用
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // ブラウザ環境（通常はここには来ない）
      const maxChunkSize = 65536;
      for (let offset = 0; offset < testSize; offset += maxChunkSize) {
        const chunkSize = Math.min(maxChunkSize, testSize - offset);
        const chunk = data.subarray(offset, offset + chunkSize);
        crypto.getRandomValues(chunk);
      }
    } else {
      // Node.js環境
      const nodeCrypto = await import('crypto');
      nodeCrypto.randomFillSync(data);
    }

    const startTime = Date.now();

    const response = await fetch(testUrl, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const megabits = (testSize * 8) / (1024 * 1024);
    const uploadMbps = megabits / durationSeconds;

    return NextResponse.json({
      uploadMbps,
      durationMs: endTime - startTime,
    });
  } catch (error: any) {
    console.error('Speed test error:', error);
    return NextResponse.json(
      { error: 'Speed test failed', message: error.message },
      { status: 500 }
    );
  }
}
