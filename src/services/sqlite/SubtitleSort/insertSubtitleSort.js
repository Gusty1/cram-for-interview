import { getDatabase } from '../common/getDatabase'

//插入一筆子項目資料
const insertSubtitleSort = async (subject, sortJson) => {
  const db = await getDatabase()
  await db.runAsync(
    'INSERT OR REPLACE INTO SubtitleSort (subject,subtitleJsonAry) VALUES (?, ?)',
    subject,
    sortJson
  )
}

export default insertSubtitleSort
