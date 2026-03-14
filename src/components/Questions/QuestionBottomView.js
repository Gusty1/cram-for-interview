import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { ScrollView, View, Alert, StyleSheet } from 'react-native'
import { TextInput, HelperText, Button } from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import MyText from '../MyComponents/MyText'
import useStore from '../../store'
import { addBugReport } from '../../services'
import { questionStyle } from '../../styles'
import { defaultSetting } from '../../constants'

/**
 * 送出問題回報
 */
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
    Alert.alert(defaultSetting.errMsg)
    console.error('sendReport err: ', e)
  }
}

/**
 * 問題頁的底部 BottomSheet，放字體調整、問題回報
 */
const QuestionBottomView = ({ setShowSnackBar, showBottomView, setShowBottomView, questionID }) => {
  const bottomSheetRef = useRef(null)
  const [sendData, setSendData] = useState({ email: '', fixContent: '' })
  const [sendError, setSendError] = useState(false)

  const setting = useStore((s) => s.setting)
  const setSetting = useStore((s) => s.setSetting)

  const snapPoints = useMemo(
    () => showBottomView === 'fontSize' ? ['25%'] : ['75%'],
    [showBottomView]
  )

  useEffect(() => {
    if (showBottomView) bottomSheetRef.current?.expand()
    else bottomSheetRef.current?.close()
  }, [showBottomView])

  const handleClose = useCallback(() => setShowBottomView(null), [setShowBottomView])

  const handleSheetChanges = useCallback((index) => {
    if (index > 0) {
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [])

  const handleSliderComplete = useCallback((val) => {
    setSetting({ ...setting, answerTextSize: val })
  }, [setting, setSetting])

  const handleEmailChange = useCallback((text) => {
    setSendData((prev) => ({ ...prev, email: text }))
  }, [])

  const handleContentChange = useCallback((text) => {
    setSendData((prev) => ({ ...prev, fixContent: text }))
  }, [])

  const handleSendReport = useCallback(() => {
    sendReport(questionID, sendData, setSendError, bottomSheetRef, setShowSnackBar)
  }, [questionID, sendData, setSendError, setShowSnackBar])

  // BottomSheet 容器背景色
  const bottomContainerStyle = useMemo(() => ({
    ...questionStyle.bottomContainer,
    backgroundColor: setting?.darkMode ? '#3d3a27' : '#ffebcd'
  }), [setting?.darkMode])

  // 控制 zIndex 讓 BottomSheet 顯示在答案上方
  const rootStyle = useMemo(() => ({
    ...questionStyle.QuestionViewStyle,
    zIndex: showBottomView ? 5 : 3
  }), [showBottomView])

  return (
    <GestureHandlerRootView style={rootStyle}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={false}
        index={-1}
        onClose={handleClose}
        onChange={handleSheetChanges}
        handleStyle={questionStyle.handleStyle}
      >
        <BottomSheetView style={bottomContainerStyle}>
          {showBottomView === 'fontSize' ? (
            <View style={styles.fontSizeContainer}>
              <MyText style={styles.fontSizeLabel}>
                字體大小: {setting.answerTextSize}
              </MyText>
              <Slider
                value={setting.answerTextSize}
                step={1}
                style={styles.slider}
                minimumValue={12}
                maximumValue={20}
                minimumTrackTintColor='#FFFFFF'
                maximumTrackTintColor='#000000'
                onSlidingComplete={handleSliderComplete}
              />
            </View>
          ) : (
            <ScrollView style={questionStyle.contentStyle}>
              <TextInput
                mode='outlined'
                label={<MyText>電子郵件</MyText>}
                value={sendData.email}
                onChangeText={handleEmailChange}
              />
              <HelperText type='info' visible={true}>
                <MyText>如果願意可以輸入電子郵件，方便我與您確認</MyText>
              </HelperText>
              <TextInput
                mode='outlined'
                label={<MyText>錯誤內容</MyText>}
                placeholder='可以貼網址，只要有辦法可以說明錯誤就好'
                value={sendData.fixContent}
                onChangeText={handleContentChange}
                style={styles.reportInput}
                multiline={true}
              />
              <HelperText type='error' visible={sendError}>
                <MyText>請輸入錯誤內容</MyText>
              </HelperText>
              <View style={styles.submitBtnWrapper}>
                <Button mode='contained-tonal' onPress={handleSendReport}>
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

const styles = StyleSheet.create({
  fontSizeContainer: {
    ...questionStyle.contentStyle,
    alignItems: 'center'
  },
  fontSizeLabel: {
    width: '100%',
    textAlign: 'center'
  },
  slider: {
    width: 200
  },
  reportInput: {
    height: 120
  },
  submitBtnWrapper: {
    marginTop: 5,
    alignSelf: 'flex-start',
    marginBottom: 10
  }
})

export default QuestionBottomView
