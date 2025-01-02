import { Text } from 'react-native-paper'

//字定義字體，不然RN paper字體遇到特殊符號就會有問題
const MyText = ({ children, style, ...props }) => {
  return (
    <Text
      style={{
        ...style,
        fontFamily: 'NotoSansTC-Black'
      }}
      {...props}
    >
      {children}
    </Text>
  )
}

export default MyText
