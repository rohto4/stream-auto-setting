'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GenreCard } from '../mobile/genre-card';
import { GpuDetector } from './gpu-detector';
import { SpeedTester } from './speed-tester';
import { ConfigConfirm } from './config-confirm';
import { toast } from 'sonner';
import type { GpuDetectionResult, SpeedTestResult, GenreId, ObsConfig, GuideSuggestion, GuideItem } from '@/lib/types';
import { findGenreById } from '@/lib/db/queries';
import {
  trackGenreSelect,
  trackConfigGenerationStart,
  trackGuideViewed,
} from '@/lib/analytics';

// 動的インポート: 初期ロードから除外してパフォーマンス向上
const AdvancedSettingsPage = dynamic(() => import('./advanced-settings-page').then(mod => mod.AdvancedSettingsPage), {
  loading: () => <div className="flex items-center justify-center p-8">読み込み中...</div>,
  ssr: false,
});

const GuideRequired = dynamic(() => import('../post-download/guide-required').then(mod => mod.GuideRequired), {
  loading: () => <div className="flex items-center justify-center p-8">読み込み中...</div>,
});

const GuidePerformance = dynamic(() => import('../post-download/guide-performance').then(mod => mod.GuidePerformance), {
  loading: () => <div className="flex items-center justify-center p-8">読み込み中...</div>,
});

const GuideOptional = dynamic(() => import('../post-download/guide-optional').then(mod => mod.GuideOptional), {
  loading: () => <div className="flex items-center justify-center p-8">読み込み中...</div>,
});

const GuideComplete = dynamic(() => import('../post-download/guide-complete').then(mod => mod.GuideComplete), {
  loading: () => <div className="flex items-center justify-center p-8">読み込み中...</div>,
});

type Step = 'genre' | 'detect-gpu' | 'detect-speed' | 'confirm' | 'advanced-settings' | 'generate' | 'complete' | 'guide-required' | 'guide-performance' | 'guide-optional';

export function DesktopView() {
  const [step, setStep] = useState<Step>('genre');
  const [genre, setGenre] = useState<GenreId | null>(null);
  const [gpuResult, setGpuResult] = useState<GpuDetectionResult | null>(null);
  const [speedResult, setSpeedResult] = useState<SpeedTestResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [guideItems, setGuideItems] = useState<GuideItem[] | null>(null);

  // generateステップに入ったら自動的に生成を開始
  useEffect(() => {
    if (step === 'generate' && !generating && gpuResult && speedResult && genre) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const resetAllState = () => {
    setStep('genre');
    setGenre(null);
    setGpuResult(null);
    setSpeedResult(null);
    setGenerating(false);
    setGuideItems(null);
    toast.info('最初から入力し直します');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-beginner-green/5 via-background to-beginner-yellow/5 p-8">
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex justify-end mb-2">
            <Button variant="ghost" size="sm" asChild>
              <a href="/faq" className="text-sm">
                FAQ・ヘルプ
              </a>
            </Button>
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-beginner-gradient">
            オートOBS設定
          </h1>
          <p className="text-xl text-muted-foreground">
            YouTube Live特化型OBS設定自動生成
          </p>
        </div>

        {/* ステップ表示 */}
        {step === 'genre' && (
          <Card role="region" aria-label="配信ジャンル選択">
            <CardHeader>
              <CardTitle className="text-2xl">🎮 配信する内容を選択してください</CardTitle>
              <CardDescription className="text-base">
                あなたが配信するゲームやコンテンツ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4" role="group" aria-label="ジャンル選択肢">
              <GenreCard title="激しいゲーム" subtitle="60FPS高画質" examples="Apex Legends, VALORANT, Overwatch 2" genreId="fps-high" onSelect={handleGenreSelect} />
              <GenreCard title="アクションゲーム" subtitle="動きと画質のバランス" examples="原神, ストリートファイター6, FF14" genreId="rpg-mid" onSelect={handleGenreSelect} />
              <GenreCard title="ゆっくりゲーム" subtitle="超高画質" examples="雀魂, ぷよぷよ, Among Us" genreId="puzzle-low" onSelect={handleGenreSelect} />
              <GenreCard
                title="雑談・歌配信"
                subtitle="音質重視"
                examples="雑談, 歌枠, お絵描き, ASMR"
                genreId="chat"
                onSelect={handleGenreSelect}
              />
              <GenreCard title="レトロゲーム" subtitle="クラシックゲーム" examples="マリオ, ポケモン, ドラクエ" genreId="retro" onSelect={handleGenreSelect} />
            </CardContent>
          </Card>
        )}

        {step === 'detect-gpu' && <GpuDetector onComplete={(result) => { setGpuResult(result); setStep('detect-speed'); }} />}
        {step === 'detect-speed' && <SpeedTester onComplete={(result) => { setSpeedResult(result); setStep('confirm'); }} />}
        {step === 'confirm' && gpuResult && speedResult && genre && <ConfigConfirm genre={genre} gpuResult={gpuResult} speedResult={speedResult} onConfirm={() => setStep('generate')} onAdvanced={() => setStep('advanced-settings')} onReset={resetAllState} />}
        {step === 'advanced-settings' && gpuResult && speedResult && genre && <AdvancedSettingsPage genre={genre} gpuResult={gpuResult} speedResult={speedResult} onGenerate={handleGenerateFromAdvanced} onReset={() => setStep('confirm')} />}
        {step === 'generate' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">⚙️ 設定を生成しています...</CardTitle>
              <CardDescription className="text-base">最適なOBS設定を計算中</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={undefined} className="w-full" />
              <p className="text-base text-muted-foreground text-center leading-relaxed">💡 Tip: 生成された設定ファイルはOBSの設定フォルダにインポートしてください</p>
            </CardContent>
          </Card>
        )}
        {step === 'complete' && <GuideComplete onStartGuide={() => setStep('guide-required')} onReset={resetAllState} />}
        {step === 'guide-required' && <GuideRequired onComplete={() => setStep('guide-performance')} />}
        {step === 'guide-performance' && <GuidePerformance onComplete={() => setStep('guide-optional')} />}
        {step === 'guide-optional' && <GuideOptional onComplete={() => { toast.success('設定ガイドが完了しました！'); resetAllState(); }} />}
      </div>
    </main>
  );

  function handleGenreSelect(selectedGenre: GenreId) {
    setGenre(selectedGenre);
    setStep('detect-gpu');
    toast.success('ジャンルを選択しました');

    // Analytics
    trackGenreSelect(selectedGenre);
  }

  async function handleGenerate() {
    if (!gpuResult || !speedResult || !genre || generating) return;
    setGenerating(true);
    setStep('generate');

    // Analytics
    trackConfigGenerationStart();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, gpuDetection: gpuResult, speedTest: speedResult, guideUpdates: [] }),
      });
      if (!response.ok) throw new Error('Config generation failed');
      
      await processApiResponse(response);
      
      setStep('complete');
      toast.success('設定ファイルをダウンロードしました');
    } catch (error) {
      console.error('Config generation failed:', error);
      toast.error('設定生成に失敗しました');
      setStep('confirm');
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateFromAdvanced(customConfig: ObsConfig, guideUpdates: GuideSuggestion[]) {
    if (!gpuResult || !speedResult || !genre || generating) return;
    setGenerating(true);
    setStep('generate');

    // Analytics
    trackConfigGenerationStart();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ genre, gpuDetection: gpuResult, speedTest: speedResult, overrides: customConfig, guideUpdates: guideUpdates }),
      });
      if (!response.ok) throw new Error('Config generation failed');

      await processApiResponse(response);

      setStep('complete');
      toast.success('カスタム設定ファイルをダウンロードしました');
    } catch (error) {
      console.error('Config generation failed:', error);
      toast.error('設定生成に失敗しました');
      setStep('advanced-settings');
    } finally {
      setGenerating(false);
    }
  }

  async function processApiResponse(response: Response) {
    // 1. ガイドデータをヘッダーから取得
    const guideDataHeader = response.headers.get('X-Guide-Data');
    if (guideDataHeader) {
      try {
        const decoded = atob(guideDataHeader);
        const items = JSON.parse(decoded);
        setGuideItems(items);
      } catch (e) {
        console.error("Failed to parse guide data:", e);
        // フォールバックとして静的ガイドを利用するなどの処理も可能
        setGuideItems(null); 
      }
    }

    // 2. ZIPファイルをダウンロード
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obs-config-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
