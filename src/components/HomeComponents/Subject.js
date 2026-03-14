import { useCallback, useEffect, useState } from 'react'
import { View, FlatList, Alert } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import uuid from 'react-native-uuid'
import { defaultSetting } from '../../constants'
import SubjectCard from './SubjectCard'
import { commonStyle } from '../../styles'
import useStore from '../../store'

//主題的容器
const Subject = ({ navigation }) => {
  const [subjectList, setSubjectList] = useState([])
  const [loading, setLoading] = useState(true)
  const { getCachedSubjects } = useStore()

  const getSubjectList = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      // 使用快取取得主題列表（已在 cacheStore 中排序）
      const response = await getCachedSubjects(forceRefresh)
      const result = [...response]
      //使用FlatList如果，每行顯示不足3個，會占滿版面，使佈局變得很怪，所以不足補上
      if (result.length % 3 !== 0) {
        for (let i = 0; i <= 3 - (result.length % 3); i++) {
          result.push({ id: uuid.v4() })
        }
      }
      setSubjectList(result)
    } catch (err) {
      Alert.alert(defaultSetting.errMsg)
      console.log('getSubjectList err: ', err)
    } finally {
      setLoading(false)
    }
  }, [getCachedSubjects])

  useEffect(() => {
    getSubjectList()
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
            onRefresh={() => getSubjectList(true)}
          />
        )}
    </View>
  )
}

export default Subject
