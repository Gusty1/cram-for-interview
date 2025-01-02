import * as SQLite from 'expo-sqlite'

// 刪除收藏一筆資料
const deleteFavorite = async (questionID) => {
  const db = await SQLite.openDatabaseAsync('cramForInterview.db')
  await db.runAsync('DELETE FROM Favorite WHERE questionID  = ? ', questionID)
}

export default deleteFavorite
