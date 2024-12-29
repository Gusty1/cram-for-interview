/**
 * Home螢幕相關的style
 */

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // 每日一句的容器
  sentenceContainer: {
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  //每日一句的title row
  sentenceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    gap: 5,
  },
  //主題卡片的容器
  cardContainer: {
    flex: 1,
    marginVertical: -10,
    height: 150,
    backgroundColor: "transparent",
  },
});
