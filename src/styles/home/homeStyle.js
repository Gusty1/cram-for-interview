/**
 * Home螢幕相關的style
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // 每日一句的容器
  sentenceContainer: {
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  //每日一句的title row
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'nowrap',
  },
  //subtitleFilterModal的容器
  subtitleFilterModalContainer: {
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  //subtitleFilterModal的主要螢幕
  subtitleFilterModalMainView: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  //subtitleFilterModal的chip螢幕
  subtitleFilterModalChipView: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
