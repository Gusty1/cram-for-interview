import React from 'react'
import { Text, StyleSheet } from 'react-native'

export default function MyText (props) {
  return (
    <Text style={{ ...props.style, ...styles.myText }}>{props.children}</Text>
  )
}

const styles = StyleSheet.create({
  myText: {
    fontWeight: 'bold',
    fontFamily: 'noto-sans',
  }
})
