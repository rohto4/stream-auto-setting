const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'sessions.db');

// dataディレクトリがなければ作成
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// SQLiteの最適化設定
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = -64000'); // 64MB

console.log('🗄️  Creating database tables...');

// sessionsテーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    code TEXT PRIMARY KEY NOT NULL,
    genre TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    user_agent TEXT,
    ip_hash TEXT NOT NULL,
    used_at DATETIME,

    CHECK(length(code) = 4),
    CHECK(expires_at > created_at)
  );
`);

// インデックス作成
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_ip_hash ON sessions(ip_hash, created_at);
  CREATE INDEX IF NOT EXISTS idx_sessions_used ON sessions(used_at) WHERE used_at IS NOT NULL;
`);

console.log('✅ sessions table created');

// gpu_mappingsテーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS gpu_mappings (
    gpu_name TEXT PRIMARY KEY NOT NULL,
    vendor TEXT NOT NULL,
    encoder TEXT NOT NULL,
    preset TEXT NOT NULL,
    max_bitrate INTEGER NOT NULL,
    supports_hevc BOOLEAN DEFAULT 0,
    supports_av1 BOOLEAN DEFAULT 0,
    tier INTEGER NOT NULL,

    CHECK(vendor IN ('nvidia', 'amd', 'intel', 'apple', 'unknown')),
    CHECK(tier BETWEEN 1 AND 3),
    CHECK(max_bitrate > 0)
  );
`);

// インデックス作成
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_gpu_vendor ON gpu_mappings(vendor);
  CREATE INDEX IF NOT EXISTS idx_gpu_tier ON gpu_mappings(tier);
`);

console.log('✅ gpu_mappings table created');

// genre_configsテーブル作成
db.exec(`
  CREATE TABLE IF NOT EXISTS genre_configs (
    genre_id TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL,
    example_games TEXT NOT NULL,
    bitrate_multiplier REAL NOT NULL,
    fps_priority INTEGER NOT NULL,
    quality_priority INTEGER NOT NULL,
    recommended_fps INTEGER NOT NULL,
    keyframe_interval INTEGER NOT NULL,
    audio_bitrate INTEGER NOT NULL DEFAULT 160,

    CHECK(bitrate_multiplier > 0),
    CHECK(fps_priority BETWEEN 1 AND 10),
    CHECK(quality_priority BETWEEN 1 AND 10),
    CHECK(recommended_fps IN (30, 60))
  );
`);

console.log('✅ genre_configs table created');

// 初期データ挿入（GPUマッピング - 最新版）
console.log('📊 Inserting GPU mappings data...');

const gpuMappings = `
-- NVIDIA RTX 50シリーズ Blackwell
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5090', 'nvidia', 'ffmpeg_nvenc', 'p4', 15000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5080 Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 13000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5080', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Ti Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 10500, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p4', 10000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 1, 1);

-- NVIDIA RTX 40シリーズ Ada Lovelace
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4090 D', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4090', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4080 Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 10500, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4080', 'nvidia', 'ffmpeg_nvenc', 'p4', 10000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Ti Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 10000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4060 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 8500, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4060', 'nvidia', 'ffmpeg_nvenc', 'p5', 8000, 1, 0, 2);

-- NVIDIA RTX 30シリーズ Ampere
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3090 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 10000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3090', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3080 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3080', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 8500, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3070', 'nvidia', 'ffmpeg_nvenc', 'p6', 8000, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3060 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 7500, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3060', 'nvidia', 'ffmpeg_nvenc', 'p6', 7000, 1, 0, 2);

-- NVIDIA GTX 16シリーズ
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1660 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 6500, 0, 0, 3);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1660', 'nvidia', 'ffmpeg_nvenc', 'p6', 6000, 0, 0, 3);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1650 Super', 'nvidia', 'ffmpeg_nvenc', 'p7', 5500, 0, 0, 3);
INSERT OR IGNORE INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1650', 'nvidia', 'ffmpeg_nvenc', 'p7', 5000, 0, 0, 3);

-- AMD RX 8000シリーズ RDNA 4
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 8800 XT', 'amd', 'ffmpeg_amf', 'speed', 10000, 1, 1, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 8700 XT', 'amd', 'ffmpeg_amf', 'speed', 9000, 1, 1, 2);

-- AMD RX 7000シリーズ RDNA 3
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 7900 XTX', 'amd', 'ffmpeg_amf', 'speed', 10000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 7800 XT', 'amd', 'ffmpeg_amf', 'speed', 9000, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 7700 XT', 'amd', 'ffmpeg_amf', 'balanced', 8000, 1, 0, 2);

-- AMD RX 6000シリーズ RDNA 2
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 6900 XT', 'amd', 'ffmpeg_amf', 'balanced', 8000, 0, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 6700 XT', 'amd', 'ffmpeg_amf', 'balanced', 7000, 0, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('AMD Radeon RX 6600', 'amd', 'ffmpeg_amf', 'quality', 6000, 0, 0, 3);

-- Intel Arc B シリーズ Battlemage
INSERT OR IGNORE INTO gpu_mappings VALUES ('Intel Arc B580', 'intel', 'ffmpeg_qsv', 'balanced', 7500, 1, 1, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Intel Arc B570', 'intel', 'ffmpeg_qsv', 'balanced', 7000, 1, 1, 2);

-- Intel Arc A シリーズ Alchemist
INSERT OR IGNORE INTO gpu_mappings VALUES ('Intel Arc A770', 'intel', 'ffmpeg_qsv', 'speed', 8000, 1, 1, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Intel Arc A750', 'intel', 'ffmpeg_qsv', 'balanced', 7000, 1, 1, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Intel Arc A380', 'intel', 'ffmpeg_qsv', 'balanced', 6000, 1, 0, 3);

-- Apple Silicon
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M4 Max', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 11000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M4 Pro', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 10000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M4', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 9000, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M3 Max', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 10000, 1, 0, 1);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M2', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 8000, 1, 0, 2);
INSERT OR IGNORE INTO gpu_mappings VALUES ('Apple M1', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 7000, 1, 0, 2);

-- フォールバック
INSERT OR IGNORE INTO gpu_mappings VALUES ('Unknown GPU', 'unknown', 'obs_x264', 'veryfast', 5000, 0, 0, 3);
`;

db.exec(gpuMappings);
console.log('✅ GPU mappings inserted');

// 初期データ挿入（ジャンル設定）
console.log('📊 Inserting genre configs data...');

const genreConfigs = `
INSERT OR IGNORE INTO genre_configs VALUES
('fps-high', '激しいゲーム', 'Apex Legends,VALORANT,Overwatch 2,Call of Duty', 1.0, 10, 7, 60, 2, 160),
('rpg-mid', 'アクションゲーム', '原神,ストリートファイター6,エルデンリング,FF14', 0.85, 7, 9, 60, 2, 160),
('puzzle-low', 'ゆっくりゲーム', '雀魂,ぷよぷよ,Among Us', 0.7, 5, 10, 30, 2, 160),
('chat', '雑談・歌配信', '雑談,歌枠,お絵描き,ASMR', 0.6, 3, 10, 30, 4, 256),
('retro', 'レトロゲーム', 'マリオ,ポケモン,ドラクエ', 0.65, 6, 8, 60, 2, 160);
`;

db.exec(genreConfigs);
console.log('✅ Genre configs inserted');

// 統計情報表示
const gpuCount = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings').get();
const genreCount = db.prepare('SELECT COUNT(*) as count FROM genre_configs').get();

console.log('\n📊 Database Statistics:');
console.log(`  - GPUs: ${gpuCount.count} models`);
console.log(`  - Genres: ${genreCount.count} categories`);
console.log(`  - Location: ${dbPath}`);

db.close();

console.log('\n✨ Database initialization completed!\n');
