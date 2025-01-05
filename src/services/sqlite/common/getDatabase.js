import * as SQLite from 'expo-sqlite';

let dbInstance = null;

//由於每個方法都openDatabaseAsync會造成Sqlite爆炸，所以改成這樣
export const getDatabase = async () => {
	if (!dbInstance) {
		//開啟數據庫，不存在自動創建
		dbInstance = await SQLite.openDatabaseAsync('cramForInterview.db')
	}
	return dbInstance
}