const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'sessions.db');
const db = new Database(dbPath);

console.log('📝 Adding GPU name variants for better matching...');

// 既存の GPU を取得
const gpus = db.prepare('SELECT * FROM gpu_mappings').all();

const variants = [];

gpus.forEach((gpu) => {
  const name = gpu.gpu_name;
  
  // "NVIDIA GeForce RTX 3060 Ti" の場合、以下のバリエーションを生成
  if (name.includes(' Ti')) {
    // "NVIDIA GeForce RTX 3060Ti" (スペースなし)
    variants.push(name.replace(/\s+Ti$/, 'Ti'));
    // "NVIDIA RTX 3060 Ti" (GeForce削除)
    variants.push(name.replace(/\s+GeForce/, ''));
  }
  if (name.includes(' Super')) {
    variants.push(name.replace(/\s+Super$/, 'Super'));
    variants.push(name.replace(/\s+GeForce/, ''));
  }
});

// 重複を削除
const uniqueVariants = [...new Set(variants)];
let added = 0;

uniqueVariants.forEach((variantName) => {
  const original = gpus.find(g => g.gpu_name === variantName.replace(/(Ti|Super|Super|XT|XTX)$/, match => ' ' + match));
  if (!original) return;
  
  try {
    db.prepare(`
      INSERT OR IGNORE INTO gpu_mappings 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      variantName,
      original.vendor,
      original.encoder,
      original.preset,
      original.max_bitrate,
      original.supports_hevc,
      original.supports_av1,
      original.tier
    );
    added++;
  } catch (e) {
    // スキップ
  }
});

const count = db.prepare('SELECT COUNT(*) as count FROM gpu_mappings').get();
console.log(`✅ Added ${added} GPU variants`);
console.log(`📊 Total GPU mappings: ${count.count} models`);

db.close();
console.log('✨ GPU variant addition completed!');
