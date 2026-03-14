import { memo, useCallback } from 'react'
import { IconButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import useStore from '../../store'

/** 穩定的 icon render，避免每次 render 重建函數 */
const HideSourceIcon = ({ size, color }) => (
  <MaterialIcons name='hide-source' size={size} color={color} />
)

/**
 * 題目頁面右上角的「隱藏答案」按鈕（面試模式開關）
 */
const QuestionHeaderRight = memo(() => {
  const answerShow = useStore((s) => s.answerShow)
  const answerShowChange = useStore((s) => s.answerShowChange)

  const handlePress = useCallback(() => {
    answerShowChange(!answerShow)
  }, [answerShow, answerShowChange])

  return (
    <IconButton
      icon={HideSourceIcon}
      mode={answerShow ? 'contained' : 'contained-tonal'}
      selected
      onPressIn={handlePress}
    />
  )
})

export default QuestionHeaderRight
