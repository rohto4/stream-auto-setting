/**
 * APIテストスクリプト
 * 設定生成のフローをテスト（新設計版）
 */

const BASE_URL = 'http://localhost:3002';

// カラー出力
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConfigGenerate() {
  log('blue', '\n=== Test 1: 設定ファイル生成 ===');

  try {
    const mockGpuDetection = {
      rawName: 'NVIDIA GeForce RTX 4070',
      normalized: 'NVIDIA GeForce RTX 4070',
      mapping: {
        gpuName: 'NVIDIA GeForce RTX 4070',
        vendor: 'nvidia',
        encoder: 'ffmpeg_nvenc',
        preset: 'p5',
        maxBitrate: 9000,
        supportsHevc: true,
        supportsAv1: true,
        tier: 1,
      },
      confidence: 1.0,
    };

    const mockSpeedTest = {
      uploadMbps: 15.2,
      downloadMbps: 50.0,
      latencyMs: 20,
      jitterMs: 5,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        genre: 'fps-high',
        gpuDetection: mockGpuDetection,
        speedTest: mockSpeedTest,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/zip')) {
      throw new Error(`Expected ZIP, got ${contentType}`);
    }

    const blob = await response.blob();
    log('green', '✓ 設定ファイル生成成功');
    log('yellow', `  Size: ${blob.size} bytes`);
    log('yellow', `  Type: ${blob.type}`);

    // ヘッダーチェック（Base64デコード）
    const warningsBase64 = response.headers.get('x-config-warnings');
    const speedAssessmentBase64 = response.headers.get('x-speed-assessment');
    const gpuConfidence = response.headers.get('x-gpu-confidence');

    if (warningsBase64) {
      const warnings = JSON.parse(Buffer.from(warningsBase64, 'base64').toString('utf-8'));
      log('yellow', `  Warnings: ${JSON.stringify(warnings)}`);
    }
    if (speedAssessmentBase64) {
      const assessment = JSON.parse(Buffer.from(speedAssessmentBase64, 'base64').toString('utf-8'));
      log('yellow', `  Speed: ${assessment.tier} (${assessment.message})`);
    }
    if (gpuConfidence) {
      log('yellow', `  GPU Confidence: ${gpuConfidence}`);
    }

    return true;
  } catch (error) {
    log('red', `✗ 設定ファイル生成失敗: ${error.message}`);
    throw error;
  }
}

async function runTests() {
  log('blue', '==================================');
  log('blue', '   API統合テスト開始');
  log('blue', '==================================');

  try {
    // Test 1: 設定ファイル生成（ジャンル直接指定）
    await testConfigGenerate();

    log('green', '\n==================================');
    log('green', '   全テスト成功！ ✓');
    log('green', '==================================\n');

    process.exit(0);
  } catch (error) {
    log('red', '\n==================================');
    log('red', '   テスト失敗');
    log('red', '==================================\n');

    process.exit(1);
  }
}

// メイン実行
runTests();
