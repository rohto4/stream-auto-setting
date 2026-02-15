/**
 * 設定確認コンポーネント
 * 生成前に設定内容を確認（将来の詳細設定への分岐点）
 */

'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GpuDetectionResult, SpeedTestResult, GenreId } from '@/lib/types';
import { trackConfigConfirmReached, trackAdvancedSettingsStart } from '@/lib/analytics';

interface ConfigConfirmProps {
  genre: GenreId;
  gpuResult: GpuDetectionResult;
  speedResult: SpeedTestResult;
  onConfirm: () => void;
  onAdvanced?: () => void; // 将来の詳細設定用
  onReset?: () => void; // 最初からやり直す
}

const GENRE_LABELS: Record<GenreId, string> = {
  'fps-high': '激しいゲーム',
  'rpg-mid': 'アクションゲーム',
  'puzzle-low': 'ゆっくりゲーム',
  'chat': '雑談・歌配信',
  'retro': 'レトロゲーム',
};

export function ConfigConfirm({
  genre,
  gpuResult,
  speedResult,
  onConfirm,
  onAdvanced,
  onReset,
}: ConfigConfirmProps) {
  // Analytics: 設定確認画面到達
  useEffect(() => {
    trackConfigConfirmReached(
      genre,
      gpuResult.mapping.gpuName,
      speedResult.uploadMbps
    );
  }, [genre, gpuResult.mapping.gpuName, speedResult.uploadMbps]);

  // 推奨設定の計算（簡易版）
  const recommendedFps = ['fps-high', 'rpg-mid', 'retro'].includes(genre) ? 60 : 30;
  const recommendedResolution = speedResult.uploadMbps >= 10 ? '1080p' : '720p';
  const recommendedBitrate = Math.min(
    Math.floor(speedResult.uploadMbps * 0.8 * 1000),
    gpuResult.mapping.maxBitrate
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">✅ 設定内容の確認</CardTitle>
        <CardDescription className="text-base">
          この内容でOBS設定ファイルを生成します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 選択内容サマリー */}
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-bold mb-4">📋 選択した内容</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">配信ジャンル</span>
                <span className="text-xl font-bold">{GENRE_LABELS[genre]}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">GPU</span>
                <span className="text-xl font-bold">{gpuResult.mapping.gpuName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">回線速度</span>
                <span className="text-xl font-bold">
                  {speedResult.uploadMbps.toFixed(1)} Mbps
                </span>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-lg font-bold mb-4">⚙️ 推奨設定</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">解像度</span>
                <span className="text-xl font-bold">{recommendedResolution}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">フレームレート</span>
                <span className="text-xl font-bold">{recommendedFps} FPS</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">ビットレート</span>
                <span className="text-xl font-bold">
                  {(recommendedBitrate / 1000).toFixed(1)} Mbps
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-base text-muted-foreground font-medium">エンコーダ</span>
                <span className="text-xl font-bold">{gpuResult.mapping.encoder}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-base text-blue-900 dark:text-blue-100 leading-relaxed">
              💡 これらの設定は、あなたの環境に最適化された値です。
              配信を開始する前に、OBSでテスト配信を行うことをおすすめします。
            </p>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-4">
          <Button
            onClick={onConfirm}
            className="w-full text-2xl py-8"
            size="lg"
          >
            この内容で生成
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                trackAdvancedSettingsStart();
                onAdvanced?.();
              }}
              variant="outline"
              className="text-base py-6"
              size="lg"
            >
              詳細設定をする
            </Button>

            <Button
              onClick={onReset}
              variant="outline"
              className="text-base py-6"
              size="lg"
            >
              最初からやり直す
            </Button>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-900 dark:text-yellow-100 text-center space-y-2">
            <span className="block">※ 生成される設定ファイルは、OBSの既存設定を上書きします</span>
            <span className="block">※ 事前にバックアップを取ることをおすすめします</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
