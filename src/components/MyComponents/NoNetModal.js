import { useState, useCallback } from "react";
import { Image } from "react-native";
import { Modal, Portal, Button } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import MyText from "./MyText";
import { commonStyle } from "../../styles";

//沒有網路的modal
const NoNetModal = () => {
  const [checking, setChecking] = useState(false);

  // 觸發 NetInfo 重新檢查網路狀態，若已恢復則 netStore 會自動關閉此 Modal
  const handleRetry = useCallback(async () => {
    setChecking(true);
    try {
      await NetInfo.refresh();
    } finally {
      setChecking(false);
    }
  }, []);

  return (
    <Portal>
      <Modal
        visible={true}
        dismissable={false}
        contentContainerStyle={commonStyle.noErrModalContainer}
      >
        <MyText style={commonStyle.noNetText}>
          當前沒有網路，請檢查連線狀況
        </MyText>
        <Image
          resizeMode="contain"
          style={{ flex: 0.7, alignSelf: "center", marginVertical: 20 }}
          source={require("../../assets/images/noNet.jpg")}
        />
        <Button
          mode="contained-tonal"
          loading={checking}
          disabled={checking}
          onPress={handleRetry}
          style={{ marginTop: 8 }}
        >
          重試
        </Button>
      </Modal>
    </Portal>
  );
};

export default NoNetModal;
