/**
 * 回線速度測定コンポーネント
 * Cloudflare APIで回線速度を測定（再測定可能）
 */

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusIcon } from '@/lib/icons/status-icons';
import { measureSpeed, assessSpeed } from '@/lib/speed-tester';
import type { SpeedTestResult } from '@/lib/types';
import {
  trackSpeedTestStart,
  trackSpeedTestComplete,
  trackSpeedTestFailed,
} from '@/lib/analytics';

interface SpeedTesterProps {
  onComplete: (result: SpeedTestResult) => void;
}

export function SpeedTester({ onComplete }: SpeedTesterProps) {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [failed, setFailed] = useState(false);
  const [measuring, setMeasuring] = useState(true);

  const tips = [
    '💡 配信開始前は必ずマイクテストを行いましょう',
    '💡 OBSのプレビュー画面はCPU負荷が高いので、配信中はオフ推奨',
    '💡 YouTube Studioで配信のアーカイブを確認できます',
  ];

  useEffect(() => {
    measureSpeedAsync();

    // Tipsローテーション
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(tipInterval);
  }, []);

  async function measureSpeedAsync() {
    setMeasuring(true);
    setFailed(false);
    setProgress(0);
    setResult(null);

    // Analytics: 速度測定開始
    const startTime = Date.now();
    trackSpeedTestStart();

    try {
      const speedResult = await measureSpeed((p) => {
        setProgress(p);
      });

      setResult(speedResult);
      setFailed(false);

      // Analytics: 速度測定完了
      const duration = (Date.now() - startTime) / 1000;
      const assessment = assessSpeed(speedResult.uploadMbps);
      trackSpeedTestComplete(speedResult.uploadMbps, assessment.tier, duration);
    } catch (err) {
      console.error('Speed test error:', err);
      setFailed(true);

      // Analytics: 速度測定失敗
      trackSpeedTestFailed(err instanceof Error ? err.message : 'unknown_error');
    } finally {
      setMeasuring(false);
    }
  }

  function handleRetry() {
    measureSpeedAsync();
  }

  function handleNext() {
    if (result) {
      onComplete(result);
    }
  }

  if (measuring) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📡 回線速度測定中...</CardTitle>
          <CardDescription className="text-base">
            アップロード速度を測定しています（約10秒）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={progress} />
          <p className="text-base text-muted-foreground text-center leading-relaxed">
            {tips[currentTip]}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (failed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <StatusIcon type="warning" size={24} className="text-yellow-600" />
            回線速度測定失敗
          </CardTitle>
          <CardDescription className="text-base">
            もう一度測定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-base text-yellow-900 dark:text-yellow-100 leading-relaxed">
              回線速度の測定に失敗しました。ネットワーク接続を確認して、もう一度測定してください。
            </p>
          </div>
          <Button
            onClick={handleRetry}
            className="w-full text-lg py-6"
            size="lg"
          >
            再測定
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const assessment = assessSpeed(result.uploadMbps);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <StatusIcon type="success" size={24} className="text-primary" />
          回線速度測定完了
        </CardTitle>
        <CardDescription className="text-base">
          測定結果を確認して次に進んでください
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold">アップロード速度</span>
            <span className="text-2xl font-bold text-primary">
              {result.uploadMbps.toFixed(1)} Mbps
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">ダウンロード速度</span>
            <span className="text-xl">
              {result.downloadMbps.toFixed(1)} Mbps
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-base font-medium">Ping</span>
            <span className="text-xl">
              {result.latencyMs.toFixed(0)} ms
            </span>
          </div>
        </div>
        <div
          className={`p-4 rounded-lg border ${
            assessment.tier === 'excellent'
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
              : assessment.tier === 'good'
              ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
              : assessment.tier === 'fair'
              ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800'
              : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
          }`}
        >
          <p className="text-base font-medium">{assessment.message}</p>
          {assessment.warning && (
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {assessment.warning}
            </p>
          )}
        </div>

        {/* 再測定ボタン（控えめ） */}
        <div className="text-center pt-4 border-t">
          <button
            onClick={handleRetry}
            className="text-base text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1 transition-colors underline decoration-dotted"
          >
            もう一度測定する
          </button>
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
  );
}
