/**
 * 通用樣式設定
 */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  // 一般主要容器設定
  mainContainer: {
    flex: 1,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  //沒有網路modal的容器
  noErrModalContainer: {
    flex: 1,
    backgroundColor: 'lightgray',
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginHorizontal: 30,
    marginVertical: 70,
    borderRadius: 10,
  },
  //沒有網路modal的顯示文字
  noNetText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  //預設loading
  defaultLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //固定右下角的按鈕
  rightBottomBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  questionActionBtnSize: 24,
})
