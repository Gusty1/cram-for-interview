# AWS dynamoDB使用說明

一開始有設定關聯，但查的時候完全不會顯示，而且新增還一直卡我，所以後來就都拿掉了，aws DynamoDB好難...

目前是使用公開api去新增，肯定是不安全的，但這樣問題會最少，先這樣剩下之後再說

## Amplify相關指令

### amplify init

初始化，如果遇到問題可以直接把amplify資料夾刪掉，重新初始化，這樣最快

他們最新是用第2版，一開始會問你要不要繼續用1版，選是，因為網路上都是第一版的資料

### amplify add 功能

* ​`amplify add api`​: 增加api功能，這樣才可以操作資料庫

### amplify console

會開啟網頁進入控制台，裡面可以看到很多你的東西，如果是第一次記得進去找一個`amplify pull`​的指令，不知道是做什麼，但感覺先用一下會比較好

### amplify push

簡單說就是修改模型(model)的時候記得要輸入這個指令才可以更新網路上的資料庫，更新的時候會問你要不要建立一些默認的查詢之類的，一律選是，不然之後會很麻煩

如果有刪除model的操作指令要加`--allow-destructive-graphql-schema-updates`​

### amplify update api

更新api設定，如果api過期可以用這個更新，不要設定auth

## 資料庫操作

* ​`queries.js`​: 查詢只能用這裡面的方法，可以查詢多個或單個，多個可以根據條件查詢，單個好像只能用id查詢
* ​`mutations.js`​: 新增、修改、刪除只能用這裡面的方法，可以用postman去操作，表要刪的話用push直接覆蓋過去，不然會有問題
