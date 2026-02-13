/**
 * 詳細設定フェーズ - プレビューパネルコンポーネント
 */

'use client';

import type { ObsConfig } from '@/lib/types';

interface PreviewPanelProps {
  config: ObsConfig;
  baseConfig: ObsConfig;
}

export function PreviewPanel({ config, baseConfig }: PreviewPanelProps) {
  const resolution =
    config.outputResolution === '1920x1080' ? '1080p' : '720p';
  const baseResolution =
    baseConfig.outputResolution === '1920x1080' ? '1080p' : '720p';

  const resolutionChanged =
    config.outputResolution !== baseConfig.outputResolution ||
    config.fps !== baseConfig.fps;
  const bitrateChanged = config.bitrate !== baseConfig.bitrate;
  const presetChanged = config.preset !== baseConfig.preset;

  return (
    <div className="space-y-4">
      <div className="bg-muted/50 p-5 rounded-lg space-y-4">
        <h3 className="text-base font-bold text-foreground">
          📊 現在の設定プレビュー
        </h3>

        {/* 解像度・FPS */}
        <PreviewItem
          label="解像度"
          value={`${resolution} ${config.fps}fps`}
          baseValue={`${baseResolution} ${baseConfig.fps}fps`}
          changed={resolutionChanged}
        />

        {/* ビットレート */}
        <PreviewItem
          label="ビットレート"
          value={`${config.bitrate.toLocaleString()} kbps`}
          baseValue={`${baseConfig.bitrate.toLocaleString()} kbps`}
          changed={bitrateChanged}
        />

        {/* エンコーダプリセット */}
        <PreviewItem
          label="エンコーダ"
          value={`${config.preset}`}
          baseValue={`${baseConfig.preset}`}
          changed={presetChanged}
        />
      </div>

      {/* ヒント */}
      <div className="text-sm text-blue-900 dark:text-blue-100 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 leading-relaxed">
        💡 選択を変更すると設定が自動更新されます
      </div>
    </div>
  );
}

interface PreviewItemProps {
  label: string;
  value: string;
  baseValue?: string;
  changed: boolean;
}

function PreviewItem({
  label,
  value,
  baseValue,
  changed,
}: PreviewItemProps) {
  return (
    <div className="flex justify-between items-center text-base">
      <span className="text-muted-foreground font-medium">{label}:</span>
      <div className="text-right">
        <div className={`font-medium ${changed ? 'text-primary' : ''}`}>
          {value}
          {changed && <span className="ml-1 text-sm">*</span>}
        </div>
        {changed && baseValue && (
          <div className="text-sm text-muted-foreground line-through">
            {baseValue}
          </div>
        )}
      </div>
    </div>
  );
}
