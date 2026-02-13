/**
 * ステータス表示用アイコン
 * Unicode絵文字からlucide-reactアイコンへの置き換え
 */

import {
  CheckCircle2,
  XCircle,
  Settings,
  Zap,
  Info,
  AlertTriangle,
  Loader2,
  Download,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

/**
 * ステータスアイコンマッピング
 */
export const STATUS_ICONS = {
  success: CheckCircle2,        // ✅ → CheckCircle2
  error: XCircle,                // ❌ → XCircle
  settings: Settings,            // ⚙️ → Settings
  processing: Loader2,           // 🔄 → Loader2 (回転アニメーション可能)
  info: Info,                    // 💡 → Info
  warning: AlertTriangle,        // ⚠️ → AlertTriangle
  speed: Zap,                    // ⚡ → Zap
  download: Download,            // 📥 → Download
  analytics: BarChart3,          // 📊 → BarChart3
} as const;

export type StatusIconType = keyof typeof STATUS_ICONS;

/**
 * ステータスアイコンコンポーネント
 */
interface StatusIconProps {
  type: StatusIconType;
  className?: string;
  size?: number;
  spinning?: boolean;
}

export function StatusIcon({
  type,
  className,
  size = 20,
  spinning = false,
}: StatusIconProps) {
  const Icon = STATUS_ICONS[type];

  return (
    <Icon
      className={`${className} ${spinning ? 'animate-spin' : ''}`}
      size={size}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}
