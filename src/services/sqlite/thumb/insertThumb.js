import * as SQLite from 'expo-sqlite'

//插入一筆覺得讚的紀錄
const insertThumb = async (questionID) => {
  const db = await SQLite.openDatabaseAsync('cramForInterview.db')
  await db.runAsync('INSERT INTO Thumb (questionID) VALUES (?)', questionID)
}

export default insertThumb
