import { useRef, useState, useEffect, useCallback } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { ScrollView, View, Alert } from 'react-native'
import { TextInput, HelperText, Button } from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MyText from '../MyComponents/MyText'
import useStore from '../../store'
import { addBugReport } from '../../services'
import { questionStyle } from '../../styles'
import { defaultSetting } from '../../constants'

//問題頁的底部view，放字體調整、問題回報
const sendReport = async (questionID, sendData, setSendError, bottomSheetRef, setShowSnackBar) => {
  try {
    if (!sendData.fixContent.trim()) {
      setSendError(true)
      return
    }
    await addBugReport({
      questionID,
      ...sendData,
      status: '',
      result: ''
    });
    bottomSheetRef.current.close()
    setShowSnackBar('感謝回報')
  } catch (e) {
    Alert(defaultSetting.errMsg)
    console.error('sendReport err: ', e)
  }
}

const QuestionBottomView = ({ setShowSnackBar, showBottomView, setShowBottomView, questionID }) => {
  const bottomSheetRef = useRef(null)
  const [snapPoints, setSnapPoints] = useState(null)
  const [sendData, setSendData] = useState({
    email: '',
    fixContent: ''
  })
  const [sendError, setSendError] = useState(false)
  const { setting, setSetting } = useStore()

  useEffect(() => {
    setSnapPoints(showBottomView === 'fontSize' ? ['50%'] : ["100%"])
    if (showBottomView) bottomSheetRef.current.expand()
    else bottomSheetRef.current.close()
  }, [showBottomView])

  const handleSheetChanges = useCallback((index) => {
    if (index > 0) {
      //調整字體的設定25%超過自動變回來
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, []);

  return (
    <GestureHandlerRootView GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        index={-1}
        onClose={() => setShowBottomView(null)}
        onChange={handleSheetChanges} // 綁定回調
        handleStyle={questionStyle.handleStyle}
      >
        <BottomSheetView
          style={{
            ...questionStyle.bottomContainer,
            backgroundColor: setting?.darkMode ? '#3d3a27' : '#ffebcd'
          }}
        >
          {showBottomView === 'fontSize' ? (
            <View
              style={{
                ...questionStyle.contentStyle,
                alignItems: 'center'
              }}
            >
              <MyText style={{ width: '100%', textAlign: 'center' }}>
                字體大小: {setting.answerTextSize}
              </MyText>
              <Slider
                value={setting.answerTextSize}
                step={1}
                style={{ width: 200 }}
                minimumValue={12}
                maximumValue={20}
                minimumTrackTintColor='#FFFFFF'
                maximumTrackTintColor='#000000'
                onSlidingComplete={(val) => {
                  setSetting({ ...setting, answerTextSize: val });
                }}
              />
            </View>
          ) : (
            <ScrollView style={questionStyle.contentStyle}>
              <TextInput
                mode='outlined'
                label={<MyText>電子郵件</MyText>}
                value={sendData.email}
                onChangeText={(text) =>
                  setSendData({ ...sendData, email: text })
                }
                style={{ flex: 1 }}
              />
              <HelperText type='info' visible={true}>
                <MyText>如果願意可以輸入電子郵件，方便我與您確認</MyText>
              </HelperText>
              <TextInput
                mode='outlined'
                label={<MyText>錯誤內容</MyText>}
                placeholder='可以貼網址，只要有辦法可以說明錯誤就好'
                value={sendData.fixContent}
                onChangeText={(text) =>
                  setSendData({ ...sendData, fixContent: text })
                }
                style={{ flex: 1, height: 110 }}
                multiline={true}
              />
              <HelperText type='error' visible={sendError}>
                <MyText>請輸入錯誤內容</MyText>
              </HelperText>
              <View style={{ marginTop: 5, alignSelf: 'flex-start', marginBottom: 10 }}>
                <Button
                  mode='contained-tonal'
                  onPress={() => sendReport(questionID, sendData, setSendError, bottomSheetRef, setShowSnackBar)}
                >
                  <MyText>送出</MyText>
                </Button>
              </View>
            </ScrollView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  )
}

export default QuestionBottomView
