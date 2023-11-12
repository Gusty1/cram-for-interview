import React from 'react'
import { View } from 'react-native'

import Styles from '../constants/Styles'
import QuestionCombine from '../components/QuestionCombine'

/*顯示問題的詳細螢幕 */
export default function QuestionScreens(props) {
  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      <QuestionCombine {...props} />
    </View>
  )
}
