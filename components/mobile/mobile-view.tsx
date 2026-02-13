/**
 * モバイルビュー（ランディングページ）
 * 宣伝・動作概要・PC版誘導
 */

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MobileView() {
  const pcUrl = typeof window !== 'undefined' ? window.location.origin : 'https://obs.auto';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(pcUrl);
      toast.success('URLをコピーしました');
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('コピーに失敗しました');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-beginner-green/5 via-background to-beginner-yellow/5 p-4">
      <motion.div
        className="max-w-md mx-auto space-y-6 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ヘッダー */}
        <motion.div className="text-center space-y-2" variants={itemVariants}>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-beginner-gradient">
            オートOBS設定
          </h1>
          <p className="text-lg text-muted-foreground">
            配信の準備、3分で完了
          </p>
        </motion.div>

        {/* ヒーローセクション */}
        <motion.div variants={itemVariants}>
          <Card>
          <CardHeader>
            <CardTitle className="text-xl">OBSの設定ファイルを自動で作成</CardTitle>
            <CardDescription className="text-base">専門知識不要で最適な配信設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-base">GPU自動検知</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-base">回線速度測定</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-base">最適設定を自動計算</span>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* 動作概要 */}
        <motion.div variants={itemVariants}>
          <Card>
          <CardHeader>
            <CardTitle className="text-xl">🚀 どう使うの？</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-base">ジャンルを選ぶ</h3>
                <p className="text-base text-muted-foreground">
                  「激しいゲーム」「雑談」など
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-base">自動で測定</h3>
                <p className="text-base text-muted-foreground">
                  GPU・回線速度を自動検知
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-base">ファイルをダウンロード</h3>
                <p className="text-base text-muted-foreground">
                  OBSにインポートするだけ
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* 特徴・メリット */}
        <motion.div variants={itemVariants}>
          <Card>
          <CardHeader>
            <CardTitle className="text-xl">✨ こんな人におすすめ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h3 className="font-bold text-base">配信初心者</h3>
                <p className="text-base text-muted-foreground">
                  専門用語なしで設定完了
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h3 className="font-bold text-base">設定がよくわからない</h3>
                <p className="text-base text-muted-foreground">
                  最適値を自動計算
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <h3 className="font-bold text-base">すぐ配信したい</h3>
                <p className="text-base text-muted-foreground">
                  3分で準備完了
                </p>
              </div>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* PC版誘導 */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-xl">💻 PCで使ってください</CardTitle>
            <CardDescription className="text-base">
              OBSはPC専用のため、PCでアクセスしてください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-base font-medium">検索ワード:</p>
              <div className="p-5 bg-primary/10 rounded-lg text-center">
                <p className="text-xl font-bold">オートOBS設定</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-base font-medium">または直接アクセス:</p>
              <div className="p-4 bg-muted rounded-lg text-center break-all">
                <p className="text-base font-mono">{pcUrl}</p>
              </div>
              <Button
                onClick={handleCopyUrl}
                className="w-full text-lg py-6"
                variant="outline"
                aria-label={`このサイトのURLをコピー: ${pcUrl}`}
              >
                URLをコピー
              </Button>
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </main>
  );
}
