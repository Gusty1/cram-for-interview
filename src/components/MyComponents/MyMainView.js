import { View } from "react-native";
import { commonStyle } from "../../styles";

// 主要螢幕的預設容器
export default ({ children }) => {
  return <View style={commonStyle.mainContainer}>{children}</View>;
};
