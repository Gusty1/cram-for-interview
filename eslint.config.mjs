import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginReactNative from 'eslint-plugin-react-native'
import pluginPrettier from 'eslint-plugin-prettier'
import babelParser from '@babel/eslint-parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    extends: [
      'eslint:recommended', // 使用預設的 ESLint 規則
      'plugin:react/recommended', // 使用 React 的預設規則
      'plugin:prettier/recommended', // 整合 Prettier
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'], // 適用於 JavaScript 和 JSX 檔案
  },
  {
    ignores: ['node_modules'], // 忽略 node_modules 資料夾
  },
  {
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新的 ECMAScript 語法
      sourceType: 'module', // 使用 ES 模組
      globals: globals.browser, // 定義全域變數
      parser: babelParser, // 使用 Babel 作為解析器
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'], // 支援 React 的語法
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-native': pluginReactNative,
      prettier: pluginPrettier,
    },
    rules: {
      quotes: ['error', 'single'], // 強制使用單引號
      semi: ['error', 'never'], // 禁用分號
      'react/react-in-jsx-scope': 'off', // 關閉 React 需要在 JSX 中的作用域規則
      'react/prop-types': 'off', // 關閉 prop-types 規則
      'react-native/no-inline-styles': 'off', // 關閉 React Native 禁用行內樣式的規則
      'newline-per-chained-call': ['error', { ignoreChainWithDepth: 2 }], // 控制鏈式調用的換行
    },
    settings: {
      react: {
        version: 'detect', // 自動偵測 React 的版本
      },
    },
  },
  pluginJs.configs.recommended, // 使用 JavaScript 預設規則
  pluginReact.configs.flat.recommended, // 使用 React 扁平化的預設規則
  'plugin:react/jsx-runtime', // 使用 JSX Runtime 支援
]
