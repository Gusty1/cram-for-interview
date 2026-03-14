import { memo, useEffect, useState, useMemo, useCallback } from 'react'
import { View, ScrollView, Image, StyleSheet, Pressable, Alert } from 'react-native'
import { Divider, Snackbar, IconButton } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import Markdown from 'react-native-markdown-display'
import MyText from '../MyComponents/MyText'
import { questionStyle, markdownStyle } from '../../styles'
import { defaultSetting } from '../../constants'
import QuestionBottomView from './QuestionBottomView'
import useStore from '../../store'

/**
 * 抖音風格的透明動作按鈕
 * 按下時縮小 0.85 倍產生觸覺回饋感，支援暗色/亮色模式
 */
const ActionBtn = memo(({ icon, color, label, onPress, darkMode }) => {
  const bgColor = darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'
  const pressedBgColor = darkMode ? 'rgba(255, 255, 255, 0.22)' : 'rgba(0, 0, 0, 0.15)'
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: pressed ? pressedBgColor : bgColor },
        pressed && styles.actionBtnPressed
      ]}
    >
      <MaterialCommunityIcons name={icon} size={28} color={color} />
      {label ? <MyText style={[styles.actionLabel, { color }]}>{label}</MyText> : null}
    </Pressable>
  )
})

/**
 * 問題組件 - 顯示單一題目的問題、答案、右側操作按鈕列
 * 使用 React.memo 避免 PagerView 滑頁時不必要的 re-render
 */
const Questions = memo(({ curQuestion, isFirst, isLast, pageIndex, ctrlMethod, subtitleZH, subjectEN, isActive }) => {
  const [thisQuestion, setThisQuestion] = useState(null)
  const [showSnackBar, setShowSnackBar] = useState('')
  const [showBottomView, setShowBottomView] = useState(null)

  const setting = useStore((s) => s.setting)
  const favoriteList = useStore((s) => s.favoriteList)
  const addFavorite = useStore((s) => s.addFavorite)
  const deleteFavorite = useStore((s) => s.deleteFavorite)
  const thumbList = useStore((s) => s.thumbList)
  const addThumb = useStore((s) => s.addThumb)
  const deleteThumb = useStore((s) => s.deleteThumb)
  const answerShow = useStore((s) => s.answerShow)

  useEffect(() => {
    const isFavorite = favoriteList?.some((item) => item.questionID === curQuestion.id) ?? false
    const isThumb = thumbList?.some((item) => item.questionID === curQuestion.id) ?? false
    setThisQuestion({ ...curQuestion, favorite: isFavorite, thumb: isThumb })
  }, [curQuestion, favoriteList, thumbList])

  const mdStyle = useMemo(() => markdownStyle(setting), [setting])

  const snackbarStyle = useMemo(() => ({
    alignSelf: 'center',
    width: 100,
    backgroundColor: setting?.darkMode ? '#3d3a27' : '#ffebcd'
  }), [setting?.darkMode])

  // -- 操作回調 --
  const handleThumbPress = useCallback(() => {
    if (!thisQuestion) return
    if (thisQuestion.thumb) {
      deleteThumb(thisQuestion.id)
      setShowSnackBar('沒料')
    } else {
      addThumb(thisQuestion.id)
      setShowSnackBar('有料')
    }
  }, [thisQuestion, addThumb, deleteThumb])

  const handleFavoritePress = useCallback(() => {
    if (!thisQuestion) return
    if (thisQuestion.favorite) {
      deleteFavorite(thisQuestion.id)
      setShowSnackBar('不喜歡')
    } else {
      addFavorite(thisQuestion.subtitle, subtitleZH, subjectEN, thisQuestion.id)
      setShowSnackBar('喜歡')
    }
  }, [thisQuestion, subtitleZH, subjectEN, addFavorite, deleteFavorite])

  const handleCopy = useCallback(async () => {
    try {
      const copyText = thisQuestion.question + '\n\n' + thisQuestion.answer
      await Clipboard.setStringAsync(copyText)
      setShowSnackBar('複製成功')
    } catch (e) {
      Alert.alert(defaultSetting.errMsg)
      console.error('copyToClipboard err: ', e)
    }
  }, [thisQuestion])

  const handleFontSize = useCallback(() => setShowBottomView('fontSize'), [])
  const handleBugReport = useCallback(() => setShowBottomView('bugReport'), [])
  const handleDismissSnackbar = useCallback(() => setShowSnackBar(null), [])

  const handleLeftSwipe = useCallback(
    () => ctrlMethod(pageIndex - 1),
    [ctrlMethod, pageIndex]
  )
  const handleRightSwipe = useCallback(
    () => ctrlMethod(pageIndex + 1),
    [ctrlMethod, pageIndex]
  )

  if (!thisQuestion) return null

  return (
    <View style={styles.container}>
      {/* 題目標題 */}
      <View style={styles.questionTitle}>
        <MyText variant='titleLarge'>
          {thisQuestion.question}
        </MyText>
      </View>
      <Divider />

      {/* 答案區域 */}
      <View style={styles.answerContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {answerShow ? (
            <Image source={require('../../assets/images/answerHide.jpg')}
              resizeMode='contain'
              style={styles.answerHideImage}
            />
          ) : isActive ? (
            <Markdown style={mdStyle}>
              {thisQuestion.answer}
            </Markdown>
          ) : null}
        </ScrollView>
        <QuestionBottomView
          setShowSnackBar={setShowSnackBar}
          showBottomView={showBottomView}
          setShowBottomView={setShowBottomView}
          questionID={thisQuestion.id}
        />
      </View>

      {/* 右側抖音風格操作列 - 面試模式時隱藏 */}
      {!answerShow && <View style={styles.actionBar}>
        <ActionBtn
          icon={thisQuestion.thumb ? 'thumb-up' : 'thumb-up-outline'}
          color='#4A90D9'
          onPress={handleThumbPress}
          darkMode={setting?.darkMode}
        />
        <ActionBtn
          icon={thisQuestion.favorite ? 'cards-heart' : 'cards-heart-outline'}
          color='#E74C3C'
          onPress={handleFavoritePress}
          darkMode={setting?.darkMode}
        />
        <ActionBtn
          icon='content-copy'
          color='#888'
          onPress={handleCopy}
          darkMode={setting?.darkMode}
        />
        <ActionBtn
          icon='format-font'
          color='#888'
          onPress={handleFontSize}
          darkMode={setting?.darkMode}
        />
        <ActionBtn
          icon='bug-outline'
          color='#888'
          onPress={handleBugReport}
          darkMode={setting?.darkMode}
        />
      </View>}

      {/* 提示訊息 */}
      <View style={styles.snackbarWrapper}>
        <Snackbar
          visible={!!showSnackBar}
          onDismiss={handleDismissSnackbar}
          duration={3000}
          style={snackbarStyle}
        >
          <MyText style={styles.snackbarText}>{showSnackBar}</MyText>
        </Snackbar>
      </View>

      {/* 左翻頁按鈕 */}
      {!isFirst && (
        <IconButton
          icon='chevron-left'
          mode='contained-tonal'
          iconColor='rgba(255, 165, 0, 0.4)'
          size={40}
          onPress={handleLeftSwipe}
          style={styles.swiperBtnLeft}
        />
      )}

      {/* 右翻頁按鈕 */}
      {!isLast && (
        <IconButton
          icon='chevron-right'
          iconColor='rgba(255, 165, 0, 0.4)'
          size={40}
          onPress={handleRightSwipe}
          style={styles.swiperBtnRight}
        />
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  questionTitle: {
    padding: 10
  },
  answerContainer: {
    flex: 1
  },
  scrollView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    zIndex: 4
  },
  scrollContent: {
    paddingBottom: 80
  },
  answerHideImage: {
    width: '100%',
    height: 300
  },
  // 右側透明操作列 - 抖音風格
  actionBar: {
    position: 'absolute',
    right: 12,
    bottom: 60,
    alignItems: 'center',
    zIndex: 10,
    gap: 6
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22
  },
  actionBtnPressed: {
    transform: [{ scale: 0.85 }]
  },
  actionLabel: {
    fontSize: 10,
    marginTop: 2
  },
  snackbarWrapper: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    zIndex: 5
  },
  snackbarText: {
    textAlign: 'center'
  },
  swiperBtnLeft: {
    ...questionStyle.swiperBtn,
    left: 0
  },
  swiperBtnRight: {
    ...questionStyle.swiperBtn,
    right: 0
  }
})

export default Questions
