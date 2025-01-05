import { getDatabase } from '../common/getDatabase'

// 查詢全部的子項目排序資料
const getSubtitleSort = async (subject) => {
	const db = await getDatabase()
	const subtitleSort = await db.getAllAsync(`SELECT * FROM SubtitleSort 
		WHERE subject = ? ;`, subject)

	return subtitleSort
}

export default getSubtitleSort