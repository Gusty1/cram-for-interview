/**
 * 設定頁面的樣式設定
 */

import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  // 第一列的樣式
  settingRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  //資訊字的樣式
  tipText: {
    color: 'gray',
    textAlign: 'center'
  },
  //圖片預覽的容器
  imageContainer: {
    flexDirection: 'row', gap: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  //圖片的子容器
  imageItem: {
    width: 110,
    height: 150,
    borderWidth: 1,
    borderRadius: 5
  },
  //送出資料的modal樣式
  sendModal: {
    padding: 20,
    marginHorizontal: 80,
    borderRadius: 10,
  }
})
