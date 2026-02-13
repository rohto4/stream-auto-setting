const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'sessions.db');
const db = new Database(dbPath);

console.log('🗑️  Deleting old GPU mappings...');
db.exec('DELETE FROM gpu_mappings');

console.log('📊 Inserting new GPU mappings...');

const gpuMappings = `
-- NVIDIA RTX 50シリーズ Blackwell
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5090', 'nvidia', 'ffmpeg_nvenc', 'p4', 15000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5080 Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 13000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5080', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Ti Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 10500, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p4', 10000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070 Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 5070', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 1, 1);

-- NVIDIA RTX 40シリーズ Ada Lovelace
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4090 D', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4090', 'nvidia', 'ffmpeg_nvenc', 'p4', 12000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4080 Super', 'nvidia', 'ffmpeg_nvenc', 'p4', 10500, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4080', 'nvidia', 'ffmpeg_nvenc', 'p4', 10000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Ti Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 10000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070 Super', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4070', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4060 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 8500, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 4060', 'nvidia', 'ffmpeg_nvenc', 'p5', 8000, 1, 0, 2);

-- NVIDIA RTX 30シリーズ Ampere
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3090 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 10000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3090', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3080 Ti', 'nvidia', 'ffmpeg_nvenc', 'p5', 9500, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3080', 'nvidia', 'ffmpeg_nvenc', 'p5', 9000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3070 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 8500, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3070', 'nvidia', 'ffmpeg_nvenc', 'p6', 8000, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3060 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 7500, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce RTX 3060', 'nvidia', 'ffmpeg_nvenc', 'p6', 7000, 1, 0, 2);

-- NVIDIA GTX 16シリーズ
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1660 Ti', 'nvidia', 'ffmpeg_nvenc', 'p6', 6500, 0, 0, 3);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1660', 'nvidia', 'ffmpeg_nvenc', 'p6', 6000, 0, 0, 3);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1650 Super', 'nvidia', 'ffmpeg_nvenc', 'p7', 5500, 0, 0, 3);
INSERT INTO gpu_mappings VALUES ('NVIDIA GeForce GTX 1650', 'nvidia', 'ffmpeg_nvenc', 'p7', 5000, 0, 0, 3);

-- AMD RX 8000シリーズ RDNA 4
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 8800 XT', 'amd', 'ffmpeg_amf', 'speed', 10000, 1, 1, 1);
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 8700 XT', 'amd', 'ffmpeg_amf', 'speed', 9000, 1, 1, 2);

-- AMD RX 7000シリーズ RDNA 3
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 7900 XTX', 'amd', 'ffmpeg_amf', 'speed', 10000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 7800 XT', 'amd', 'ffmpeg_amf', 'speed', 9000, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 7700 XT', 'amd', 'ffmpeg_amf', 'balanced', 8000, 1, 0, 2);

-- AMD RX 6000シリーズ RDNA 2
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 6900 XT', 'amd', 'ffmpeg_amf', 'balanced', 8000, 0, 0, 2);
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 6700 XT', 'amd', 'ffmpeg_amf', 'balanced', 7000, 0, 0, 2);
INSERT INTO gpu_mappings VALUES ('AMD Radeon RX 6600', 'amd', 'ffmpeg_amf', 'quality', 6000, 0, 0, 3);

-- Intel Arc B シリーズ Battlemage
INSERT INTO gpu_mappings VALUES ('Intel Arc B580', 'intel', 'ffmpeg_qsv', 'balanced', 7500, 1, 1, 2);
INSERT INTO gpu_mappings VALUES ('Intel Arc B570', 'intel', 'ffmpeg_qsv', 'balanced', 7000, 1, 1, 2);

-- Intel Arc A シリーズ Alchemist
INSERT INTO gpu_mappings VALUES ('Intel Arc A770', 'intel', 'ffmpeg_qsv', 'speed', 8000, 1, 1, 2);
INSERT INTO gpu_mappings VALUES ('Intel Arc A750', 'intel', 'ffmpeg_qsv', 'balanced', 7000, 1, 1, 2);
INSERT INTO gpu_mappings VALUES ('Intel Arc A380', 'intel', 'ffmpeg_qsv', 'balanced', 6000, 1, 0, 3);

-- Apple Silicon
INSERT INTO gpu_mappings VALUES ('Apple M4 Max', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 11000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('Apple M4 Pro', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 10000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('Apple M4', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 9000, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('Apple M3 Max', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'quality', 10000, 1, 0, 1);
INSERT INTO gpu_mappings VALUES ('Apple M2', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 8000, 1, 0, 2);
INSERT INTO gpu_mappings VALUES ('Apple M1', 'apple', 'com.apple.videotoolbox.videoencoder.h264', 'balanced', 7000, 1, 0, 2);

-- フォールバック
INSERT INTO gpu_mappings VALUES ('Unknown GPU', 'unknown', 'obs_x264', 'veryfast', 5000, 0, 0, 3);
`;

db.exec(gpuMappings);

const count = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings').get();
console.log(`✅ GPU mappings: ${count.count} models`);
db.close();
console.log('✨ GPU database reset completed!');
