import * as SQLite from 'expo-sqlite'

//插入一筆收藏資料
const insertFavorite = async (subtitle, questionID) => {
  const db = await SQLite.openDatabaseAsync('cramForInterview.db')
  await db.runAsync(
    'INSERT INTO Favorite (subtitle, questionID,sort) VALUES (?, ?,999)',
    subtitle,
    questionID,
  )
}

export default insertFavorite
