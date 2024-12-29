import { useEffect, useState } from "react";
import { Text, View, FlatList, Image } from "react-native";
import { List, Divider, ActivityIndicator } from "react-native-paper";
import { getSubtitles } from "../../../../services";
import { MyText } from "../../../../components";
import { commonStyle } from "../../../../styles";

const SubtitleScreen = ({ navigation, route }) => {
  const { subjectEN, subjectZH } = route.params;
  const [subtitleList, setSubtitleList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSubtitleList = async () => {
      try {
        setLoading(true);
        const subtitles = await getSubtitles(subjectEN);
        subtitles.sort((a, b) => a.en_name.localeCompare(b.en_name));
        // console.log(subtitles);
        setSubtitleList(subtitles);
      } catch (e) {
        console.error("getSubtitleList error: ", e);
      } finally {
        setLoading(false);
      }
    };
    getSubtitleList();
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View
        style={{ flex: 0.35, borderRightWidth: 1, borderRightColor: "gray" }}
      >
        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator style={commonStyle.defaultLoading} />
          ) : (
            <FlatList
              data={subtitleList}
              renderItem={({ item }) => (
                <>
                  <List.Item
                    // style={{ flex: 1, backgroundColor: "red" }}
                    contentStyle={{ flex: 1 }}
                    titleStyle={{ fontSize: 16 }}
                    title={<MyText>{item.zh_name}</MyText>}
                    left={() => (
                      <Image
                        source={{ uri: item.image }}
                        resizeMode="contain"
                        style={{ flex: 0.4}}
                      />
                    )}
                  />
                  <Divider />
                </>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </View>
      </View>
      <View style={{ flex: 0.65 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <MyText>
            資料來源皆取自網路，不能保證一定是對的，如果發現問題歡迎回報，將會盡快修正。
          </MyText>
        </View>
      </View>
    </View>
  );
};

export default SubtitleScreen;
