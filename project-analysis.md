# cram-for-interview 專案架構分析報告

**審查日期**: 2026-03-28
**最後更新**: 2026-04-02（全部問題處置完成）
**專案版本**: 0.3.0
**技術棧**: React Native 0.81.5 / Expo SDK 54 / React 19.1.0 / Zustand 5
**審查範圍**: 全專案核心代碼

---

## 目錄

1. [專案架構概覽](#一專案架構概覽)
2. [架構評估](#二架構評估)
3. [已知限制與技術債](#三已知限制與技術債)
4. [相依性版本分析](#四相依性版本分析)
5. [架構優點](#五架構優點)
6. [修復歷程摘要](#六修復歷程摘要)

---

## 一、專案架構概覽

```
src/
├── App.js                   # 應用根組件（Amplify 初始化）
├── amplifyconfiguration.js  # AWS Amplify 設定（從環境變數讀取，正確）
├── assets/                  # 字體、圖片、影片靜態資源
├── components/              # 可重用 UI 元件庫
│   ├── MyComponents/        # 通用元件（ErrorView, NoNetModal 等）
│   ├── HomeComponents/      # 首頁元件（Subject, Sentence 等）
│   ├── Questions/           # 題目顯示元件
│   ├── Favorite/            # 收藏元件
│   └── SettingComponents/   # 設定元件
├── constants/               # 應用常數與配置
├── graphql/                 # GraphQL 查詢/變更定義
├── navigation/              # 導航邏輯與畫面組件
│   └── screens/             # 各頁面（HomeScreen, FavoriteScreen 等）
├── services/                # 業務邏輯服務層
│   ├── asyncStorage/        # AsyncStorage 封裝
│   ├── awsDynamoDB/         # GraphQL API 呼叫
│   └── sqlite/              # SQLite 本地資料庫
├── store/                   # Zustand 全局狀態管理
│   ├── settingStore/
│   ├── netStore/
│   ├── sqliteStore/
│   ├── answerShowStore/
│   └── cacheStore/
└── styles/                  # 樣式模組
```

**整體評分**: 架構設計中等偏上，分層清晰。歷次審查發現的問題已全數處置完成。

---

## 二、架構評估

### 正確做法（保持）

| 面向 | 評估 |
|------|------|
| 服務層與 UI 分離 | `services/` 正確封裝所有資料存取，與 UI 元件解耦 |
| 狀態集中管理 | Zustand store 依功能切分為多個 slice，條理清晰 |
| 頁面與元件分離 | `navigation/screens/` 放頁面邏輯，`components/` 放可重用元件 |
| 檔案粒度 | 大多數檔案維持在 50-200 行，高內聚低耦合 |
| 環境變數管理 | `amplifyconfiguration.js` 正確讀取 `EXPO_PUBLIC_` 環境變數 |

### 已知分層問題（接受現狀）

- **Zustand store 合併為單一物件**：6 個 slice 合併成一個 `useStore`，任何 slice 更新都會通知所有訂閱者。拆分為破壞性重構，ROI 過低。selector 模式（`useStore(s => s.xxx)`）已在關鍵路徑使用，可降低無謂 re-render。

---

## 三、已知限制與技術債

### [CRITICAL-2] EXPO_PUBLIC_ 前綴金鑰會內嵌至打包後的 Bundle

**位置**: `src/constants/codeSetting/defaultSetting.js`（第 13 行）

此為 Expo 框架的已知限制。**後續可行的架構改善方向**（非緊急）：
- 針對 Imgur API：在 Imgur Dashboard 設定允許的 Referrer/Domain
- 針對 AWS AppSync API Key：考慮改用 Cognito Identity Pool 實現匿名驗證，以 IAM Role 取代 API Key

---

### [MEDIUM-1] Zustand 訂閱粒度粗糙

同「架構評估」章節說明，此為已知限制，在此規模的個人專案中可接受。

---

### [MEDIUM-5] GraphQL 查詢缺少分頁處理

**位置**: `src/services/awsDynamoDB/question/getQuestions.js`

目前資料規模遠低於 AppSync 的 1000 筆上限。**當單一子類目題目數逼近 500 筆時**，應加入 `nextToken` 迭代邏輯。

---

### [MEDIUM-7] 個人 Email 地址硬編碼

**位置**: `src/constants/codeSetting/emailInfo.js`（第 2 行）

此為 Bug 回報功能的設計意圖，在個人開源專案中明確公開是合理的，無需修改。

---

### [LOW-6] defaultSetting.maintainID 為硬編碼 UUID

**位置**: `src/constants/codeSetting/defaultSetting.js`（第 17 行）

引入 Remote Config（如 Firebase Remote Config）成本過高。此 UUID 穩定不變，若需修改可透過 `EXPO_PUBLIC_` 環境變數提供。現狀可接受。

---

## 四、相依性版本分析

| 套件 | 目前版本 | 狀態 |
|------|---------|------|
| `react` | `19.1.0` | 最新穩定版 |
| `react-native` | `0.81.5` | New Arch 已啟用，合理 |
| `expo` | `^54.0.0` | 目前穩定版 |
| `zustand` | `^5.0.11` | v5 最新穩定版 |
| `@react-navigation/*` | `^7.x` | v7 最新版 |
| `react-native-reanimated` | `4.1.1` | v4 最新版 |
| `aws-amplify` | `^6.16.2` | v6 穩定版 |
| `react-native-worklets` | `0.5.1` | reanimated v4 的配對依賴，需確認相容性矩陣 |
| `eslint` | `^8.57.1` | v8 仍在維護，v9 已發布，可考慮升級 |
| `react-native-draglist` | `^3.10.0` | 非主流套件，需持續追蹤維護狀態 |

> **注意**: `react-native-worklets: 0.5.1` 與 `react-native-reanimated: 4.1.1` 的版本配對，需至官方 reanimated 文件確認相容性表。

---

## 五、架構優點

以下為專案中值得保留的良好設計：

1. **批次查詢優化**: `getCachedQuestionsBatch` 有效解決 N+1 問題
2. **TTL 快取機制**: 5 分鐘 TTL 快取減少不必要的 API 呼叫
3. **分層清晰**: services / store / components / navigation 職責劃分明確
4. **廣泛的效能優化**: 多數元件正確使用 `React.memo`、`useMemo`、`useCallback`
5. **防 SQL 注入**: 所有 SQLite 操作使用 `?` 佔位符
6. **正確的環境變數管理**: `amplifyconfiguration.js` 已正確使用 `EXPO_PUBLIC_`
7. **網路感知**: NetInfo 全局監聽，無網路時彈出提示
8. **錯誤邊界**: `ErrorView` 元件提供全局錯誤邊界保
