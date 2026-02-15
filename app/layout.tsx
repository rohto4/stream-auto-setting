import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: true, // 優先的に読み込み
});

export const metadata: Metadata = {
  title: 'オートOBS設定 - YouTube Live特化型OBS設定自動生成',
  description: '配信初心者が迷わず、3分で最適なOBS設定を手に入れられる。専門知識不要の自動設定ツール。GPU自動検知・回線速度測定・設定ファイル自動生成。',
  keywords: ['OBS', 'YouTube Live', '配信設定', '自動生成', 'GPU検知', 'ビットレート', 'ゲーム配信'],
  authors: [{ name: 'オートOBS設定チーム' }],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://obs.auto'),
  openGraph: {
    title: 'オートOBS設定 - YouTube Live特化型OBS設定自動生成',
    description: '配信初心者が迷わず、3分で最適なOBS設定を手に入れられる。GPU自動検知・回線速度測定・設定ファイル自動生成。',
    type: 'website',
    locale: 'ja_JP',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://obs.auto',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'オートOBS設定',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'オートOBS設定',
    description: '配信初心者が迷わず、3分で最適なOBS設定を手に入れられる',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
