import React from 'react'
import { View } from 'react-native'

import Styles from '../constants/Styles'
import FavList from '../components/FavList'

export default function FavoriteScreen(props) {
  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      <FavList {...props} />
    </View>
  )
}
