import React from 'react'
import { View, StyleSheet } from 'react-native'

import SubtitleList from '../components/SubtitleList'
import Styles from '../constants/Styles'
/*
  副標題螢幕，顯示副標題和題目
 */
export default function SubtitleScreen (props) {
  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      <SubtitleList {...props} />
    </View>
  )
}

