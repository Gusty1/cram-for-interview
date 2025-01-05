import { getDatabase } from '../common/getDatabase'

// 查詢所有覺得讚的資料
const getAllThumbs = async () => {
  const db = await getDatabase()
  const thumbList = await db.getAllAsync('SELECT * FROM Thumb;')

  return thumbList
};

export default getAllThumbs
