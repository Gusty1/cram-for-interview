import { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Portal, Modal, Chip, Button } from "react-native-paper";
import useStore from "../../store";
import MyText from "../MyComponents/MyText";
import { homeStyle } from "../../styles";

/** 子項目的過濾 Modal */
const SubtitleFilterModal = ({
  filterModalShow,
  filterSubtitle,
  showSubtitleItems,
}) => {
  const [subtitlesItems, setSubtitlesItems] = useState([]);
  const { setting } = useStore();

  useEffect(() => {
    setSubtitlesItems(showSubtitleItems);
  }, [showSubtitleItems]);

  const modalStyle = useMemo(
    () => ({
      ...homeStyle.subtitleFilterModalContainer,
      backgroundColor: setting?.darkMode ? "#3d3a27" : "#ffebcd",
    }),
    [setting?.darkMode],
  );

  /** 切換選中狀態，id 為空則全部重置 */
  const changeSelected = useCallback((id) => {
    setSubtitlesItems((prev) =>
      id
        ? prev.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item,
          )
        : prev.map((item) => ({ ...item, selected: false })),
    );
  }, []);

  const handleReset = useCallback(() => changeSelected(), [changeSelected]);
  const handleDismiss = useCallback(
    () => filterSubtitle(subtitlesItems),
    [filterSubtitle, subtitlesItems],
  );

  return (
    <Portal>
      <Modal
        visible={filterModalShow}
        dismissable
        onDismiss={handleDismiss}
        dismissableBackButton
        contentContainerStyle={modalStyle}
      >
        <View style={homeStyle.subtitleFilterModalMainView}>
          <MyText style={styles.flex1}>選擇要顯示的項目：</MyText>
          <Button mode="contained-tonal" onPress={handleReset}>
            <MyText>重置</MyText>
          </Button>
        </View>
        <View style={homeStyle.subtitleFilterModalChipView}>
          {subtitlesItems.map((item) => (
            <Chip
              key={item.id}
              mode="outlined"
              selected={item.selected}
              showSelectedCheck={false}
              style={[styles.chip, item.selected && styles.chipSelected]}
              onPress={() => changeSelected(item.id)}
            >
              <MyText>{item.zh_name}</MyText>
            </Chip>
          ))}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  chip: {
    backgroundColor: "transparent",
    marginRight: 5,
    marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: "skyblue",
  },
});

export default SubtitleFilterModal;
