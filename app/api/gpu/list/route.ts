/**
 * GET /api/gpu/list
 * 全GPU一覧を取得（手動選択用）
 */

import { NextResponse } from 'next/server';
import { getAllGpuMappings } from '@/lib/db/queries';

// 1時間キャッシュ（GPUデータは頻繁に変更されない）
export const revalidate = 3600;

export async function GET() {
  try {
    const gpus = getAllGpuMappings();

    return NextResponse.json({
      gpus,
      count: gpus.length,
    });
  } catch (error: any) {
    console.error('GPU list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GPU list' },
      { status: 500 }
    );
  }
}
