import { getDatabase } from '../common/getDatabase'

// 刪除收藏一筆資料
const deleteFavorite = async (questionID) => {
  const db = await getDatabase()
  await db.runAsync('DELETE FROM Favorite WHERE questionID  = ? ', questionID)
}

export default deleteFavorite
