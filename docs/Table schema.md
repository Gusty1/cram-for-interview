# Table schema

寫入資料庫時都有一些系統預設的欄位，然後表名都會是你的名稱加一堆亂碼`ex: Subject-azycumses5ep3hgw2u3sj3jdxi-dev`​

- id: 系統默認的主鍵，好像可以拿掉，但我覺得還是留著問題會比較少

- \_\_typename: 裡面放當前的表名，不知道意義是甚麼
- createdAt: 建立時間，包含時區的時間，ex: `2024-12-28T16:37:07.874Z`​
- updatedAt: 更新時間

## AWS dynamoDB

### Subject(主題)

| 名稱    | 說明     | 格式    | 主鍵 | 預設 |
| ------- | -------- | ------- | ---- | ---- |
| en_name | 英文名稱 | string  | Y    |      |
| zh_name | 中文名稱 | string  |      |      |
| enable  | 是否啟用 | boolean |      | true |
| image   | 圖片網址 | string  |      |      |

### Subtitle(副主題)

| 名稱    | 說明     | 格式    | 主鍵 | 預設 |
| ------- | -------- | ------- | ---- | ---- |
| subject | 所屬主題 | string  |      |      |
| en_name | 英文名稱 | string  | Y    |      |
| zh_name | 中文名稱 | string  |      |      |
| enable  | 是否啟用 | boolean |      | true |
| image   | 圖片網址 | string  |      |      |

### Question(題目)

| 名稱     | 說明       | 格式    | 主鍵 | 預設 |
| -------- | ---------- | ------- | ---- | ---- |
| subtitle | 所屬副主題 | string  |      |      |
| question | 問題       | string  | Y    |      |
| answer   | 回答       | string  |      |      |
| enable   | 是否啟用   | boolean |      | true |
| useful   | 覺得有料   | int     |      | 0    |

### BugReport(錯誤回報)

| 名稱       | 說明      | 格式               | 主鍵 | 預設 |
| ---------- | --------- | ------------------ | ---- | ---- |
| questionID | 問題ID    | string             | Y    |      |
| email      | 聯繫email | string             |      |      |
| fixContent | 修正內容  | string             |      |      |
| status     | 狀態      | string(接收、完成) |      | 接收 |
| result     | 結果      | string(完成、作廢) |      |      |

### NewQuestion(新題目)

| 名稱     | 說明     | 格式               | 主鍵 | 預設 |
| -------- | -------- | ------------------ | ---- | ---- |
| username | 暱稱     | string             |      |      |
| email    | 電子郵件 | string             |      |      |
| subject  | 主題     | string             | Y    |      |
| subtitle | 子項目   | string             |      |      |
| question | 問題     | string             |      |      |
| answer   | 答案     | string             |      |      |
| images   | 圖片     | string             |      |      |
| status   | 狀態     | string(接收、完成) |      |      |
| result   | 結果     | string(完成、作廢) |      |      |

### Maintain(維護用)

| 名稱          | 說明         | 格式    | 主鍵   | 預設  |
| ------------- | ------------ | ------- | ------ | ----- |
| endDate       | 完成時間     | string  |        |       |
| show          | 是否顯示     | boolean |        | false |
| showText      | 要顯示的文字 | string  |        |       |
| remark        | 備註         | string  |        |       |

```graphql
type Subject @model {
  id: ID!
  en_name: String!
  zh_name: String
  enable: Boolean
  image: String
}

type Subtitle @model {
  id: ID!
  subject: String
  en_name: String!
  zh_name: String
  enable: Boolean
  image: String
}

type Question @model {
  id: ID!
  subtitle: String
  question: String!
  answer: String
  enable: Boolean
  useful: Int
}

type BugReport @model {
  id: ID!
  questionID: String!
  email: String
  fixContent: String!
  status: String
  result: String
}

type NewQuestion @model {
  id: ID!
  username: String
  email: String
  subject: String!
  subtitle: String
  question: String
  answer: String
  images: String
  status: String
  result: String
}

type Maintain @model {
  id: ID!
  endDate: String
  show: Boolean
  showText: String
  remark: String
}
```

‍
