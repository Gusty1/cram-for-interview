/**
 * Home螢幕相關的style
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // 每日一句的容器
  sentenceContainer: {
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 2,
  },
  //每日一句的title row
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  //每日一句標題
  sentenceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  //每日一句內文
  sentenceText: {
    fontSize: 16,
    lineHeight: 24,
  },
  //每日一句作者
  sentenceAuthor: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#999',
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
