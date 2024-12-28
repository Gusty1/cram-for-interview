// import { View } from "react-native";
import { Text } from "react-native-paper";
import { MyMainView, Sentence, Subject } from "../../../components";

const HomeScreen = ({ navigation }) => {
  return (
    <MyMainView>
      <Sentence />
      <Subject />
    </MyMainView>
  );
};

export default HomeScreen;
