/**
 * GET /api/speed-test/download
 * ダウンロード速度測定（CORS回避のためサーバー経由）
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const testUrl = 'https://speed.cloudflare.com/__down?bytes=10000000'; // 10MB

    const startTime = Date.now();

    const response = await fetch(testUrl);

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`);
    }

    // データを完全に読み取る
    const data = await response.arrayBuffer();

    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const megabits = (data.byteLength * 8) / (1024 * 1024);
    const downloadMbps = megabits / durationSeconds;

    return NextResponse.json({
      downloadMbps,
      durationMs: endTime - startTime,
      bytes: data.byteLength,
    });
  } catch (error: any) {
    console.error('Download test error:', error);
    return NextResponse.json(
      { error: 'Download test failed', message: error.message },
      { status: 500 }
    );
  }
}
