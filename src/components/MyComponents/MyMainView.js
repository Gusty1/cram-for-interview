import { View } from 'react-native'
import { commonStyle } from '../../styles'

/** 主要螢幕的預設容器 */
const MyMainView = ({ children, style }) => (
  <View style={[commonStyle.mainContainer, style]}>{children}</View>
)

export default MyMainView
