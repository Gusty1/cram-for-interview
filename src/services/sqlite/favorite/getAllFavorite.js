import * as SQLite from 'expo-sqlite'

// 查詢所有收藏資料
const getAllFavorites = async () => {
	const db = await SQLite.openDatabaseAsync('cramForInterview.db')
	const favoriteList = await db.getAllAsync('SELECT * FROM Favorite;')
	
  return favoriteList
};

export default getAllFavorites