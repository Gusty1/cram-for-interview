import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MyMainView } from '../../../components';

const HomeScreen = ({ navigation }) => {
  return (
    <MyMainView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-center',
        }}
      >
        <Text>我是首頁</Text>
      </View>
    </MyMainView>
  );
};

export default HomeScreen;
