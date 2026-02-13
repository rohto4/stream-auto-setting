/**
 * POST /api/generate
 * GPU/回線情報からOBS設定ファイル生成
 */

import { NextResponse } from 'next/server';
import { generateConfigRequestSchema } from '@/lib/schemas';
import { generateConfigZip } from '@/lib/obs-file-generator';
import { generateDynamicGuide } from '@/lib/post-download-guide';
import { assessSpeed } from '@/lib/speed-tester';
import { calculateObsConfig } from '@/lib/obs-config-calculator';
import { findGenreById } from '@/lib/db/queries';
import type { ObsConfig } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. バリデーション
    const validatedData = generateConfigRequestSchema.parse(body);

    // 2. 設定オブジェクトの確定
    let finalConfig: ObsConfig;

    if (validatedData.overrides && Object.keys(validatedData.overrides).length > 0) {
      // 詳細設定からの上書きがある場合
      // Note: `overrides`はpartialなので、ベース設定とマージする必要がある
      const genreConfig = findGenreById(validatedData.genre);
      if (!genreConfig) {
        return NextResponse.json({ error: `Genre config not found for id: ${validatedData.genre}` }, { status: 400 });
      }
      const baseConfig = calculateObsConfig({
        genre: genreConfig,
        gpu: validatedData.gpuDetection.mapping,
        speed: validatedData.speedTest,
      });
      finalConfig = { ...baseConfig, ...validatedData.overrides };

    } else {
      // 通常フロー：ジャンル・GPU・回線速度から計算
      const genreConfig = findGenreById(validatedData.genre);
      if (!genreConfig) {
        return NextResponse.json(
          { error: `Genre config not found for id: ${validatedData.genre}` },
          { status: 400 }
        );
      }
      finalConfig = calculateObsConfig({
        genre: genreConfig,
        gpu: validatedData.gpuDetection.mapping,
        speed: validatedData.speedTest,
      });
    }

    if (!finalConfig) {
      return NextResponse.json({ error: 'Could not determine final config' }, { status: 500 });
    }

    // 3. 動的ガイド生成
    const guideItems = generateDynamicGuide(validatedData.guideUpdates || []);

    // 4. ZIPファイル生成
    const zipBlob = await generateConfigZip(finalConfig);
    const buffer = await zipBlob.arrayBuffer();
    
    // 5. その他のメタデータ生成
    const speedAssessment = assessSpeed(
      validatedData.speedTest.uploadMbps
    );
    const warnings: string[] = [];
    if (speedAssessment.warning) {
      warnings.push(speedAssessment.warning);
    }
    if (validatedData.gpuDetection.confidence < 0.8) {
      warnings.push(
        'GPU検知の信頼度が低いため、汎用設定を使用しています。'
      );
    }

    // 6. レスポンスヘッダー設定
    const timestamp = Date.now();
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set(
      'Content-Disposition',
      `attachment; filename="obs-config-${timestamp}.zip"`
    );
    // Base64エンコードして日本語を含むJSONをヘッダーに含める
    headers.set('X-Guide-Data', Buffer.from(JSON.stringify(guideItems), 'utf-8').toString('base64'));
    headers.set('X-Config-Warnings', Buffer.from(JSON.stringify(warnings), 'utf-8').toString('base64'));
    headers.set('X-Speed-Assessment', Buffer.from(JSON.stringify(speedAssessment), 'utf-8').toString('base64'));
    headers.set('X-Gpu-Confidence', validatedData.gpuDetection.confidence.toString());

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Config generation error:', error);

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
