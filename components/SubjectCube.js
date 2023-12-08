import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { API, graphqlOperation } from 'aws-amplify'

import { listSubjects } from '../src/graphql/queries'
// import { createSubject } from '../src/graphql/mutation'
import SubjectImgPath from '../constants/SubjectImgPath'
import MyText from './MyText'
import Styles from '../constants/Styles'
import { errorHandler } from '../tools/OtherTool'

/*
  首頁的主題方塊組件
*/
export default function SubjectCube(props) {
  const [subjectAry, setSubjectAry] = useState([])
  const [refreshing, setRefreshing] = React.useState(false)

  //載入時查詢主題
  useEffect(() => {
    fetchSubjects()
  }, [])

  //下拉刷新
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchSubjects()
  }, [refreshing])

  //query主題資料
  async function fetchSubjects() {
    await API.graphql(
      graphqlOperation(listSubjects, { filter: { show: { eq: true } } })
    )
      .then((response) => {
        //資料會放在response.data.listSubjects.items
        setSubjectAry(
          response.data.listSubjects.items.sort((a, b) =>
            a.subject.localeCompare(b.subject)
          )
        )
        setRefreshing(false)
      })
      .catch((err) => {
        errorHandler(err)
      })
  }

  const subjectCube = (itemData) => {
    return (
      <View style={styles.gridItem}>
        <TouchableNativeFeedback
          onPress={() =>
            props.navigation.navigate('SubtitleScreen', {
              subject: itemData.item.subject,
              subject_zh: itemData.item.subject_zh,
            })
          }>
          <View style={styles.itemShow}>
            <ImageBackground
              source={SubjectImgPath[itemData.item.subject]}
              resizeMode="contain"
              style={styles.bgImg}>
              <View>
                <MyText style={styles.cubeTitleFont}>
                  {itemData.item.subject_zh}
                </MyText>
              </View>
            </ImageBackground>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  return (
    <View style={{ ...Styles.defaultMainContainer }}>
      {subjectAry.length === 0 ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          renderItem={subjectCube}
          data={subjectAry}
          numColumns={2}
          keyExtractor={(item) => item.subject}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  gridItem: {
    margin: 15,
    height: 130,
    width: Dimensions.get('window').width / 2.4,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#C4E1E1',
  },
  bgImg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  itemShow: {
    padding: 0,
    width: '100%',
    height: '100%',
  },
  cubeTitleFont: {
    textAlign: 'center',
    fontSize: 20,
    color: '#F9F900',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
})
