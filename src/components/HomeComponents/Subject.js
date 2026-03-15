import { useCallback, useEffect, useState } from 'react'
import { View, FlatList, Alert, StyleSheet } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import uuid from 'react-native-uuid'
import { defaultSetting } from '../../constants'
import SubjectCard from './SubjectCard'
import { commonStyle } from '../../styles'
import useStore from '../../store'

/** 主題列表容器 */
const Subject = ({ navigation }) => {
  const [subjectList, setSubjectList] = useState([])
  const [loading, setLoading] = useState(true)
  const { getCachedSubjects } = useStore()

  const getSubjectList = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      const response = await getCachedSubjects(forceRefresh)
      const result = [...response]
      // FlatList numColumns=2，不足補位以維持佈局
      if (result.length % 2 !== 0) {
        result.push({ id: uuid.v4() })
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
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' style={commonStyle.defaultLoading} />
      ) : (
        <FlatList
          data={subjectList}
          renderItem={({ item }) => (
            <SubjectCard subjectObj={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={() => getSubjectList(true)}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 8,
  },
})

export default Subject
