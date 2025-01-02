import { useState } from 'react'
import * as Clipboard from 'expo-clipboard'
import { FAB } from 'react-native-paper'

const QuestionMenu = ({ thisQuestion, setShowSnackBar, setShowBottomView }) => {
  const [open, setOpen] = useState(false)

  if (!thisQuestion) return null

  const copyToClipboard = async () => {
    try {
      const copyText = thisQuestion.question + '\n\n' + thisQuestion.answer;
      await Clipboard.setStringAsync(copyText) // 使用 setStringAsync 來複製文字
      setShowSnackBar('複製成功')
    } catch (e) {
      console.error('copyToClipboard err: ', e)
    }
  };

  if (!thisQuestion) return null

  return (
    <FAB.Group
      style={{ bottom: 10 }}
      open={open}
      visible
      icon={open ? 'close' : 'dots-vertical'}
      actions={[
        {
          icon: 'content-copy',
          onPress: () => copyToClipboard()
        },
        {
          icon: 'format-font',
          onPress: () => {
            setShowBottomView('fontSize')
          },
        },
        {
          icon: 'bug-outline',
          onPress: () => {
            setShowBottomView('bugReport')
          },
        }
      ]}
      onStateChange={({ open }) => setOpen(open)}
    />)
}

export default QuestionMenu
