/**
 * GPU手動選択モーダル
 * 検知結果が違う場合にユーザーが手動で選択
 */

'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { GpuMapping } from '@/lib/types';

interface GpuSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (gpu: GpuMapping) => void;
}

export function GpuSelectorModal({
  open,
  onClose,
  onSelect,
}: GpuSelectorModalProps) {
  const [gpuList, setGpuList] = useState<GpuMapping[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchGpuList();
    }
  }, [open]);

  async function fetchGpuList() {
    setLoading(true);
    try {
      const response = await fetch('/api/gpu/list');
      if (!response.ok) {
        throw new Error('Failed to fetch GPU list');
      }
      const data = await response.json();
      setGpuList(data.gpus);
    } catch (error) {
      console.error('GPU list fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredGpus = gpuList.filter((gpu) =>
    gpu.gpuName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">GPUを手動で選択</DialogTitle>
          <DialogDescription className="text-base">
            検知されたGPUが違う場合は、以下から正しいGPUを選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="GPU名で検索（例: RTX 4070, RX 7900）"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="GPU検索フィールド"
            autoFocus
          />

          {loading ? (
            <p className="text-base text-muted-foreground text-center py-8">
              GPU一覧を読み込み中...
            </p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {filteredGpus.map((gpu) => (
                  <Button
                    key={gpu.gpuName}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4"
                    onClick={() => {
                      onSelect(gpu);
                      onClose();
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-medium text-base">{gpu.gpuName}</span>
                      <span className="text-sm text-muted-foreground">
                        {gpu.vendor.toUpperCase()} - {gpu.encoder} - Tier {gpu.tier}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>

              {filteredGpus.length === 0 && (
                <p className="text-base text-muted-foreground text-center py-8">
                  該当するGPUが見つかりません
                </p>
              )}
            </ScrollArea>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            キャンセル
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
