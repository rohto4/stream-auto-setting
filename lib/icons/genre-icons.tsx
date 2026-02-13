/**
 * ジャンル別アイコンマッピング
 * Unicode絵文字からlucide-reactアイコンへの置き換え
 */

import {
  Crosshair,
  Swords,
  Puzzle,
  Mic,
  Gamepad2,
  type LucideIcon,
} from 'lucide-react';
import type { GenreId } from '../types';

/**
 * ジャンルIDとアイコンのマッピング
 */
export const GENRE_ICON_MAP: Record<GenreId, LucideIcon> = {
  'fps-high': Crosshair,      // 🎮 → Crosshair (FPS/競技ゲーム)
  'rpg-mid': Swords,           // ⚔️ → Swords (アクション/RPG)
  'puzzle-low': Puzzle,        // 🧩 → Puzzle (パズル/カジュアル)
  'chat': Mic,                 // 🎤 → Mic (雑談/歌配信)
  'retro': Gamepad2,           // 🕹️ → Gamepad2 (レトロゲーム)
};

/**
 * ジャンルアイコンコンポーネント
 */
interface GenreIconProps {
  genreId: GenreId;
  className?: string;
  size?: number;
}

export function GenreIcon({ genreId, className, size = 24 }: GenreIconProps) {
  const Icon = GENRE_ICON_MAP[genreId];

  return (
    <Icon
      className={className}
      size={size}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}
