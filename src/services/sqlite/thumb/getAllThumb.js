import * as SQLite from 'expo-sqlite'

// 查詢所有覺得讚的資料
const getAllThumbs = async () => {
  const db = await SQLite.openDatabaseAsync('cramForInterview.db')
  const thumbList = await db.getAllAsync('SELECT * FROM Thumb;')

  return thumbList
};

export default getAllThumbs
