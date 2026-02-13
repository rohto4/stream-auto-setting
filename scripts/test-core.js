/**
 * コア機能ユニットテスト
 * GPU検知、設定計算、ファイル生成のロジックをテスト
 */

const Database = require('better-sqlite3');
const path = require('path');

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

function testDbConnection() {
  log('blue', '\n=== Test 1: DB接続 ===');

  try {
    const dbPath = path.join(process.cwd(), 'data', 'sessions.db');
    const db = new Database(dbPath);

    // GPU数確認
    const gpuCount = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings').get();
    log('green', `✓ DB接続成功`);
    log('yellow', `  GPU Mappings: ${gpuCount.count} models`);

    // ジャンル数確認
    const genreCount = db.prepare('SELECT COUNT(*) as count FROM genre_configs').get();
    log('yellow', `  Genres: ${genreCount.count} categories`);

    db.close();
    return true;
  } catch (error) {
    log('red', `✗ DB接続失敗: ${error.message}`);
    throw error;
  }
}

function testGpuMapping() {
  log('blue', '\n=== Test 2: GPUマッピング検索 ===');

  try {
    const dbPath = path.join(process.cwd(), 'data', 'sessions.db');
    const db = new Database(dbPath);

    // 完全一致検索
    const rtx4070 = db.prepare('SELECT * FROM gpu_mappings WHERE gpu_name = ?').get('NVIDIA GeForce RTX 4070');

    if (!rtx4070) {
      throw new Error('RTX 4070 not found');
    }

    log('green', '✓ GPU検索成功');
    log('yellow', `  GPU: ${rtx4070.gpu_name}`);
    log('yellow', `  Encoder: ${rtx4070.encoder}`);
    log('yellow', `  Preset: ${rtx4070.preset}`);
    log('yellow', `  Max Bitrate: ${rtx4070.max_bitrate} kbps`);
    log('yellow', `  Tier: ${rtx4070.tier}`);

    // ベンダー別検索
    const nvidiaGpus = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings WHERE vendor = ?').get('nvidia');
    const amdGpus = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings WHERE vendor = ?').get('amd');
    const intelGpus = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings WHERE vendor = ?').get('intel');
    const appleGpus = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings WHERE vendor = ?').get('apple');

    log('yellow', `  NVIDIA: ${nvidiaGpus.count} models`);
    log('yellow', `  AMD: ${amdGpus.count} models`);
    log('yellow', `  Intel: ${intelGpus.count} models`);
    log('yellow', `  Apple: ${appleGpus.count} models`);

    db.close();
    return true;
  } catch (error) {
    log('red', `✗ GPUマッピング検索失敗: ${error.message}`);
    throw error;
  }
}

function testGenreConfig() {
  log('blue', '\n=== Test 3: ジャンル設定取得 ===');

  try {
    const dbPath = path.join(process.cwd(), 'data', 'sessions.db');
    const db = new Database(dbPath);

    // 全ジャンル取得
    const genres = db.prepare('SELECT * FROM genre_configs').all();

    log('green', '✓ ジャンル設定取得成功');

    genres.forEach((genre) => {
      log('yellow', `  ${genre.genre_id}: ${genre.display_name}`);
      log('yellow', `    - FPS: ${genre.recommended_fps}, Priority: ${genre.fps_priority}`);
      log('yellow', `    - Bitrate Multiplier: ${genre.bitrate_multiplier}x`);
    });

    db.close();
    return true;
  } catch (error) {
    log('red', `✗ ジャンル設定取得失敗: ${error.message}`);
    throw error;
  }
}

function testSessionFlow() {
  log('blue', '\n=== Test 4: セッションフロー ===');

  try {
    const dbPath = path.join(process.cwd(), 'data', 'sessions.db');
    const db = new Database(dbPath);

    // セッション作成
    const code = 'TEST';
    const genre = 'fps-high';
    const ipHash = 'test_hash_' + Date.now();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    db.prepare(`
      INSERT OR REPLACE INTO sessions (code, genre, created_at, expires_at, ip_hash)
      VALUES (?, ?, ?, ?, ?)
    `).run(code, genre, now.toISOString(), expiresAt.toISOString(), ipHash);

    log('green', '✓ セッション作成成功');

    // セッション取得
    const session = db.prepare('SELECT * FROM sessions WHERE code = ?').get(code);

    if (!session) {
      throw new Error('Session not found');
    }

    log('green', '✓ セッション取得成功');
    log('yellow', `  Code: ${session.code}`);
    log('yellow', `  Genre: ${session.genre}`);

    // クリーンアップ
    db.prepare('DELETE FROM sessions WHERE code = ?').run(code);

    db.close();
    return true;
  } catch (error) {
    log('red', `✗ セッションフロー失敗: ${error.message}`);
    throw error;
  }
}

async function runTests() {
  log('blue', '==================================');
  log('blue', '   コア機能ユニットテスト開始');
  log('blue', '==================================');

  try {
    testDbConnection();
    testGpuMapping();
    testGenreConfig();
    testSessionFlow();

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
