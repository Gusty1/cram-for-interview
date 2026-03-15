import { useState, memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card } from 'react-native-paper'
import MyText from '../MyComponents/MyText'

/** 主題卡片 */
const SubjectCard = ({ subjectObj, navigation }) => {
  const { zh_name, en_name, image } = subjectObj
  const [error, setError] = useState(false)

  // 補位用的空白卡片
  if (!zh_name) {
    return <View style={styles.wrapper} />
  }

  return (
    <Card
      style={styles.wrapper}
      mode="elevated"
      onPress={() =>
        navigation.navigate('SubtitleScreen', {
          subjectEN: en_name,
          subjectZH: zh_name
        })
      }
    >
      <Card.Cover
        style={styles.cover}
        source={error ? require('../../assets/images/notFound.png') : { uri: image }}
        onError={() => setError(true)}
      />
      <View style={styles.titleRow}>
        <MyText style={styles.title} numberOfLines={1}>{zh_name}</MyText>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  cover: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  titleRow: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
})

export default memo(SubjectCard)
