/**
 * プリセット選択コンポーネント
 * 保存済みプリセートの一覧表示と選択
 * Phase 6.3.3で作成
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Trash2, Clock, Zap } from 'lucide-react';
import { loadPresets, deletePreset } from '@/lib/preset-manager';
import type { PresetMetadata, GenreId } from '@/lib/types';
import { toast } from 'sonner';

interface PresetSelectorProps {
  onSelect: (preset: PresetMetadata) => void;
  onNewConfig: () => void;
}

const GENRE_LABELS: Record<GenreId, string> = {
  'fps-high': '激しいゲーム',
  'rpg-mid': 'アクションゲーム',
  'puzzle-low': 'ゆっくりゲーム',
  'chat': '雑談・歌配信',
  'retro': 'レトロゲーム',
};

export function PresetSelector({ onSelect, onNewConfig }: PresetSelectorProps) {
  const [presets, setPresets] = useState<PresetMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresetsAsync();
  }, []);

  async function loadPresetsAsync() {
    try {
      const loaded = loadPresets();
      setPresets(loaded);
    } catch (error) {
      console.error('Failed to load presets:', error);
      toast.error('プリセートの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`プリセート「${name}」を削除しますか？`)) return;

    try {
      deletePreset(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));
      toast.success('プリセートを削除しました');
    } catch (error) {
      console.error('Failed to delete preset:', error);
      toast.error('プリセートの削除に失敗しました');
    }
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今日';
    if (days === 1) return '昨日';
    if (days < 7) return `${days}日前`;
    if (days < 30) return `${Math.floor(days / 7)}週間前`;
    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">保存済みプリセート</CardTitle>
          <CardDescription className="text-base">読み込み中...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Save className="w-6 h-6 text-primary" />
          保存済みプリセート
        </CardTitle>
        <CardDescription className="text-base">
          {presets.length === 0
            ? '保存されたプリセートはありません'
            : `${presets.length}件のプリセートがあります`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* プリセート一覧 */}
        {presets.length > 0 && (
          <div className="space-y-3">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className="border rounded-lg p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{preset.name}</h3>
                    {preset.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {preset.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-sm">
                        {GENRE_LABELS[preset.config.genre]}
                      </Badge>
                      <Badge variant="outline" className="text-sm flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {preset.config.gpuResult.mapping.gpuName}
                      </Badge>
                      <Badge variant="outline" className="text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(preset.updatedAt)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onSelect(preset)}
                      className="text-base"
                      size="sm"
                    >
                      使用する
                    </Button>
                    <Button
                      onClick={() => handleDelete(preset.id, preset.name)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 新規作成ボタン */}
        <div className="pt-4 border-t">
          <Button
            onClick={onNewConfig}
            variant="outline"
            className="w-full text-lg py-6"
            size="lg"
          >
            新しい設定を作成
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
