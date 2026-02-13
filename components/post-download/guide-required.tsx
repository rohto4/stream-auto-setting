/**
 * 必須設定ガイド画面
 * YouTube配信キー、マイク、ゲームキャプチャの3項目
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GuideItemComponent } from './guide-item';
import { getRequiredGuides } from '@/lib/post-download-guide';

interface GuideRequiredProps {
  onComplete: () => void;
}

export function GuideRequired({ onComplete }: GuideRequiredProps) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const guides = getRequiredGuides();

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalCount = guides.length;
  const progress = (completedCount / totalCount) * 100;

  const handleItemComplete = (id: string, isComplete: boolean) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: isComplete,
    }));
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
        <CardHeader>
          <CardTitle className="text-3xl">✅ 必須設定</CardTitle>
          <CardDescription className="text-xl">
            配信前に必ず設定してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">
            以下の3つは必ず設定してください。設定しないと配信を開始できません。
          </p>
        </CardContent>
      </Card>

      {/* ガイド項目 */}
      <div className="space-y-4">
        {guides.map((guide) => (
          <GuideItemComponent
            key={guide.id}
            item={guide}
            onComplete={(isComplete) =>
              handleItemComplete(guide.id, isComplete)
            }
            showImpact={true}
          />
        ))}
      </div>

      {/* 進捗バー */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">進捗</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">
            {completedCount}/{totalCount} 完了
          </div>
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            {completedCount === totalCount
              ? '✨ すべての必須設定が完了しました！'
              : `あと ${totalCount - completedCount} つ設定が必要です`}
          </p>
        </CardContent>
      </Card>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onComplete}
          className="text-xl py-8 px-8"
          size="lg"
          disabled={completedCount < totalCount}
        >
          次へ: パフォーマンス設定
        </Button>
      </div>

      {/* 注意 */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-900 dark:text-yellow-100">
          ⚠️ 注意: 上のチェックボックスは自分で手動で設定したことを確認するためのものです。OBSで実際に設定を完了してからチェックしてください。
        </p>
      </div>
    </div>
  );
}
