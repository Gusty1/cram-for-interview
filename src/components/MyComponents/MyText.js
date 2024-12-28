import { Text } from "react-native-paper";


//自定義字體，不然RN paper字體遇到特殊符號就會有問題
const MyText = ({ children ,style}) => {
  return (
    <Text
      style={{
        fontFamily: 'NotoSansTC-Black',
				...style,
      }}
    >
      {children}
    </Text>
  );
};

export default MyText;
