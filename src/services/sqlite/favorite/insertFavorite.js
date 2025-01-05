import { getDatabase } from '../common/getDatabase'

//插入一筆收藏資料
const insertFavorite = async (subtitle, subtitleShow, subject, questionID) => {
  const db = await getDatabase()
  await db.runAsync(
    'INSERT OR REPLACE INTO Favorite (questionID,subtitle,subtitleShow,subject) VALUES (?, ?, ?,?)',
    questionID,
    subtitle,
    subtitleShow,
    subject
  )
}

export default insertFavorite
