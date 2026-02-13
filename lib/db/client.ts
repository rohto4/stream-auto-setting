/**
 * SQLiteデータベース接続クライアント
 * better-sqlite3を使用したシンプルなDB操作
 */

import Database from 'better-sqlite3';
import path from 'path';

// データベースファイルパス
const dbPath = path.join(process.cwd(), 'data', 'sessions.db');

let dbInstance: Database.Database | null = null;

/**
 * DBインスタンス取得（シングルトン）
 */
export function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath);

    // パフォーマンス最適化
    dbInstance.pragma('journal_mode = WAL');
    dbInstance.pragma('synchronous = NORMAL');
    dbInstance.pragma('cache_size = -64000'); // 64MB
  }

  return dbInstance;
}

/**
 * DB接続をクローズ
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// プロセス終了時にDB接続をクローズ
if (typeof process !== 'undefined') {
  process.on('exit', () => closeDb());
  process.on('SIGINT', () => {
    closeDb();
    process.exit(0);
  });
}
