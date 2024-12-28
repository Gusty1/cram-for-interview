import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { Ionicons } from "react-native-vector-icons";
import { ActivityIndicator } from "react-native-paper";
import { Alert } from "react-native";
import MyText from "../MyComponents/MyText";
import { defaultSetting } from "../../constants";
import { apiClient } from "../../services";
import { HomeStyle } from "../../styles";

const getSentenceAry = async (setSentenceObj, setLoading) => {
  try {
    setLoading(true);
    const response = await apiClient.get(defaultSetting.sentenceUrl);
    if (response && response.length > 0) {
      const randomSentenceNum = Math.floor(Math.random() * response.length);
      setSentenceObj(response[randomSentenceNum]);
    }
  } catch (e) {
    console.log("getSentenceAry error", e);
    Alert.alert("取得句子錯誤...");
  } finally {
    setLoading(false);
  }
};

//每日一句的組件
const Sentence = () => {
  const [sentenceObj, setSentenceObj] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSentenceAry(setSentenceObj, setLoading);
  }, []);

  return (
    <View style={HomeStyle.sentenceContainer}>
      <View style={HomeStyle.sentenceRow}>
        <MyText>每日一句:</MyText>
        <Button
          mode="text"
          style={{ minWidth: 0 }}
          onPress={() => getSentenceAry(setSentenceObj, setLoading)}
        >
          <Ionicons name="reload" size={defaultSetting.defaultIconSize} />
        </Button>
      </View>
      <View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <MyText>{sentenceObj.sentence}</MyText>
            <MyText style={{ textAlign: "right" }}>
              —{sentenceObj.author}
            </MyText>
          </>
        )}
      </View>
    </View>
  );
};

export default Sentence;
