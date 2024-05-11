import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    Keyboard,
    ActivityIndicator,
} from 'react-native'
import { SpeedDial, Dialog, Input, Button } from '@rneui/themed'
import { Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { API, graphqlOperation } from 'aws-amplify'
import { useDispatch, useSelector } from 'react-redux'
import Markdown from 'react-native-markdown-display'
import moment from 'moment'
import 'moment/locale/zh-tw'
import PagerView from 'react-native-pager-view'

import { createReport } from '../src/graphql/mutations'
import { listQuestions } from '../src/graphql/queries'
import {
    insertFavorite,
    fetchFavorite,
    deleteFavorite,
    fetchFavoriteAll,
} from '../sqlLite/db'
import MyText from '../components/MyText'
import Colors from '../constants/Colors'
import { change } from '../store/slices/favoriteSlices'
import { errorHandler } from '../tools/OtherTool'

/*
  問題答案詳細頁+錯誤回報+加入收藏
*/

export default function QuestionCombine (props) {
    const favoriteAry = useSelector((state) => state.favoriteAry.value)
    const dispatch = useDispatch()

    const subtitle = props.route.params.subtitle
    const order = props.route.params.order
    const favQuestionAry = props.route.params.favQuestionAry

    const [openButton, setOpenButton] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [reportMsg, setReportMsg] = useState('')
    const [questionAry, setQuestionAry] = useState([])
    const [isLoad, setIsLoad] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [questionId, setQuestionId] = useState(props.route.params.id)
    const pagerViewRef = useRef(null)

    //儲存錯誤訊息
    const reportMsgHandler = (text) => {
        setReportMsg(text)
    }

    // 送出錯誤訊息
    const sendReportMsg = async () => {
        if (reportMsg.trim() === '') {
            Alert.alert('請填寫錯誤訊息!', '', [], {
                cancelable: true,
            })
            return
        }
        setIsLoad(true)
        await API.graphql(
            graphqlOperation(createReport, {
                input: {
                    questionId: questionId,
                    errorMsg: reportMsg,
                    state: '處理中',
                    result: '',
                    reason: '',
                    createDate: moment().format('YYYY/MM/DD HH:mm:ss (dd)'),
                    updateDate: '',
                    remark: '',
                },
            })
        )
            .then(() => {
                Alert.alert('送出成功!', '感謝你的回報。', [], {
                    cancelable: true,
                })
                Keyboard.dismiss()
                setOpenDialog(false)
                setIsLoad(false)
            })
            .catch((err) => {
                errorHandler(err)
            })
    }

    //新增或取消收藏 呼叫redux改變狀態
    async function favoriteChangeHandler () {
        await fetchFavoriteAll().then((data) => {
            const favAry = data.map((item) => item.questionId)
            dispatch(change(favAry))
        })
    }

    // 檢查收藏是否取消或存在
    useEffect(() => {
        ; (async function querySql () {
            await fetchFavorite(questionId).then((dbResult) => {
                if (dbResult !== null) setIsFavorite(true)
                else setIsFavorite(false)
            })
        })()
    }, [favoriteAry, questionId])

    //用副標題查詢問題
    useEffect(() => {
        ; (async function fetchQuestion () {
            //因為跟最愛題目共用，所以查詢條件要分開
            let condition = {}
            if (favQuestionAry !== undefined && favQuestionAry !== null) {
                //最愛題目加上最愛題目的id
                let favParams = []
                for (favObj of favQuestionAry) {
                    favParams.push({
                        id: { eq: favObj.id },
                    })
                }
                condition = {
                    and: [
                        {
                            subtitle: {
                                eq: subtitle,
                            },
                        },
                        {
                            show: {
                                eq: true,
                            },
                        },
                        {
                            or: favParams,
                        },
                    ],
                }
            } else {
                //一般查詢副標題下全部的題目
                condition = {
                    and: [
                        {
                            subtitle: {
                                eq: subtitle,
                            },
                        },
                        {
                            show: {
                                eq: true,
                            },
                        },
                    ],
                }
            }
            await API.graphql(
                graphqlOperation(listQuestions, {
                    filter: condition,
                })
            )
                .then((response) => {
                    setQuestionAry(
                        response.data.listQuestions.items.sort((a, b) => a.order - b.order)
                    )
                })
                .catch((err) => {
                    errorHandler(err)
                })
        })()
        pagerViewRef.current.setPageWithoutAnimation(order)
    }, [])

    //PagerView的initialPage對動態產生的不起作用，所以就設定當questionAry完成時執行切換
    useEffect(() => {
        if (favQuestionAry !== undefined && favQuestionAry !== null) {
            initFavIndex = questionAry.findIndex((value) => value.id === questionId)
            pagerViewRef.current.setPageWithoutAnimation(initFavIndex)
        } else {
            pagerViewRef.current.setPageWithoutAnimation(order - 1)
        }
    }, [questionAry])

    return (
        <>
            <PagerView
                ref={pagerViewRef}
                style={styles.pagerView}
                onPageSelected={(e) => {
                    const questionObj = questionAry.find(
                        (value) => value.order === e.nativeEvent.position + 1
                    )
                    if (questionObj !== null && questionObj !== undefined) {
                        setQuestionId(questionObj.id)
                    }
                }}>
                {questionAry.length === 0 ? (
                    <ActivityIndicator size="large" />
                ) : (
                    questionAry.map((item) => {
                        return (
                            <View key={item.id}>
                                <View style={styles.questionArea}>
                                    <MyText style={styles.questionFont}>{item.question}</MyText>
                                </View>
                                <ScrollView
                                    style={styles.answerArea}
                                    showsVerticalScrollIndicator={false}>
                                    <Markdown>{item.answer}</Markdown>
                                </ScrollView>
                            </View>
                        )
                    })
                )}
            </PagerView>
            <SpeedDial
                isOpen={openButton}
                icon={<Entypo name="dots-three-vertical" size={24} color={'white'} />}
                openIcon={{ name: 'close', color: 'white' }}
                onOpen={() => setOpenButton(!openButton)}
                onClose={() => setOpenButton(!openButton)}
                color={Colors.SpeedDialColor}>
                <SpeedDial.Action
                    icon={<MaterialIcons name="error" size={20} color="white" />}
                    title="錯誤回報"
                    onPress={() => {
                        setOpenDialog(!openDialog)
                        setOpenButton(!openButton)
                    }}
                    color={Colors.SpeedDialColor}
                />
                {isFavorite ? (
                    <SpeedDial.Action
                        icon={
                            <Ionicons name="heart" size={20} color={Colors.FavoriteColor} />
                        }
                        title="取消收藏"
                        onPress={async () => {
                            await deleteFavorite(questionId).then(() => {
                                setIsFavorite(false)
                                favoriteChangeHandler()
                            })
                        }}
                        color={Colors.SpeedDialColor}
                    />
                ) : (
                    <SpeedDial.Action
                        icon={<Ionicons name="heart-outline" size={20} color="white" />}
                        title="加入收藏"
                        onPress={async () => {
                            await insertFavorite(questionId).then(() => {
                                setIsFavorite(true)
                                favoriteChangeHandler()
                            })
                        }}
                        color={Colors.SpeedDialColor}
                    />
                )}
            </SpeedDial>
            <Dialog
                isVisible={openDialog}
                onBackdropPress={() => {
                    if (openDialog && isLoad) return setOpenDialog(true)
                    else return setOpenDialog(!openDialog)
                }}>
                <View style={styles.reportMargin}>
                    <MyText>
                        請描述錯誤問題，可以打字，也可以貼網址，總之就是有辦法說明錯誤都可以。
                    </MyText>
                </View>
                <View style={styles.reportMargin}>
                    <Input
                        placeholder="說明錯誤問題"
                        value={reportMsg}
                        leftIcon={<MaterialIcons name="error" size={20} color="black" />}
                        onChangeText={reportMsgHandler}
                    />
                </View>

                <Button
                    size="sm"
                    onPress={sendReportMsg}
                    loading={isLoad}
                    disabled={isLoad}>
                    送出
                </Button>
            </Dialog>
        </>
    )
}

const styles = StyleSheet.create({
    questionArea: {
        backgroundColor: 'yellow',
        marginBottom: 20,
    },
    questionFont: {
        paddingHorizontal: 10,
        fontSize: 22,
    },
    answerArea: {
        width: '90%',
        alignSelf: 'center',
        marginBottom: '4%',
    },
    answerFont: {
        fontSize: 16,
        padding: 15,
    },
    reportMargin: {
        marginTop: 10,
    },
    pagerView: {
        flex: 1,
    },
})
