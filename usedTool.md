# 用過的工具

## sqlLite

本專案使用 expo，而 expo 也有提供 sqlLite 的相關工具
[官方文件](https://docs.expo.dev/versions/latest/sdk/sqlite/ 'SQLite')

```javascript
可以像影片交的一樣，把SQL方法都放在另外一包，啟動的時候引用init；
然後要使用其他方法實在另外引用。
基本上就跟一般SQL差不多，有些資料型別可能會不太一樣

import * as SQLite from 'expo-sqlite'

//開啟資料庫，如果資料庫不存在會建一個新的
const db = SQLite.openDatabase('favoriteQuestion.db')

export const init = () => {
  //在 SQLite 中，如果將列指定為主鍵，則無需指定 AUTOINCREMENT
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //編寫SQL語句
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favoriteQuestion (id INTEGER PRIMARY KEY NOT NULL , questionId TEXT NOT NULL);',
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

export const insertFavorite = (questionId) => {
  //第2個參數是放要寫入SQL的變數(值)
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO favoriteQuestion (questionId) VALUES(?)',
        [questionId],
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

export const fetchFavoriteById = (questionId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'select * FROM favoriteQuestion WHERE questionId = ? ',
        [questionId],
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

export const deleteFavoriteById = (questionId) => {
  const promise = new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM favoriteQuestion WHERE questionId =?',
        [questionId],
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

```

## aws DynamicDB

先說結論，AWS 比 Google 難用 100 倍。

### 安裝、設定

1. 先裝 Amplify CLI ，[官方說明](https://docs.amplify.aws/cli/start/install/ '官方說明')
2. 照官方範例設定 React Native connect DynamicDB [官方範例](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/build-a-serverless-react-native-mobile-app-by-using-aws-amplify.html '官方範例')
3. 1、2 步都完成後，你的專案應該會多 2 個資料夾，一個叫 amplify，另一個叫 src。

   - **amplify**: 裡面應該是 AWS 自己的一些設定檔，比較會用到的只有/backend/api/schema.graphql。這裡面放的是你的資料庫設定，簡單來說就是你的 table schema。
   - **src**: 資料庫的操作方式(CURD)，要操作資料庫要引用這裡面的檔案。
     - **mutations.js**: 放新增、刪除、修改方法。
     - **queries.js**: 放查詢方法，有分單、多個查詢。

上述步驟完成後可以輸入 amplify console 去網頁控制台查看，主要就是看有沒有新增 API。
![api](assets\usedTools\AWSapi.png 'API啟用')

### 使用

#### 新增 model(新增 table)

schema.graphql 應該會有一個預設的 todo model，要自己新增就參考那個 todo，自己建一個新的 model。

```javascript
//建一個名為Subject的model。一張表好像最少要有 2 個!，一個是主鍵，另一個是什麼 index
type Subject @model {
id: ID! //!應該是代表 not null，ID 可以不管就這樣寫就好
name: String!
chineseName: String
}
/*
  欄位有以下幾種
  Int: A signed 32‐bit integer.
  Float: A signed double-precision floating-point value.
  String: A UTF‐8 character sequence.
  Boolean: true or false.
*/
```

改完後輸入

```javascript
amplify push
//跑的時候會問你很多問題，基本上都選 YES 就對了。

//如果是要刪除model 指定要改成
amplify push --allow-destructive-graphql-schema-updates
```

跑完你的 src/graphql/mutations.js、src/graphql/queries.js 應該會新增幾個跟你剛剛建的 model 名字有關的方法

#### 主程式設定

```javascript
//在你的主程式App.js、index.js 加入下方程式
import { Amplify } from 'aws-amplify'
import awsmobile from './src/aws-exports' //跑完應該會自動產生這個設定檔
Amplify.configure(awsmobile)
```

如果啟動失敗可以試試清除快取再啟動 npx expo start -c

#### 基本操作方法

複雜的查詢方法，in、>、<...還沒研究出來 ˊ_ˋ

```javascript
//從mutations引用要用到的新刪修方法
import {
  createSubject,
  deleteSubject,
  updateTodo,
} from '../src/graphql/mutations'
//從queries引用要用到的查詢方法
import { getSubject, listSubjects } from '../src/graphql/queries'

async function fetchSubjects() {
  //根據條件查詢 API.graphql(graphqlOperation(listSubjects,{filter:{條件}}))
  //條件是一個物件，類似noSQL的查詢方法一樣
  await API.graphql(graphqlOperation(listSubjects,{
      filter: {
          //欄位名稱
          typeName: {
            //=你的值
            eq: 'subjectName',
          },
          subtitleName: {
            eq: 'subtitleName',
          },
      },
    }
    )).then((response) => {
    //資料會放在response.data.listSubjects.items。是一個[]
    response.data.listSubjects.items
  })

  //根據ID查詢
  await API.graphql(graphqlOperation(getSubject, { id: 'id' })).then(
    (response) => {
      //資料在response.data.getQuestion。是一個{}
      response.data.getQuestion
    }
  )

  //參數有{input:{你的參數} condition:{條件}}
  //刪除、更新都和新增一樣，以下用新增當範例
  await API.graphql(
    graphqlOperation(createSubject, {
      input: {
        name: 'mechanical',
        chineseName: '機械',
      },
      condition:{...}
    })
  ).then((response)=>{
    //新增的話是回傳一個{}，裡面放你剛剛新增的資料
    response.data
    //刪除、修改沒試過，因為GUI就可以直接修改刪除...
  })
}
```

#### API 金鑰

金鑰會過期，過期的話會出現 401 錯誤，
檢查或修改期限請至 amplify console->API->在 AppSync 中檢視->Settings

#### 權限設定(不會用)

一個有關身分驗證的東西，用這個就會在你程式啟動的時候跳一個登入畫面，但登入後就會有一些什麼權限問題，SO 不懂暫時跳過。
使用者相關的東西可以去 amplify console 看。

```javascript
import { withAuthenticator } from 'aws-amplify-react-native'

//把你的主程式用withAuthenticator包住
withAuthenticator(function App() {...})

```
