import { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import uuid from "react-native-uuid";
import DragList from "react-native-draglist";
import {
  getAllFavorite,
  getSettingData,
  setSettingData,
} from "../../../services";
import { MyText, FavoriteList, SubtitleFilterModal } from "../../../components";
import { commonStyle } from "../../../styles";
import useStore from "../../../store";
import { defaultSetting } from "../../../constants";

const FavoriteScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showSubtitleItems, setShowSubtitleItems] = useState([]);
  const [filterModalShow, setFilterModalShow] = useState(false);
  // 集中管理各收藏 subtitle 的展開狀態，避免子組件重建時丟失
  const [expandedMap, setExpandedMap] = useState({});
  const { favoriteList, setting, getCachedQuestionsBatch, deleteFavorite } =
    useStore();

  //取得收藏的完整資料，使用快取 + 批次查詢
  const getFavoriteListData = useCallback(async () => {
    setLoading(true);
    try {
      const allFavorites = await getAllFavorite();
      // 過濾不重複的subtitle
      const seen = new Set();
      const filterSubtitle = allFavorites.filter((item) => {
        if (!seen.has(item.subtitle)) {
          seen.add(item.subtitle);
          return true;
        }
        return false;
      });
      const thisSetting = await getSettingData();
      let sortStr = null;
      if (thisSetting.favoriteSortStr)
        sortStr = JSON.parse(thisSetting.favoriteSortStr);

      // 使用 Set 優化收藏比對：O(n) lookup
      const favoriteIdSet = new Set(allFavorites.map((f) => f.questionID));

      // 批次查詢所有 subtitle 的問題（解決 N+1 問題）
      const subtitleENList = filterSubtitle.map((item) => item.subtitle);
      const questionsMap = await getCachedQuestionsBatch(subtitleENList);

      //組合收藏ary的完整資訊
      const favoriteAry = filterSubtitle.map((item) => {
        let currentItem = item;
        if (sortStr) {
          const findItem = sortStr.find((x) => x.subtitle === item.subtitle);
          if (findItem) currentItem = { ...item, sort: findItem.sort };
        } else currentItem = { ...item, sort: 999 };

        const questions = (questionsMap[item.subtitle] || [])
          .filter((curQue) => favoriteIdSet.has(curQue.id))
          .map((curQue) => ({
            ...curQue,
            favorite: true,
            subtitleShow: item.subtitleShow,
          }));

        return {
          ...currentItem,
          id: uuid.v4(),
          image:
            defaultSetting.imageBaseUrl +
            item.subject +
            "/" +
            item.subtitle +
            ".png",
          show: true,
          questions,
        };
      });

      favoriteAry.sort((a, b) => a.sort - b.sort);
      //組出過濾項目的ary
      const modelShowSubtitleItems = favoriteAry.map((item) => ({
        id: uuid.v4(),
        en_name: item.subtitle,
        zh_name: item.subtitleShow,
        selected: false,
      }));
      setShowSubtitleItems(modelShowSubtitleItems);
      setFavorites(favoriteAry);
    } catch (e) {
      console.error("getFavoriteListData error", e);
    } finally {
      setLoading(false);
    }
  }, [getCachedQuestionsBatch]);

  useEffect(() => {
    getFavoriteListData();
  }, [favoriteList, getFavoriteListData]);

  // useMemo 必須在所有 hooks 之後、條件 return 之前
  const allQuestions = useMemo(() => {
    const result = [];
    favorites.forEach((item) => result.push(...item.questions));
    return result;
  }, [favorites]);

  // 切換某個收藏 subtitle 的展開/收合
  const toggleExpand = useCallback((subtitle) => {
    setExpandedMap((prev) => ({ ...prev, [subtitle]: !prev[subtitle] }));
  }, []);

  // 拖曳的組件渲染，補上拖曳方法
  const renderItem = useCallback(
    ({ item, onDragStart, onDragEnd }) => {
      return (
        <FavoriteList
          navigation={navigation}
          favoriteSubtitle={item}
          delFavorite={delFavorite}
          allQuestions={allQuestions}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          expanded={!!expandedMap[item.subtitle]}
          toggleExpand={toggleExpand}
        />
      );
    },
    [navigation, allQuestions, delFavorite, expandedMap, toggleExpand],
  );

  // 過濾要顯示的選項
  const filterSubtitle = useCallback(
    (changeSubtitleItems) => {
      let changeFavorites = [];
      // 如果沒有選副主題就顯示全部
      if (
        showSubtitleItems.length > 0 &&
        !changeSubtitleItems.some((item) => item.selected)
      ) {
        changeFavorites = favorites.map((item) => ({ ...item, show: true }));
      } else {
        changeFavorites = favorites.map((item) => {
          const show = changeSubtitleItems.some(
            (x) => x.en_name === item.subtitle && x.selected,
          );
          return { ...item, show };
        });
      }
      setFavorites(changeFavorites);
      setFilterModalShow(false);
    },
    [showSubtitleItems, favorites],
  );

  // 透過 store action 刪除：SQLite 更新後 store 會自動更新 favoriteList，
  // 觸發 useEffect 重新載入資料，確保 UI 與資料庫完全同步
  const delFavorite = useCallback(
    (subtitle, id) => {
      // 樂觀更新 UI，讓刪除操作在視覺上即時反映
      setFavorites((prev) =>
        prev
          .map((item) => {
            if (item.subtitle === subtitle) {
              return {
                ...item,
                questions: item.questions.filter((x) => x.id !== id),
              };
            }
            return item;
          })
          .filter((item) => item.questions.length > 0),
      );
      // 透過 store action 更新 SQLite 和 favoriteList（取代直接呼叫 SQLite 服務）
      deleteFavorite(id);
    },
    [deleteFavorite],
  );

  // 移動後的回調方法，就是位置的切換
  const onReordered = useCallback(
    (fromIndex, toIndex) => {
      // 拖曳的時候不知為啥有時 index 會超出範圍，這工具有 bug，所以增加判斷
      if (
        fromIndex < 0 ||
        fromIndex > favorites.length - 1 ||
        toIndex < 0 ||
        toIndex > favorites.length - 1
      )
        return;
      const changeFavorites = [...favorites];
      const temp = changeFavorites[fromIndex];
      changeFavorites[fromIndex] = changeFavorites[toIndex];
      changeFavorites[toIndex] = temp;
      // 先更新 UI，再非同步寫入排序設定（保持拖曳流暢）
      setFavorites(changeFavorites);
      if (changeFavorites.length > 0 && setting) {
        const sortSrt = changeFavorites.map((item, index) => ({
          subtitle: item.subtitle,
          sort: index,
        }));
        setSettingData({
          ...setting,
          favoriteSortStr: JSON.stringify(sortSrt),
        }).catch((e) => {
          console.error("收藏排序寫入失敗", e);
        });
      }
    },
    [favorites, setting],
  );

  const handleRefresh = useCallback(
    () => getFavoriteListData(),
    [getFavoriteListData],
  );
  const handleFilterPress = useCallback(() => setFilterModalShow(true), []);

  if (loading) {
    return (
      <ActivityIndicator style={commonStyle.defaultLoading} size={"large"} />
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}>
        <MyText style={commonStyle.noDataMsg}>還沒有任何收藏的題目</MyText>
      </View>
    );
  }

  const isDark = setting?.darkMode;

  return (
    <View style={fStyles.container}>
      <MyText style={{ ...fStyles.hint, color: isDark ? "#777" : "#aaa" }}>
        長按項目可拖曳排序
      </MyText>
      <DragList
        style={fStyles.dragList}
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onReordered={onReordered}
        refreshing={loading}
        onRefresh={handleRefresh}
        contentContainerStyle={fStyles.listContent}
      />
      <SubtitleFilterModal
        filterModalShow={filterModalShow}
        filterSubtitle={filterSubtitle}
        showSubtitleItems={showSubtitleItems}
      />
      <IconButton
        style={fStyles.filterBtn}
        mode="contained"
        size={26}
        icon="filter-variant"
        onPress={handleFilterPress}
        disabled={loading || favorites.length === 0}
      />
    </View>
  );
};

const fStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hint: {
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 6,
  },
  dragList: {
    height: "100%",
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  filterBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default FavoriteScreen;
