import { Image } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import MyText from './MyText'
import { commonStyle } from '../../styles'

const NoNetModal = () => {
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
          resizeMode='contain'
          style={{ flex: 0.7, alignSelf: 'center', marginVertical: 20 }}
          source={require('../../assets/images/noNet.jpg')}
        />
      </Modal>
    </Portal>
  );
};

export default NoNetModal;
