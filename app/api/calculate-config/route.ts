/**
 * POST /api/calculate-config
 * GPU/回線情報からOBS基本設定を計算（詳細設定フェーズ用）
 */

import { NextResponse } from 'next/server';
import { generateConfigRequestSchema } from '@/lib/schemas';
import { findGenreById } from '@/lib/db/queries';
import { calculateObsConfig } from '@/lib/obs-config-calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = generateConfigRequestSchema.parse(body);

    // ジャンル設定取得
    const genre = findGenreById(validatedData.genre);

    if (!genre) {
      return NextResponse.json(
        { error: 'Genre configuration not found' },
        { status: 500 }
      );
    }

    // OBS設定計算
    const config = calculateObsConfig({
      genre,
      gpu: validatedData.gpuDetection.mapping,
      speed: validatedData.speedTest,
    });

    return NextResponse.json({ config }, { status: 200 });
  } catch (error: any) {
    console.error('Config calculation error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
