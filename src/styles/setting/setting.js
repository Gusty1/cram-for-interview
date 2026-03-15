/**
 * 設定頁面的樣式設定
 */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  //資訊字的樣式
  tipText: {
    color: '#999',
    textAlign: 'center'
  },
  //Snackbar 外層容器（row + center 讓 Snackbar 縮至內容寬度）
  snackbarOuter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  //底部提示訊息條（自適應寬度）
  snackbar: {
    flexGrow: 0,
    flexShrink: 1,
    marginBottom: 30,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
})
