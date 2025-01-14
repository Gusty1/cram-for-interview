import { useEffect, useState } from 'react'
import { ScrollView, View, Image } from 'react-native'
import { Divider, Snackbar, FAB, IconButton } from 'react-native-paper'
import Markdown from 'react-native-markdown-display'
import MyText from '../MyComponents/MyText'
import { questionStyle, markdownStyle } from '../../styles'
import QuestionMenu from './QuestionMenu'
import QuestionBottomView from './QuestionBottomView'
import useStore from '../../store'

//問題組件
const Questions = ({ curQuestion, swiperObj, ctrlMethod, subtitleZH, subjectEN }) => {
  //取得當前題目
  const [thisQuestion, setThisQuestion] = useState(null)
  //操作成功的tip顯示
  const [showSnackBar, setShowSnackBar] = useState('')
  //控制showBottomView
  const [showBottomView, setShowBottomView] = useState(null)
  const { setting, favoriteList, addFavorite, deleteFavorite,
    thumbList, addThumb, deleteThumb, answerShow } = useStore()

  useEffect(() => {
    if (favoriteList && favoriteList.some((item) => item.questionID === curQuestion.id)) {
      curQuestion = { ...curQuestion, favorite: true }
    } else {
      curQuestion = { ...curQuestion, favorite: false }
    }
    if (thumbList && thumbList.some((item) => item.questionID === curQuestion.id)) {
      curQuestion = { ...curQuestion, thumb: true }
    } else {
      curQuestion = { ...curQuestion, thumb: false }
    }
    setThisQuestion(curQuestion)
  }, [curQuestion, favoriteList, thumbList])

  if (!thisQuestion) return null

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <MyText variant='titleLarge'>
          {thisQuestion.question}
        </MyText>
      </View>
      <Divider />
      <ScrollView style={{ padding: 10, height: showBottomView ? 'auto' : '100%',zIndex:10 }}>
        {answerShow ? (
          <Image source={require('../../assets/images/answerHide.jpg')}
            resizeMode='contain'
            style={{ width: '100%' }}
          />
        ) : (
          <Markdown style={markdownStyle(setting)}>
            {thisQuestion.answer}
          </Markdown>
        )}
      </ScrollView>
      <QuestionBottomView
        setShowSnackBar={setShowSnackBar}
        showBottomView={showBottomView}
        setShowBottomView={setShowBottomView}
        questionID={thisQuestion.id}
      />
      <FAB
        icon={thisQuestion.thumb ? "thumb-up" : "thumb-up-outline"}
        color='blue'
        style={questionStyle.rightBottomBtn1}
        onPress={() => {
          if (thisQuestion.thumb) {
            deleteThumb(thisQuestion.id)
            setShowSnackBar("沒料")
          } else {
            addThumb(thisQuestion.id)
            setShowSnackBar("有料")
          }
        }}
      />
      <FAB
        icon={thisQuestion.favorite ? "cards-heart" : "cards-heart-outline"}
        color='red'
        style={questionStyle.rightBottomBtn2}
        onPress={() => {
          if (thisQuestion.favorite) {
            deleteFavorite(thisQuestion.id)
            setShowSnackBar("不喜歡")
          }
          else {
            addFavorite(thisQuestion.subtitle, subtitleZH, subjectEN, thisQuestion.id)
            setShowSnackBar("喜歡")
          }
        }}
      />
      <QuestionMenu
        thisQuestion={thisQuestion}
        setShowSnackBar={setShowSnackBar}
        setShowBottomView={setShowBottomView}
      />
      <View style={{ position: 'fixed', bottom: 36 }}>
        <Snackbar
          visible={showSnackBar}
          onDismiss={() => setShowSnackBar(null)}
          duration={3000}
          style={{
            margin: 'auto',
            width: 100,
            backgroundColor: setting.darkMode ? '#3d3a27' : '#ffebcd'
          }}
        >
          <MyText style={{ textAlign: 'center' }}>{showSnackBar}</MyText>
        </Snackbar>
      </View>
      {swiperObj.left ? null : <IconButton
        icon="chevron-left"
        mode="contained-tonal"
        iconColor="rgba(255, 165, 0,0.4)"
        size={40}
        onPress={() => ctrlMethod.onLeftSwiper(swiperObj.index - 1)}
        style={{ ...questionStyle.swiperBtn, left: 0 }}
      />}
      {swiperObj.right ? null : <IconButton
        icon="chevron-right"
        iconColor="rgba(255, 165, 0,0.4)"
        size={40}
        onPress={() => ctrlMethod.onRightSwiper(swiperObj.index + 1)}
        style={{ ...questionStyle.swiperBtn, right: 0 }}
      />}
    </View>
  )
}

export default Questions
