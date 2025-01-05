import { getDatabase } from '../common/getDatabase'

//插入一筆覺得讚的紀錄
const insertThumb = async (questionID) => {
  const db = await getDatabase()
  await db.runAsync('INSERT OR REPLACE INTO Thumb (questionID) VALUES (?)', questionID)
}

export default insertThumb
