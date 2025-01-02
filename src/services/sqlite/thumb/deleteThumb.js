import * as SQLite from 'expo-sqlite'

// 刪除覺得讚的一筆資料
const deleteThumb = async (questionID) => {
	const db = await SQLite.openDatabaseAsync('cramForInterview.db')
	await db.runAsync('DELETE FROM Thumb WHERE questionID  = ? ', questionID)
}

export default deleteThumb
