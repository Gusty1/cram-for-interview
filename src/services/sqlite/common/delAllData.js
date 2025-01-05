import { getDatabase } from './getDatabase'

// 刪除全部資料
const delAll = async () => {
	const db = await getDatabase()

	await db.execAsync(`
			DELETE FROM Favorite;
			DELETE FROM Thumb;
			DELETE FROM SubtitleSort;
		`)

	return true
}

export default delAll
