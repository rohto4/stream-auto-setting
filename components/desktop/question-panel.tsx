/**
 * 詳細設定フェーズ - 質問パネルコンポーネント
 * (Phase 6: 2026-02-12改訂)
 */

'use client';

import { QuestionItem } from './question-item';
import type {
  AdvancedSettingsAnswers,
  PerformancePriority,
  Persona,
  AudioConcern,
} from '@/lib/types';
import {
  PERFORMANCE_PRIORITY_OPTIONS,
  PERSONA_OPTIONS,
  AUDIO_CONCERN_OPTIONS,
} from '@/lib/advanced-settings-options';

interface QuestionPanelProps {
  answers: AdvancedSettingsAnswers;
  onAnswerChange: (answers: AdvancedSettingsAnswers) => void;
}

export function QuestionPanel({
  answers,
  onAnswerChange,
}: QuestionPanelProps) {
  const handlePerformanceChange = (id: string | string[]) => {
    onAnswerChange({
      ...answers,
      performancePriority: id as PerformancePriority,
    });
  };

  const handlePersonaChange = (id: string | string[]) => {
    onAnswerChange({
      ...answers,
      persona: id as Persona,
    });
  };

  const handleAudioConcernsChange = (ids: string | string[]) => {
    onAnswerChange({
      ...answers,
      audioConcerns: ids as AudioConcern[],
    });
  };

  return (
    <div className="space-y-8">
      {/* Q1: PCパフォーマンス vs 配信画質 */}
      <QuestionItem
        question="Q1. 配信中のPCパフォーマンスは、どちらを優先しますか？"
        type="single"
        options={PERFORMANCE_PRIORITY_OPTIONS.map((opt) => ({
          id: opt.id,
          label: opt.label,
          description: opt.description,
        }))}
        selectedId={answers.performancePriority}
        onChange={handlePerformanceChange}
      />

      <div className="border-t border-border" />

      {/* Q2: 配信でのあなたの見せ方 */}
      <QuestionItem
        question="Q2. 配信画面に、あなた自身はどのように登場しますか？"
        type="single"
        options={PERSONA_OPTIONS.map((opt) => ({
          id: opt.id,
          label: opt.label,
          description: opt.description,
        }))}
        selectedId={answers.persona}
        onChange={handlePersonaChange}
      />

      <div className="border-t border-border" />

      {/* Q3: マイク音声の悩み */}
      <QuestionItem
        question="Q3. マイクの音声について、何か気になることはありますか？（複数選択可）"
        type="multiple"
        options={AUDIO_CONCERN_OPTIONS.map((opt) => ({
          id: opt.id,
          label: opt.label,
          description: opt.description,
        }))}
        selectedId={answers.audioConcerns}
        onChange={handleAudioConcernsChange}
      />
    </div>
  );
}
