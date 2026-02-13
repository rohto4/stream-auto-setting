/**
 * ダウンロード完了画面（拡張版）
 * ガイド機能へのナビゲーション追加
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GuideCompleteProps {
  onStartGuide: () => void;
  onReset: () => void;
}

export function GuideComplete({
  onStartGuide,
  onReset,
}: GuideCompleteProps) {
  const [showImportHelp, setShowImportHelp] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl">🎉</CardTitle>
          <CardTitle className="text-3xl">
            設定ファイルのダウンロード完了！
          </CardTitle>
          <CardDescription className="text-xl">
            次のステップ: OBSで手動設定
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ZIPファイル情報 */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">📦 ダウンロードされたファイル</p>
            <p className="text-lg font-mono mt-2">obs-config-xxxxxx.zip</p>
            <p className="text-sm text-muted-foreground mt-1">サイズ: 約 1.6 KB</p>
          </div>

          {/* ナビゲーション */}
          <div className="space-y-3">
            <Button
              onClick={() => setShowImportHelp(true)}
              variant="outline"
              className="w-full text-lg py-7"
              size="lg"
            >
              📥 ZIPファイルのインポート方法
            </Button>

            <Button
              onClick={onStartGuide}
              className="w-full text-lg py-7"
              size="lg"
            >
              ⚙️ 必須設定ガイドを見る
            </Button>
          </div>

          {/* 戻るボタン */}
          <Button
            onClick={onReset}
            variant="ghost"
            className="w-full text-base"
          >
            最初に戻る
          </Button>

          {/* ヒント */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              💡 ヒント: 必須設定ガイドを見ることで、OBSで手動設定が必要な項目が分かります
            </p>
          </div>
        </CardContent>
      </Card>

      {/* インポート方法モーダル */}
      <Dialog open={showImportHelp} onOpenChange={setShowImportHelp}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              ZIPファイルをOBSにインポート
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              ダウンロードした設定ファイルをOBSで使用する手順
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* ステップ1 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">ステップ 1: ZIPファイルを解凍</h3>
              <ol className="space-y-2 ml-4 text-base">
                <li className="list-decimal">ダウンロードフォルダから obs-config-xxxxxx.zip を見つける</li>
                <li className="list-decimal">右クリック &gt; 「すべて展開」（Windows）または「アーカイブユーティリティで開く」（Mac）</li>
                <li className="list-decimal">デスクトップなど見やすい場所に解凍</li>
              </ol>
            </div>

            {/* ステップ2 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">ステップ 2: OBSで設定をインポート</h3>
              <ol className="space-y-2 ml-4 text-base">
                <li className="list-decimal">OBSを開く</li>
                <li className="list-decimal">メニュー &gt; 「プロファイル」 &gt; 「インポート」</li>
                <li className="list-decimal">解凍したフォルダを選択</li>
                <li className="list-decimal">「インポート」をクリック</li>
              </ol>
            </div>

            {/* ステップ3 */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">ステップ 3: YouTube配信キーを設定</h3>
              <ol className="space-y-2 ml-4 text-base">
                <li className="list-decimal">OBS &gt; 設定 &gt; 配信</li>
                <li className="list-decimal">YouTube Studioから取得した配信キーを貼り付け</li>
                <li className="list-decimal">「OK」をクリック</li>
              </ol>
            </div>

            {/* 注意 */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                ⚠️ 重要: basic.iniのみがインポートされます。その他のOBS内での手動設定（マイク、ゲームキャプチャなど）は「必須設定ガイド」を参考に行ってください
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
