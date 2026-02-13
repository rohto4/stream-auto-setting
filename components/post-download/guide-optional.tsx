/**
 * オプション設定ガイド画面
 * 2つのオプション項目（ブラウザソース、音声モニタリング）
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GuideItemComponent } from './guide-item';
import { getOptionalGuides } from '@/lib/post-download-guide';

interface GuideOptionalProps {
  onComplete: () => void;
}

export function GuideOptional({ onComplete }: GuideOptionalProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const guides = getOptionalGuides();

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
      <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
        <CardHeader>
          <CardTitle className="text-3xl">✨ オプション設定</CardTitle>
          <CardDescription className="text-xl">
            必須ではありませんが、あると便利な設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground">
            以下の{guides.length}つの設定は完全にオプションです。
            必要に応じて選択してください。
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
              ? 'スキップしても問題ありません'
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
          variant="default"
        >
          完了！ 配信を開始
        </Button>
      </div>

      {/* ヒント */}
      <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 ヒント: オプション設定は後からでも実施できます。
          まずは必須設定とパフォーマンス設定で配信を開始することをお勧めします。
        </p>
      </div>
    </div>
  );
}
