/**
 * question組件相關的style
 */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  // 問題組件右下的第一個按鈕
  rightBottomBtn1: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 150,
  },
  // 問題組件右下的第2個按鈕
  rightBottomBtn2: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 80,
  },
  //問題組件的bottomView header樣式
  handleStyle: {
    borderColor: "transparent", //不設定透明看不到陰影
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 2, // Android 陰影
  },
  //問題組件的bottomView容器樣式
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
  },
  //問題組件的bottomView內容樣式
  contentStyle: {
    flex: 1,
    marginTop: 10,
    width: "95%",
  },
  //問題組件的左右滑動按鈕
  swiperBtn: {
    position: "absolute",
    bottom: "47%",
    backgroundColor: "transparent",
    zIndex: 20,
  },
})
