/**
 * パフォーマンス設定ガイド画面
 * 5つのパフォーマンス改善項目（ユーザが選択可能）
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GuideItemComponent } from './guide-item';
import { getPerformanceGuides } from '@/lib/post-download-guide';

interface GuidePerformanceProps {
  onComplete: () => void;
}

export function GuidePerformance({ onComplete }: GuidePerformanceProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const guides = getPerformanceGuides();

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleItemComplete = (id: string, isComplete: boolean) => {
    setSelected((prev) => ({
      ...prev,
      [id]: isComplete,
    }));
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
        <CardHeader>
          <CardTitle className="text-3xl">⚡ パフォーマンス設定</CardTitle>
          <CardDescription className="text-xl">
            配信品質とCPU負荷のバランスを取ります
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">
            以下の{guides.length}つの設定は推奨ですが、自由に選択できます。
            チェックを入れた設定のみ実施してください。
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

      {/* 選択状況表示 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">選択状況</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">
            {selectedCount}/{guides.length} 選択済み
          </div>
          <p className="text-sm text-muted-foreground">
            {selectedCount === 0
              ? '設定を選択すると、その項目が表示されます'
              : `${selectedCount}つの設定を実施します`}
          </p>
        </CardContent>
      </Card>

      {/* ナビゲーションボタン */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onComplete}
          className="text-xl py-8 px-8"
          size="lg"
        >
          次へ: オプション設定
        </Button>
      </div>

      {/* ヒント */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 ヒント: 画面の「手順を見る」をクリックして各項目の詳細を確認できます。
          チェックボックスは、OBSで実際に設定を完了した後に自分で手動でチェックしてください。
        </p>
      </div>
    </div>
  );
}
