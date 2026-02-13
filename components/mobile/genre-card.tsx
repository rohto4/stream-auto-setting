/**
 * ジャンル選択カード
 * モバイルビュー用
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { GenreId } from '@/lib/types';

interface GenreCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  examples: string;
  genreId: GenreId;
  onSelect: (genreId: GenreId) => void;
}

export function GenreCard({
  emoji,
  title,
  subtitle,
  examples,
  genreId,
  onSelect,
}: GenreCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(genreId);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
      onClick={() => onSelect(genreId)}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${subtitle}。例: ${examples}`}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pl-12">
          例: {examples}
        </p>
      </CardContent>
    </Card>
  );
}
