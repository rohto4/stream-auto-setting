/**
 * GPU検知コンポーネント
 * WebGLでGPU情報を取得・表示（手動変更可能）
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { detectGpuWebGL, normalizeGpuName } from '@/lib/gpu-detector-client';
import { GpuSelectorModal } from './gpu-selector-modal';
import type { GpuDetectionResult, GpuMapping } from '@/lib/types';

interface GpuDetectorProps {
  onComplete: (result: GpuDetectionResult) => void;
}

export function GpuDetector({ onComplete }: GpuDetectorProps) {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GpuDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    detectGpuAsync();
  }, []);

  async function detectGpuAsync() {
    try {
      // タイムアウト設定（15秒）
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('GPU detection timeout')), 15000)
      );

      const detectionPromise = (async () => {
        // プログレス開始
        setProgress(10);

        // WebGL GPU検知
        const gpuInfo = detectGpuWebGL();

        if (!gpuInfo) {
          throw new Error('GPU detection failed');
        }

        // デバッグ: Raw GPU情報をコンソールに出力（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 GPU Detection Debug:');
          console.log('  Raw Name:', gpuInfo.rawName);
          console.log('  Vendor:', gpuInfo.vendor);
          console.log('  Renderer:', gpuInfo.renderer);
        }

        setProgress(30);

        // GPU名正規化
        const normalized = normalizeGpuName(gpuInfo.rawName);

        // デバッグ: 正規化後の名前を出力（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.log('  Normalized:', normalized);
        }

        setProgress(50);

        // サーバー側でマッピング検索（タイムアウト5秒）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('/api/gpu/map', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ normalizedName: normalized }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('GPU mapping failed');
        }

        const data = await response.json();

        // デバッグ: マッピング結果を出力（開発環境のみ）
        if (process.env.NODE_ENV === 'development') {
          console.log('  Mapped To:', data.mapping.gpuName);
          console.log('  Confidence:', data.confidence);
        }

        setProgress(100);

        return {
          rawName: gpuInfo.rawName,
          normalized,
          mapping: data.mapping,
          confidence: data.confidence,
        } as GpuDetectionResult;
      })();

      // タイムアウトと並列実行
      const gpuResult = await Promise.race([detectionPromise, timeoutPromise]);
      setResult(gpuResult as GpuDetectionResult);
    } catch (err) {
      console.error('GPU detection error:', err);

      // フォールバック設定
      const fallback: GpuDetectionResult = {
        rawName: 'Unknown GPU',
        normalized: 'Unknown GPU',
        mapping: {
          gpuName: 'Unknown GPU',
          vendor: 'unknown',
          encoder: 'obs_x264',
          preset: 'veryfast',
          maxBitrate: 5000,
          supportsHevc: false,
          supportsAv1: false,
          tier: 3,
        },
        confidence: 0.0,
      };

      setResult(fallback);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const displayError =
        errorMessage === 'GPU detection timeout'
          ? 'GPU検知がタイムアウトしました。汎用設定を使用します。'
          : 'GPU検知に失敗しました。汎用設定を使用します。';
      setError(displayError);
    }
  }

  function handleManualSelect(gpu: GpuMapping) {
    if (!result) return;

    const updatedResult: GpuDetectionResult = {
      ...result,
      mapping: gpu,
      confidence: 1.0, // 手動選択なので信頼度100%
    };

    setResult(updatedResult);
    setError(null);
  }

  function handleNext() {
    if (result) {
      onComplete(result);
    }
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🖥️ GPU検知中...</CardTitle>
          <CardDescription className="text-base">
            あなたのグラフィックカードを確認しています
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress
            value={progress}
            aria-label={`GPU検知進捗: ${progress}%`}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <p className="text-base text-muted-foreground text-center leading-relaxed">
            💡 Tip: OBSはシーンコレクションで複数の配信スタイルを管理できます
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {error ? '⚠️ GPU検知完了（フォールバック）' : '✅ GPU検知完了'}
          </CardTitle>
          <CardDescription className="text-base">
            検知結果を確認して次に進んでください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* 警告ボックス：検知失敗または信頼度が低い場合 */}
          {(error || result.confidence < 0.8) && (
            <div
              className={`p-4 rounded-lg border-2 space-y-2 ${
                error
                  ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700'
                  : 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
              }`}
              role="alert"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{error ? '⚠️' : 'ℹ️'}</span>
                <div className="flex-1">
                  <p className={`font-bold text-base ${
                    error
                      ? 'text-yellow-900 dark:text-yellow-100'
                      : 'text-blue-900 dark:text-blue-100'
                  }`}>
                    {error
                      ? 'GPU検知に失敗しました'
                      : '⚠️ GPU検知の信頼度が低めです'}
                  </p>
                  <p className={`text-base mt-2 leading-relaxed ${
                    error
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {error
                      ? 'ブラウザが正確なGPU情報を提供できませんでした。下から手動でGPUを選択してください。'
                      : `検知の信頼度が${(result.confidence * 100).toFixed(0)}%です。正しくない場合は手動で選択してください。`}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-lg font-bold">検出されたGPU</span>
              <span className="text-xl font-bold text-primary">
                {result.mapping.gpuName}
              </span>
            </div>

            {/* デバッグ情報表示 */}
            <details
              className="text-sm text-muted-foreground"
              aria-label="GPU検出の詳細情報"
            >
              <summary className="cursor-pointer hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-1">
                🔍 検出詳細（デバッグ）
              </summary>
              <div className="mt-2 p-3 bg-muted rounded space-y-1 font-mono text-xs">
                <div><strong>WebGL Raw:</strong> {result.rawName}</div>
                <div><strong>正規化後:</strong> {result.normalized}</div>
                <div><strong>マッチング:</strong> {result.mapping.gpuName}</div>
              </div>
            </details>

            <div className="flex flex-col gap-2">
              <span className="text-base font-bold">エンコーダ</span>
              <span className="text-lg">
                {result.mapping.encoder}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold">信頼度</span>
              <span className="text-lg">
                {(result.confidence * 100).toFixed(0)}%
              </span>
            </div>

            {/* 結果の下に手動変更リンク */}
            <div className="text-center pt-4 border-t">
              <button
                onClick={() => setShowModal(true)}
                className="text-base text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors underline decoration-dotted"
                aria-label="別のGPUを手動で選択します"
                aria-expanded={false}
              >
                その他のGPUを選択
              </button>
            </div>
          </div>

          {/* 次へボタン */}
          <Button
            onClick={handleNext}
            className="w-full text-2xl py-8"
            size="lg"
          >
            次へ
          </Button>
        </CardContent>
      </Card>

      {/* GPU選択モーダル */}
      <GpuSelectorModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelect={handleManualSelect}
      />
    </>
  );
}
