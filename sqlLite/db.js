import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('favoriteQuestion.db')

export const init = () => {
  //在 SQLite 中，如果將列指定為主鍵，則無需指定 AUTOINCREMENT
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        // 'drop table favoriteQuestion',
        'CREATE TABLE IF NOT EXISTS favoriteQuestion (id INTEGER PRIMARY KEY NOT NULL , question TEXT NOT NULL);',
        [],
        () => {
          //成功的回調
          resolve()
        },
        (_, err) => {
          //失敗的回調
          reject(err)
        }
      )
    })
  })
  return promise
}

export const insertFavorite = (question) => {
  //第2個參數是放要寫入SQL的變數(值)
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO favoriteQuestion (question) VALUES(?)',
        [question],
        (_, result) => {
          resolve(result)
        },
        (_, err) => {
          reject(err)
        }
      )
    })
  })
  return promise
}

export const fetchFavorite = (question) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * FROM favoriteQuestion WHERE question = ? ',
        [question],
        (_, result) => {
          resolve(result)
        },
        (_, err) => {
          reject(err)
        }
      )
    })
  })
  return promise
}

export const fetchFavoriteAll = () => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * FROM favoriteQuestion;',
        [],
        (_, result) => {
          resolve(result)
        },
        (_, err) => {
          reject(err)
        }
      )
    })
  })
  return promise
}

export const deleteFavorite = (question) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM favoriteQuestion WHERE question =?',
        [question],
        (_, result) => {
          resolve(result)
        },
        (_, err) => {
          reject(err)
        }
      )
    })
  })
  return promise
}
