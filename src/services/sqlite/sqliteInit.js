import * as SQLite from 'expo-sqlite'

const sqliteInit = async () => {
  //開啟數據庫，不存在自動創建
  const db = await SQLite.openDatabaseAsync('cramForInterview.db')

  // 創建覺得讚的表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Thumb (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionID TEXT
    );`)

  //創建歡的表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS Favorite (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				subtitle TEXT,
				questionID TEXT,
        sort INTEGER
		);`)

  return db
}

export default sqliteInit
