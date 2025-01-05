import { useEffect, useState } from 'react'
import { View, FlatList, Alert } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import uuid from 'react-native-uuid'
import { defaultSetting } from '../../constants'
import { getSubjects } from '../../services'
import SubjectCard from './SubjectCard'
import { commonStyle } from '../../styles'

const getSubjectList = async (setSubjectList, setLoading) => {
  try {
    setLoading(true)
    const response = await getSubjects()
    response.sort((a, b) => a.en_name.localeCompare(b.en_name))
    //使用FlatList如果，每行顯示不足3個，會占滿版面，使佈局變得很怪，所以不足補上，不用又會被說效能不好
    if (response.length % 3 !== 0) {
      for (let i = 0; i <= 3 - (response.length % 3); i++) {
        response.push({ id: uuid.v4() })
      }
    }
    setSubjectList(response)
  } catch (err) {
    Alert(defaultSetting.errMsg)
    console.log('getSubjectList err: ', err)
  } finally {
    setLoading(false)
  }
};

//主題的容器
const Subject = ({ navigation }) => {
  const [subjectList, setSubjectList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubjectList(setSubjectList, setLoading)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {loading ? (<ActivityIndicator size='large' style={commonStyle.defaultLoading} />) :
        (
          <FlatList
            data={subjectList}
            renderItem={({ item }) => (
              <SubjectCard subjectObj={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 20
            }}
            refreshing={loading}
            onRefresh={() => getSubjectList(setSubjectList, setLoading)}
          />
        )}
    </View>
  )
}

export default Subject
