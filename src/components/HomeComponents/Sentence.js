import { useEffect, useState, useCallback } from "react";
import { View, Alert } from "react-native";
import { IconButton } from "react-native-paper";
import MyText from "../MyComponents/MyText";
import { defaultSetting } from "../../constants";
import { apiClient } from "../../services";
import { homeStyle } from "../../styles";

const getSentenceAry = async (setSentenceObj, signal) => {
  try {
    const response = await apiClient.get(defaultSetting.sentenceUrl, {
      signal,
    });
    if (response && response.length > 0) {
      const randomSentenceNum = Math.floor(Math.random() * response.length);
      setSentenceObj(response[randomSentenceNum]);
    }
  } catch (e) {
    // 組件卸載時 AbortController 會取消請求，忽略對應的 AbortError
    if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") return;
    Alert.alert(defaultSetting.errMsg);
    console.error("getSentenceAry error", e);
  }
};

/** 首頁每日一句組件 */
const Sentence = () => {
  const [sentenceObj, setSentenceObj] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getSentenceAry(setSentenceObj, controller.signal);
    // 組件卸載時取消未完成的請求，避免在已卸載的組件上呼叫 setState
    return () => controller.abort();
  }, []);

  const handleReload = useCallback(() => getSentenceAry(setSentenceObj), []);

  if (!sentenceObj) return null;

  return (
    <View style={homeStyle.sentenceContainer}>
      <View style={homeStyle.sentenceRow}>
        <MyText style={homeStyle.sentenceLabel}>每日一句</MyText>
        <IconButton
          icon="reload"
          mode="contained-tonal"
          size={16}
          onPress={handleReload}
        />
      </View>
      <MyText style={homeStyle.sentenceText}>{sentenceObj.sentence}</MyText>
      <MyText style={homeStyle.sentenceAuthor}>— {sentenceObj.author}</MyText>
    </View>
  );
};

export default Sentence;
