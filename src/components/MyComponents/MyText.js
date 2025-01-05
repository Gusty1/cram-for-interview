import { Text } from 'react-native-paper'

//共用文字組件
const MyText = ({ children, style, ...props }) => {
  return (
    <Text
      style={{
        ...style,
        fontFamily: 'LXGWWenKaiTC-Regular',
      }}
      {...props}
    >
      {children}
    </Text>
  )
}

export default MyText
