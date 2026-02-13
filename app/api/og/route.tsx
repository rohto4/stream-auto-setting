import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'white',
            fontFamily: '"Noto Sans JP", sans-serif',
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎯</div>
          <div style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 20 }}>
            オートOBS設定
          </div>
          <div style={{ fontSize: 32, opacity: 0.8 }}>
            YouTube Live特化型OBS設定自動生成
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.6,
              marginTop: 40,
            }}
          >
            配信の準備、3分で完了
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG image generation error:', error);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
