import { getDatabase } from '../common/getDatabase'

// 查詢所有收藏資料
const getAllFavorites = async () => {
	const db = await getDatabase()
	const favoriteList = await db.getAllAsync('SELECT * FROM Favorite;')

	return favoriteList
};

export default getAllFavorites