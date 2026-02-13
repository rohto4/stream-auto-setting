/**
 * トップページ
 * モバイル/PC自動判定して適切な画面を表示
 */

'use client';

import { useState, useEffect } from 'react';
import { useIsMobile } from '@/lib/hooks/use-media-query';
import { MobileView } from '@/components/mobile/mobile-view';
import { DesktopView } from '@/components/desktop/desktop-view';

export default function Home() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 初回レンダリング時はnullを返してHydration Errorを回避
  if (!mounted) {
    return null;
  }

  return isMobile ? <MobileView /> : <DesktopView />;
}
