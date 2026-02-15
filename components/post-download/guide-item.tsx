/**
 * ガイド項目コンポーネント
 * 手順の展開/折りたたみ、完了チェック、画像/テキスト切り替え
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { GuideItem } from '@/lib/types';

interface GuideItemProps {
  item: GuideItem;
  onComplete?: (completed: boolean) => void;
  showImpact?: boolean;
}

const impactColors = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-green-600 dark:text-green-400',
  none: 'text-gray-600 dark:text-gray-400',
};

const impactEmojis = {
  high: '🔴',
  medium: '🟡',
  low: '🟢',
  none: '⚪',
};

const impactLabels = {
  high: '重大な影響あり',
  medium: '中程度の影響',
  low: '軽微な影響',
  none: '影響なし',
};

export function GuideItemComponent({
  item,
  onComplete,
  showImpact = true,
}: GuideItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState(item.completed || false);
  const [showImage, setShowImage] = useState(false);

  const handleComplete = (value: boolean) => {
    setCompleted(value);
    onComplete?.(value);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => handleComplete(e.target.checked)}
                className="w-5 h-5 cursor-pointer"
              />
              <CardTitle className="text-xl">
                {item.title}
              </CardTitle>
            </div>
            {showImpact && item.impact !== 'none' && (
              <div className="mt-2 flex items-center gap-2" role="status" aria-label={`影響度: ${impactLabels[item.impact]}`}>
                <span className="text-base" aria-hidden="true">
                  {impactEmojis[item.impact]}
                </span>
                <span className={`text-sm font-medium ${impactColors[item.impact]}`}>
                  {item.impactDescription || impactLabels[item.impact]}
                </span>
              </div>
            )}
            <CardDescription className="mt-2 text-base">
              {item.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4" id={`guide-details-${item.id}`}>
          {/* 推定時間 */}
          {item.estimatedTime && (
            <div className="text-sm text-muted-foreground">
              ⏱️ 推定時間: {Math.floor(item.estimatedTime / 60)}分{item.estimatedTime % 60}秒
            </div>
          )}

          {/* 手順 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base">📝 手順:</h4>
            <ol className="space-y-2 ml-4">
              {item.steps.map((step, idx) => (
                <li key={idx} className="text-base text-foreground list-decimal">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* 画像/テキストボタン */}
          {(item.image || item.imagePlaceholder) && (
            <div className="flex gap-2 pt-4">
              {item.image && (
                <Button
                  variant={showImage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowImage(true)}
                  className="text-base"
                >
                  📸 画像で見る
                </Button>
              )}
              {item.imagePlaceholder && (
                <Button
                  variant={!showImage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowImage(false)}
                  className="text-base"
                >
                  📝 テキストで見る
                </Button>
              )}
            </div>
          )}

          {/* 画像表示（next/image） */}
          {showImage && item.image && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={item.image.width}
                height={item.image.height}
                className="w-full max-w-2xl rounded-lg border border-border"
                placeholder={item.image.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={item.image.blurDataURL}
                loading="lazy"
              />
            </div>
          )}

          {/* Placeholder画像（テキスト表示） */}
          {!showImage && item.imagePlaceholder && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <pre className="text-xs whitespace-pre-wrap font-mono overflow-x-auto">
                {item.imagePlaceholder}
              </pre>
            </div>
          )}
        </CardContent>
      )}

      {/* 展開/折りたたみボタン */}
      <div className="px-6 py-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-center text-base"
          aria-expanded={expanded}
          aria-controls={`guide-details-${item.id}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-5 h-5 mr-2" />
              折りたたむ
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5 mr-2" />
              手順を見る
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
