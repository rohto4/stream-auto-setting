/**
 * 詳細設定フェーズ - 効果説明コンポーネント
 * (Phase 6: 2026-02-12改訂)
 */

'use client';

import type { ObsConfig, AdvancedSettingsAnswers } from '@/lib/types';
import {
  PERFORMANCE_PRIORITY_OPTIONS,
  PERSONA_OPTIONS,
  AUDIO_CONCERN_OPTIONS,
} from '@/lib/advanced-settings-options';

interface EffectDescriptionProps {
  config: ObsConfig;
  answers: AdvancedSettingsAnswers;
}

export function EffectDescription({
  config,
  answers,
}: EffectDescriptionProps) {
  const effects: string[] = [];

  // Q1: パフォーマンス優先度に応じた説明
  const perfChoice = PERFORMANCE_PRIORITY_OPTIONS.find(
    (opt) => opt.id === answers.performancePriority
  )!;
  if (perfChoice.id === 'performance') {
    effects.push('✅ ゲームの快適さを優先し、PC負荷を抑えた設定になります');
  } else if (perfChoice.id === 'quality') {
    effects.push('✅ 視聴者のための高画質を優先した設定になります');
  } else {
    effects.push('✅ ゲームの快適さと配信画質のバランスが取れた設定です');
  }

  // Q2: 見せ方に応じた説明
  const personaChoice = PERSONA_OPTIONS.find(
    (opt) => opt.id === answers.persona
  )!;
  if (personaChoice.id === 'camera') {
    effects.push('💡 ガイドに「WebカメラのOBS設定手順」が追加されます');
  } else if (personaChoice.id === 'avatar') {
    effects.push('💡 ガイドに「VTuber向けの設定手順」が追加されます');
  }

  // Q3: 音声の悩みに応じた説明
  if (answers.audioConcerns.length > 0) {
    if (answers.audioConcerns.includes('volume')) {
      effects.push('💡 ガイドに「マイク音量の自動調整フィルタ」の設定手順が追加されます');
    }
    if (answers.audioConcerns.includes('noise')) {
      effects.push('💡 ガイドに「キーボード音などのノイズを除去するフィルタ」の設定手順が追加されます');
    }
  } else {
      effects.push('✅ 標準の音声設定でセットアップされます');
  }


  return (
    <div className="mt-6">
      <div className="p-5 rounded-lg border-2 border-primary/20 bg-primary/5 space-y-3">
        <h3 className="font-bold text-base">
          🎯 この設定で配信すると...
        </h3>
        <div className="space-y-2">
          {effects.map((effect, idx) => (
            <div key={idx} className="text-base text-foreground leading-relaxed">
              {effect}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
