/**
 * 統合フローテストスクリプト
 * 新しいフロー（ジャンル選択 → GPU検知 → 回線速度 → 確認 → 生成）をテスト
 */

const BASE_URL = 'http://localhost:3002';

// カラー出力
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ========================================
// Test 1: GPU一覧取得（手動選択用）
// ========================================
async function testGpuList() {
  log('blue', '\n=== Test 1: GPU一覧取得 ===');

  try {
    const response = await fetch(`${BASE_URL}/api/gpu/list`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    log('green', '✓ GPU一覧取得成功');
    log('yellow', `  GPU数: ${data.count}件`);
    log('yellow', `  例: ${data.gpus.slice(0, 3).map(g => g.gpuName).join(', ')}`);

    return true;
  } catch (error) {
    log('red', `✗ GPU一覧取得失敗: ${error.message}`);
    throw error;
  }
}

// ========================================
// Test 2: GPUマッピング検索
// ========================================
async function testGpuMapping() {
  log('blue', '\n=== Test 2: GPUマッピング検索 ===');

  try {
    const response = await fetch(`${BASE_URL}/api/gpu/map`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        normalizedName: 'NVIDIA GeForce RTX 4070',
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    log('green', '✓ GPUマッピング検索成功');
    log('yellow', `  GPU: ${data.mapping.gpuName}`);
    log('yellow', `  Encoder: ${data.mapping.encoder}`);
    log('yellow', `  Confidence: ${data.confidence}`);

    return data.mapping;
  } catch (error) {
    log('red', `✗ GPUマッピング検索失敗: ${error.message}`);
    throw error;
  }
}

// ========================================
// Test 3: 回線速度測定（Upload）
// ========================================
async function testSpeedMeasure() {
  log('blue', '\n=== Test 3: 回線速度測定（Upload） ===');

  try {
    const response = await fetch(`${BASE_URL}/api/speed-test/measure`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    log('green', '✓ Upload速度測定成功');
    log('yellow', `  Upload: ${data.uploadMbps.toFixed(2)} Mbps`);
    log('yellow', `  Duration: ${data.durationMs} ms`);

    return data.uploadMbps;
  } catch (error) {
    log('red', `✗ Upload速度測定失敗: ${error.message}`);
    throw error;
  }
}

// ========================================
// Test 4: 回線速度測定（Download）
// ========================================
async function testSpeedDownload() {
  log('blue', '\n=== Test 4: 回線速度測定（Download） ===');

  try {
    const response = await fetch(`${BASE_URL}/api/speed-test/download`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    log('green', '✓ Download速度測定成功');
    log('yellow', `  Download: ${data.downloadMbps.toFixed(2)} Mbps`);
    log('yellow', `  Duration: ${data.durationMs} ms`);

    return data.downloadMbps;
  } catch (error) {
    log('red', `✗ Download速度測定失敗: ${error.message}`);
    throw error;
  }
}

// ========================================
// Test 5: 設定ファイル生成（新フロー）
// ========================================
async function testConfigGenerate(gpuMapping, uploadMbps, downloadMbps) {
  log('blue', '\n=== Test 5: 設定ファイル生成 ===');

  try {
    const mockGpuDetection = {
      rawName: 'NVIDIA GeForce RTX 4070',
      normalized: 'NVIDIA GeForce RTX 4070',
      mapping: gpuMapping,
      confidence: 1.0,
    };

    const mockSpeedTest = {
      uploadMbps,
      downloadMbps,
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

// ========================================
// メイン実行
// ========================================
async function runTests() {
  log('cyan', '==================================');
  log('cyan', '   統合フローテスト開始');
  log('cyan', '==================================');

  let gpuMapping, uploadMbps, downloadMbps;

  try {
    // Test 1: GPU一覧取得
    await testGpuList();

    // Test 2: GPUマッピング検索
    gpuMapping = await testGpuMapping();

    // Test 3: Upload速度測定
    uploadMbps = await testSpeedMeasure();

    // Test 4: Download速度測定
    downloadMbps = await testSpeedDownload();

    // Test 5: 設定ファイル生成
    await testConfigGenerate(gpuMapping, uploadMbps, downloadMbps);

    log('green', '\n==================================');
    log('green', '   全テスト成功！ ✓');
    log('green', '==================================\n');

    log('cyan', '次のステップ:');
    log('cyan', '1. ブラウザで http://localhost:3002 にアクセス');
    log('cyan', '2. ジャンル選択 → GPU検知 → 回線速度測定 → 設定確認 → 生成');
    log('cyan', '3. 各ステップで「次へ」ボタンが表示されることを確認');
    log('cyan', '4. GPU手動変更、回線速度再測定の機能を確認\n');

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
