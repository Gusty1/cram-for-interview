import { getDatabase } from '../common/getDatabase'

// 刪除覺得讚的一筆資料
const deleteThumb = async (questionID) => {
  const db = await getDatabase()
	await db.runAsync('DELETE FROM Thumb WHERE questionID  = ? ', questionID)
}

export default deleteThumb
