# AGENTS.md — cram-for-interview

> This document provides operational guidance for AI agents (Claude Code, etc.) working in this repository.
> Stack: React Native 0.81.5 / Expo SDK 54 / React 19.1.0 / Zustand 5

---

## Project Overview

**cram-for-interview** is an Expo mobile app for interview preparation (quiz-style flashcards), targeting Android and iOS.
Data source: AWS AppSync (GraphQL) + DynamoDB. Local persistence: expo-sqlite + AsyncStorage.

---

## Directory Structure (Key Paths)

```
src/
├── App.js                          # Root component, Amplify initialization
├── amplifyconfiguration.js         # AWS config (reads EXPO_PUBLIC_* env vars)
├── components/
│   ├── MyComponents/               # Shared components (ErrorView, NoNetModal, MaintainModal…)
│   ├── HomeComponents/             # Home screen components (Subject, SubtitleList, Sentence…)
│   ├── Questions/                  # Question display (Questions, QuestionBottomView…)
│   ├── Favorite/                   # Favorites list
│   └── SettingComponents/          # Settings screen components
├── constants/
│   ├── codeSetting/                # App-level constants (defaultSetting, navigationSetting…)
│   └── setting/                    # User settings defaults
├── graphql/                        # AppSync queries / mutations / subscriptions
├── navigation/
│   ├── AppNavigator.js             # Bottom tab navigator
│   └── screens/
│       ├── HomeScreen/             # SubjectScreen → SubtitleScreen → QuestionScreen
│       ├── FavoriteScreen/         # Favorites screen
│       └── SettingScreen/          # Settings screen (includes AddQuestion)
├── services/
│   ├── asyncStorage/               # User settings read/write
│   ├── awsDynamoDB/                # GraphQL API wrappers (subject/subtitle/question/maintain)
│   ├── axios/                      # Imgur image upload
│   └── sqlite/                     # Local DB (favorite, thumb, SubtitleSort, common)
├── store/                          # Zustand slices (setting/net/sqlite/answerShow/cache)
└── styles/                         # Centralized style modules
```

---

## Environment Variables

`.env` must define the following `EXPO_PUBLIC_` prefixed variables (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_AWS_APPSYNC_ENDPOINT` | AppSync GraphQL endpoint |
| `EXPO_PUBLIC_AWS_API_KEY` | AppSync API Key |
| `EXPO_PUBLIC_AWS_REGION` | AWS region |
| `EXPO_PUBLIC_IMGUR_CLIENT_ID` | Imgur API client ID |

> **Never** hardcode any of the above values in source code.

---

## Development Commands

```bash
# Start Metro bundler
npm start

# Target specific platform
npm run android
npm run ios

# Lint (includes Prettier)
npx eslint src/
```

> This project has **no test suite** — there is no `npm test` command. Verify changes manually on a device or simulator.

---

## Architecture Conventions (Read Before Modifying)

### Layer Rules

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| UI | `components/`, `navigation/screens/` | Rendering and event handling only |
| State | `store/` | Zustand slices, cross-component shared state |
| Service | `services/` | All IO (network, DB, AsyncStorage) |
| Constants | `constants/` | Immutable configuration values |

**Prohibited**: Calling `services/` directly from UI components. Use Zustand actions or the Screen layer as intermediary.

### State Management

- All global stores are combined into a single `useStore` (`src/store/index.js`)
- Always use selectors when reading: `useStore(s => s.xxx)` — avoids unnecessary re-renders
- Cache strategy: `cacheStore` uses 5-minute TTL, batch queries to avoid N+1

### SQLite

- All SQLite operations must use `?` placeholders — string-concatenated SQL is prohibited
- Get DB connection via singleton: `src/services/sqlite/common/getDatabase.js`
- DB is initialized in `sqliteInit.js`, called once at app startup

### Network Awareness

- `netStore` listens to NetInfo; shows `NoNetModal` when offline
- All API calls should check network status first

---

## Common Modification Scenarios

### Add a Question Field

1. Update the GraphQL query in `src/graphql/queries.js`
2. Update data mapping in `src/services/awsDynamoDB/question/getQuestions.js`
3. Update render logic in `src/components/Questions/Questions.js`
4. If local persistence is needed, update `src/services/sqlite/` operations and `sqliteInit.js` schema

### Add a SQLite Table

1. Add CRUD operation files under `src/services/sqlite/<feature>/`
2. Add `CREATE TABLE IF NOT EXISTS` to `src/services/sqlite/common/sqliteInit.js`
3. Add a corresponding slice in `src/store/sqliteStore/`, export it from `src/store/index.js`

### Add a Navigation Screen

1. Create the screen component at `src/navigation/screens/<ScreenName>/index.js`
2. Register the route in `src/navigation/AppNavigator.js`
3. If a custom header is needed, update `src/constants/codeSetting/navigationSetting.js`

### Modify User Settings

- Default values: `src/constants/setting/setting.js`
- Read/write logic: `src/services/asyncStorage/getSettingData.js` / `setSettingData.js`
- Global state: `src/store/settingStore/settingStore.js`

---

## Known Limitations (Do Not Re-Report)

| Issue | Location | Notes | Decision |
|-------|----------|-------|----------|
| `EXPO_PUBLIC_*` keys embedded in bundle | `src/constants/codeSetting/defaultSetting.js` L13 | Expo framework constraint; unavoidable | Accept as-is; Imgur can use Referrer allowlist; AppSync can consider Cognito Identity Pool to replace API Key |
| Coarse Zustand subscription granularity | `src/store/index.js` | 6 slices merged into single `useStore`; any slice update notifies all subscribers; splitting is a breaking refactor with low ROI | Accept as-is; critical paths already use `useStore(s => s.xxx)` selectors |
| GraphQL lacks pagination | `src/services/awsDynamoDB/question/getQuestions.js` | Current data volume is well below AppSync's 1000-item limit | Add `nextToken` iteration logic when any subtitle approaches 500 items |
| `maintainID` hardcoded UUID | `src/constants/codeSetting/defaultSetting.js` L17 | Stable value; Remote Config cost not justified | Accept as-is; can switch to `EXPO_PUBLIC_` env var if change is needed |
| Personal email hardcoded | `src/constants/codeSetting/emailInfo.js` L2 | Intentional design for bug report feature; acceptable in a personal open-source project | Accept as-is; no action needed |

---

## Architecture Evaluation

### What Is Working Well (Preserve)

| Aspect | Assessment |
|--------|------------|
| Service layer / UI separation | `services/` correctly encapsulates all data access, decoupled from UI components |
| Centralized state management | Zustand store split into feature-based slices, well-organized |
| Screen / component separation | `navigation/screens/` holds page logic; `components/` holds reusable components |
| File granularity | Most files stay within 50–200 lines; high cohesion, low coupling |
| Environment variable management | `amplifyconfiguration.js` correctly reads `EXPO_PUBLIC_` env vars |

### Architecture Strengths

1. **Batch query optimization**: `getCachedQuestionsBatch` effectively solves the N+1 problem
2. **TTL caching**: 5-minute TTL cache reduces unnecessary API calls
3. **Clear layering**: services / store / components / navigation have well-defined responsibilities
4. **Broad performance optimization**: Most components correctly use `React.memo`, `useMemo`, `useCallback`
5. **SQL injection prevention**: All SQLite operations use `?` placeholders
6. **Correct env var management**: `amplifyconfiguration.js` uses `EXPO_PUBLIC_` correctly
7. **Network awareness**: NetInfo global listener shows a prompt when offline
8. **Error boundaries**: `ErrorView` component provides global error boundary protection

---

## Dependency Versions

| Package | Version | Notes |
|---------|---------|-------|
| `react` | `19.1.0` | Latest stable |
| `react-native` | `0.81.5` | New Architecture enabled |
| `expo` | `^54.0.0` | Current stable |
| `zustand` | `^5.0.11` | v5 latest stable |
| `@react-navigation/*` | `^7.x` | v7 latest |
| `react-native-reanimated` | `4.1.1` | v4 latest |
| `aws-amplify` | `^6.16.2` | v6 stable |
| `react-native-worklets` | `0.5.1` | Paired dependency for reanimated v4; verify compatibility matrix on upgrade |
| `eslint` | `^8.57.1` | v9 is available; consider upgrading |
| `react-native-draglist` | `^3.10.0` | Non-mainstream package; monitor maintenance status |

---

## Prohibited Actions

- Do not store `.env` or any plaintext credentials inside `src/`
- Do not access SQLite or AsyncStorage directly from component layer
- Do not remove the `ErrorView` wrapper from `react-native-error-boundary`
- Do not issue API requests without checking `netStore` network status first
- SQL statements must never use string concatenation — always use `?` placeholders

---

## Technical Debt Tracking

For newly discovered issues, update the "Known Limitations" section in this document or open a dedicated issue.
