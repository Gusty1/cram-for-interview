import * as SQLite from 'expo-sqlite'

//sql lite有大更新，作法完全跟以前不一樣了，哭阿，新版sqlLite用法請去看使用工具說明.md

//這邊不知道會出什麼問題，不過後面加上useNewConnection就可以了
/*const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
    useNewConnection: true
})*/

//初始化，檢查是否要建表
export const init = () => {
    return promise = new Promise(async (resolve) => {
        const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
            useNewConnection: true
        })
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS favoriteQuestion (id INTEGER PRIMARY KEY NOT NULL , questionId TEXT NOT NULL);
        `)
        console.log('db init success')
        resolve('success')
    }).catch((err) => {
        console.log('db init fail')
        reject(err)
    })
}

//寫入新的喜愛問題
export const insertFavorite = (questionId) => {
    //第2個參數是放要寫入SQL的變數(值)
    return promise = new Promise(async (resolve) => {
        const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
            useNewConnection: true
        })
        await db.runAsync('INSERT INTO favoriteQuestion (questionId) VALUES(?)', questionId)
        resolve('success')
    }).catch(err => {
        console.log(err)
    })
}

//查詢是否已是喜愛問題
export const fetchFavorite = (questionId) => {
    return promise = new Promise(async (resolve) => {
        const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
            useNewConnection: true
        })
        //如果查不到會返回null
        const firstRow = await db.getFirstAsync('SELECT * FROM favoriteQuestion WHERE questionId = ?', questionId)
        resolve(firstRow)
    }).catch((err) => {
        console.log(err)
    })
}

//查詢全部喜愛問題
export const fetchFavoriteAll = () => {
    return promise = new Promise(async (resolve) => {
        const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
            useNewConnection: true
        })
        //查詢全部只能這樣遍歷查詢
        const resultAry = []
        for await (const row of db.getEachAsync('SELECT * FROM favoriteQuestion')) {
            resultAry.push({
                id: row.id,
                questionId: row.questionId
            })
        }
        resolve(resultAry)
    })
}

//刪除喜愛問題
export const deleteFavorite = (questionId) => {
    return promise = new Promise(async (resolve) => {
        const db = await SQLite.openDatabaseAsync('favoriteQuestion.db', {
            useNewConnection: true
        })
        await db.runAsync('DELETE FROM favoriteQuestion WHERE questionId =?', questionId)
        resolve('success')
    }).catch((err) => {
        console.log(err)
    })
}
