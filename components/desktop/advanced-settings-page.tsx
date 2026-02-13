/**
 * 詳細設定フェーズ - メインページコンポーネント
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuestionPanel } from './question-panel';
import { PreviewPanel } from './preview-panel';
import { EffectDescription } from './effect-description';
import type { AdvancedSettingsAnswers, ObsConfig, GpuDetectionResult, SpeedTestResult, GenreId, GuideSuggestion } from '@/lib/types';
import { calculateAdvancedSettings } from '@/lib/advanced-settings-calculator';

interface AdvancedSettingsPageProps {
  genre: GenreId;
  gpuResult: GpuDetectionResult;
  speedResult: SpeedTestResult;
  onGenerate: (config: ObsConfig, guideUpdates: GuideSuggestion[]) => void;
  onReset: () => void;
}

export function AdvancedSettingsPage({
  genre,
  gpuResult,
  speedResult,
  onGenerate,
  onReset,
}: AdvancedSettingsPageProps) {
  const [baseConfig, setBaseConfig] = useState<ObsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<AdvancedSettingsAnswers>({
    performancePriority: 'balanced',
    persona: 'voice_only',
    audioConcerns: [],
  });

  const [currentConfig, setCurrentConfig] = useState<ObsConfig | null>(null);
  const [guideUpdates, setGuideUpdates] = useState<GuideSuggestion[]>([]);

  // baseConfig を API から取得
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/calculate-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            genre,
            gpuDetection: gpuResult,
            speedTest: speedResult,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to calculate base config');
        }

        const data = await response.json();
        setBaseConfig(data.config);
        setError(null);
      } catch (err) {
        console.error('Failed to load base config:', err);
        setError('設定計算に失敗しました');
      } finally {
        setLoading(false);
      }
    })();
  }, [genre, gpuResult, speedResult]);

  // 回答が変更されたら設定を再計算
  useEffect(() => {
    if (!baseConfig) return;
    const { config: newConfig, guideUpdates: newGuideUpdates } = calculateAdvancedSettings(baseConfig, answers);
    setCurrentConfig(newConfig);
    setGuideUpdates(newGuideUpdates);
  }, [answers, baseConfig]);

  if (loading) {
    return (
      <Card className="w-full" role="status" aria-live="polite">
        <CardHeader>
          <CardTitle className="text-2xl">
            ⚙️ 配信スタイルをカスタマイズ
          </CardTitle>
          <CardDescription className="text-base">
            設定を読み込み中...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Progress value={undefined} aria-label="設定を読み込み中: 0～100%" />
          <p className="text-base text-muted-foreground text-center leading-relaxed">
            💡 詳細設定画面を準備中です。数秒お待ちください。
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error || !baseConfig || !currentConfig) {
    return (
      <Card className="w-full" role="alert">
        <CardHeader>
          <CardTitle className="text-2xl">
            ⚠️ エラーが発生しました
          </CardTitle>
          <CardDescription className="text-base mt-2">
            詳細設定画面を読み込むことができませんでした。別の方法で試してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-base text-red-900 dark:text-red-100 leading-relaxed">
              {error || '設定の読み込みに失敗しました'}
            </p>
            <p className="text-sm text-red-800 dark:text-red-200 mt-3">
              💡 対処法: 「前の画面に戻る」を選択して、自動設定で進めてください。
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={onReset}
              className="text-lg py-6"
              aria-label="詳細設定をスキップして前の画面に戻ります"
            >
              前の画面に戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          ⚙️ 配信スタイルをカスタマイズ
        </CardTitle>
        <CardDescription className="text-base">
          自動設定から微調整したい方向けの詳細設定です
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* メインレイアウト: 左側質問パネル、右側プレビューパネル */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 左側: 質問パネル */}
          <QuestionPanel
            answers={answers}
            onAnswerChange={setAnswers}
          />

          {/* 右側: プレビューパネル */}
          <PreviewPanel
            config={currentConfig}
            baseConfig={baseConfig}
          />
        </div>

        {/* 効果説明 */}
        <EffectDescription
          config={currentConfig}
          answers={answers}
        />

        {/* アクションボタン */}
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onReset}>
            元の自動設定に戻す
          </Button>
          <Button
            onClick={() => onGenerate(currentConfig, guideUpdates)}
            className="flex-1 text-lg py-6"
            size="lg"
          >
            この設定で生成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
