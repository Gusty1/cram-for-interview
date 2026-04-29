# AGENTS.md — cram-for-interview

> 本文件為 AI 代理（Claude Code 等）提供專案操作指引。
> 技術棧：React Native 0.81.5 / Expo SDK 54 / React 19.1.0 / Zustand 5

---

## 專案概覽

**cram-for-interview** 是一款 Expo 行動應用，提供面試題目刷題功能，支援 Android / iOS。
資料來源：AWS AppSync (GraphQL) + DynamoDB；本地持久化：expo-sqlite + AsyncStorage。

---

## 目錄結構（關鍵路徑）

```
src/
├── App.js                          # 根組件，Amplify 初始化
├── amplifyconfiguration.js         # AWS 設定（讀取 EXPO_PUBLIC_* 環境變數）
├── components/
│   ├── MyComponents/               # 通用元件（ErrorView, NoNetModal, MaintainModal…）
│   ├── HomeComponents/             # 首頁元件（Subject, SubtitleList, Sentence…）
│   ├── Questions/                  # 題目顯示（Questions, QuestionBottomView…）
│   ├── Favorite/                   # 收藏清單
│   └── SettingComponents/          # 設定頁元件
├── constants/
│   ├── codeSetting/                # 應用級常數（defaultSetting, navigationSetting…）
│   └── setting/                    # 使用者設定預設值
├── graphql/                        # AppSync queries / mutations / subscriptions
├── navigation/
│   ├── AppNavigator.js             # 底部 Tab 導航
│   └── screens/
│       ├── HomeScreen/             # SubjectScreen → SubtitleScreen → QuestionScreen
│       ├── FavoriteScreen/         # 收藏頁
│       └── SettingScreen/          # 設定頁（含 AddQuestion）
├── services/
│   ├── asyncStorage/               # 使用者設定讀寫
│   ├── awsDynamoDB/                # GraphQL API 封裝（subject/subtitle/question/maintain）
│   ├── axios/                      # Imgur 圖片上傳
│   └── sqlite/                     # 本地 DB（favorite, thumb, SubtitleSort, common）
├── store/                          # Zustand slices（setting/net/sqlite/answerShow/cache）
└── styles/                         # 集中樣式模組
```

---

## 環境變數

`.env` 需設定以下 `EXPO_PUBLIC_` 前綴變數（參考 `.env.example`）：

| 變數 | 用途 |
|------|------|
| `EXPO_PUBLIC_AWS_APPSYNC_ENDPOINT` | AppSync GraphQL endpoint |
| `EXPO_PUBLIC_AWS_API_KEY` | AppSync API Key |
| `EXPO_PUBLIC_AWS_REGION` | AWS region |
| `EXPO_PUBLIC_IMGUR_CLIENT_ID` | Imgur API client id |

> **禁止** 在程式碼中硬編碼以上任何值。

---

## 開發指令

```bash
# 啟動 Metro bundler
npm start

# 指定平台
npm run android
npm run ios

# Lint 檢查（含 Prettier）
npx eslint src/
```

> 本專案**無測試套件**，沒有 `npm test` 指令。修改時請手動在裝置 / 模擬器上驗證。

---

## 架構約定（修改前必讀）

### 分層規則

| 層 | 目錄 | 職責 |
|----|------|------|
| UI | `components/`, `navigation/screens/` | 僅負責渲染與事件 |
| 狀態 | `store/` | Zustand slices，跨元件共享狀態 |
| 服務 | `services/` | 所有 IO（網路、DB、AsyncStorage） |
| 常數 | `constants/` | 不可變設定值 |

**禁止**：在 UI 元件內直接呼叫 `services/`，應透過 Zustand action 或 Screen 層中介。

### 狀態管理

- 全域 store 合併為單一 `useStore`（`src/store/index.js`）
- 讀取時**務必**使用 selector：`useStore(s => s.xxx)`，避免無謂 re-render
- 快取策略：`cacheStore` 使用 TTL 5 分鐘，批次查詢避免 N+1

### SQLite

- 所有 SQLite 操作使用 `?` 佔位符，禁止字串拼接 SQL
- DB 連線透過 `src/services/sqlite/common/getDatabase.js` 取得 singleton
- DB 初始化於 `sqliteInit.js`，應用啟動時呼叫一次

### 網路感知

- `netStore` 監聽 NetInfo，無網路時顯示 `NoNetModal`
- 所有 API 呼叫前應確認網路狀態

---

## 常見修改場景

### 新增題目欄位

1. 更新 `src/graphql/queries.js` 的 GraphQL query
2. 更新 `src/services/awsDynamoDB/question/getQuestions.js` 資料映射
3. 更新 `src/components/Questions/Questions.js` 渲染邏輯
4. 若需本地持久化，更新 `src/services/sqlite/` 對應操作與 `sqliteInit.js` schema

### 新增 SQLite 資料表

1. 在 `src/services/sqlite/<feature>/` 新增 CRUD 操作檔案
2. 在 `src/services/sqlite/common/sqliteInit.js` 加入 `CREATE TABLE IF NOT EXISTS`
3. 在 `src/store/sqliteStore/` 新增對應 slice，匯出至 `src/store/index.js`

### 新增導航頁面

1. 在 `src/navigation/screens/<ScreenName>/index.js` 建立 Screen 元件
2. 在 `src/navigation/AppNavigator.js` 註冊路由
3. 若需設定 header，在 `src/constants/codeSetting/navigationSetting.js` 更新

### 修改使用者設定

- 預設值定義：`src/constants/setting/setting.js`
- 讀寫邏輯：`src/services/asyncStorage/getSettingData.js` / `setSettingData.js`
- 全域狀態：`src/store/settingStore/settingStore.js`

---

## 已知限制（勿重複提報）

| 問題 | 位置 | 說明 | 決策 |
|------|------|------|------|
| `EXPO_PUBLIC_*` 金鑰內嵌 bundle | `src/constants/codeSetting/defaultSetting.js` L13 | Expo 框架限制，無法完全迴避 | 接受現狀；Imgur 可設 Referrer 白名單，AppSync 後續可評估 Cognito Identity Pool 取代 API Key |
| Zustand 訂閱粒度粗糙 | `src/store/index.js` | 6 slice 合為單一 `useStore`，任何 slice 更新都會通知所有訂閱者；拆分為破壞性重構，ROI 過低 | 接受現狀；關鍵路徑已用 `useStore(s => s.xxx)` selector |
| GraphQL 缺分頁 | `src/services/awsDynamoDB/question/getQuestions.js` | 現有資料量遠低於 AppSync 1000 筆上限 | 待單一子類目題目數逼近 500 筆時加入 `nextToken` 迭代邏輯 |
| `maintainID` 硬編碼 UUID | `src/constants/codeSetting/defaultSetting.js` L17 | 穩定值，Remote Config 成本過高 | 接受現狀；若需修改可改以 `EXPO_PUBLIC_` 環境變數提供 |
| 個人 Email 硬編碼 | `src/constants/codeSetting/emailInfo.js` L2 | Bug 回報功能設計意圖，個人開源專案明確公開合理 | 接受現狀，無需修改 |

---

## 架構評估

### 正確做法（保持）

| 面向 | 評估 |
|------|------|
| 服務層與 UI 分離 | `services/` 正確封裝所有資料存取，與 UI 元件解耦 |
| 狀態集中管理 | Zustand store 依功能切分為多個 slice，條理清晰 |
| 頁面與元件分離 | `navigation/screens/` 放頁面邏輯，`components/` 放可重用元件 |
| 檔案粒度 | 大多數檔案維持在 50–200 行，高內聚低耦合 |
| 環境變數管理 | `amplifyconfiguration.js` 正確讀取 `EXPO_PUBLIC_` 環境變數 |

### 架構優點

1. **批次查詢優化**：`getCachedQuestionsBatch` 有效解決 N+1 問題
2. **TTL 快取機制**：5 分鐘 TTL 快取減少不必要的 API 呼叫
3. **分層清晰**：services / store / components / navigation 職責劃分明確
4. **廣泛的效能優化**：多數元件正確使用 `React.memo`、`useMemo`、`useCallback`
5. **防 SQL 注入**：所有 SQLite 操作使用 `?` 佔位符
6. **正確的環境變數管理**：`amplifyconfiguration.js` 已正確使用 `EXPO_PUBLIC_`
7. **網路感知**：NetInfo 全局監聽，無網路時彈出提示
8. **錯誤邊界**：`ErrorView` 元件提供全局錯誤邊界保護

---

## 相依性版本

| 套件 | 版本 | 備註 |
|------|------|------|
| `react` | `19.1.0` | 最新穩定版 |
| `react-native` | `0.81.5` | New Arch 已啟用 |
| `expo` | `^54.0.0` | 目前穩定版 |
| `zustand` | `^5.0.11` | v5 最新穩定版 |
| `@react-navigation/*` | `^7.x` | v7 最新版 |
| `react-native-reanimated` | `4.1.1` | v4 最新版 |
| `aws-amplify` | `^6.16.2` | v6 穩定版 |
| `react-native-worklets` | `0.5.1` | reanimated v4 配對依賴，升版時須確認相容性矩陣 |
| `eslint` | `^8.57.1` | v9 已發布，可考慮升級 |
| `react-native-draglist` | `^3.10.0` | 非主流套件，需持續追蹤維護狀態 |

---

## 禁止事項

- 不得在 `src/` 中存放 `.env` 或任何明文金鑰
- 不得在元件層直接操作 SQLite 或 AsyncStorage
- 不得移除 `react-native-error-boundary` 的 `ErrorView` 包裝
- 不得在沒有確認 `netStore` 狀態的情況下直接發送 API 請求
- SQL 語句禁止字串拼接，一律用 `?` 佔位符

---

## 技術債追蹤

新發現的問題請直接更新本文件的「已知限制」章節，或新增獨立的 issue。
