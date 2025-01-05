import { useState } from 'react'
import { View } from 'react-native'
import { Card } from 'react-native-paper'
import MyText from '../MyComponents/MyText'
import { homeStyle } from '../../styles'

//主題卡片
const SubjectCard = ({ subjectObj, navigation }) => {
  const { zh_name, en_name, image } = subjectObj
  const [error, setError] = useState(false)

  //少於3個卡片的部分用空白的View補上
  if (!zh_name) {
    return <View style={{ flex: 1 }}></View>
  }

  return (
    <Card
      style={{ flex: 1 }}
      onPress={() =>
        navigation.navigate('SubtitleScreen', {
          subjectEN: en_name,
          subjectZH: zh_name
        })
      }
    >
      <Card.Title
        title={<MyText style={{ textAlign: 'center' }}>{zh_name}</MyText>}
        titleVariant='titleLarge'
      />
      <Card.Cover
        resizeMode='contain'
        style={homeStyle.cardContainer}
        source={error ? require('../../assets/images/notFound.png') : { uri: image }}
        onError={() => setError(true)}
      />
    </Card>
  )
}

export default SubjectCard
