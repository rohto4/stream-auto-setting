/**
 * POST /api/gpu/map
 * 正規化されたGPU名からマッピング情報を取得
 */

import { NextResponse } from 'next/server';
import { findGpuMapping } from '@/lib/gpu-detector';

export async function POST(request: Request) {
  try {
    const { normalizedName } = await request.json();

    if (!normalizedName || typeof normalizedName !== 'string') {
      return NextResponse.json(
        { error: 'Invalid GPU name' },
        { status: 400 }
      );
    }

    // マッピング検索
    const { mapping, confidence } = findGpuMapping(normalizedName);

    return NextResponse.json({
      mapping,
      confidence,
    });
  } catch (error: any) {
    console.error('GPU mapping error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
