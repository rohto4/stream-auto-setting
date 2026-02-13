/**
 * ジャンル選択カード
 * モバイルビュー用
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { GenreIcon } from '@/lib/icons/genre-icons';
import type { GenreId } from '@/lib/types';

interface GenreCardProps {
  title: string;
  subtitle: string;
  examples: string;
  genreId: GenreId;
  onSelect: (genreId: GenreId) => void;
}

export function GenreCard({
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
      className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded border-2 hover:border-primary"
      onClick={() => onSelect(genreId)}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${subtitle}。例: ${examples}`}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GenreIcon genreId={genreId} className="text-primary" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pl-[52px]">
          例: {examples}
        </p>
      </CardContent>
    </Card>
  );
}
