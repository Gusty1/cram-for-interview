import * as SQLite from "expo-sqlite";

// 快取 Promise 本身而非 resolved 值
// 無論多少個並發呼叫，openDatabaseAsync 只會執行一次
let dbPromise = null;

//由於每個方法都openDatabaseAsync會造成Sqlite爆炸，所以改成這樣
export const getDatabase = () => {
  if (!dbPromise) {
    //開啟數據庫，不存在自動創建
    dbPromise = SQLite.openDatabaseAsync("cramForInterview.db");
  }
  return dbPromise;
};
