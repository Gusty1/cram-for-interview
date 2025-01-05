import { getDatabase } from './getDatabase'

const sqliteInit = async () => {
  const db = await getDatabase()

  //創建subtitle排序的表、覺得讚的表、創建歡的表
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS SubtitleSort (
      subject TEXT PRIMARY KEY,
      subtitleJsonAry TEXT
    );
    
    CREATE TABLE IF NOT EXISTS Thumb (
      questionID TEXT PRIMARY KEY
    );
    
    CREATE TABLE IF NOT EXISTS Favorite (
      questionID TEXT PRIMARY KEY,
      subtitle TEXT,
      subtitleShow TEXT,
      subject TEXT
		);`)

  return true;
}

export default sqliteInit
