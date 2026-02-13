/**
 * メディアクエリフック
 * モバイル/PCの判定に使用
 */

'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * モバイル判定フック
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
