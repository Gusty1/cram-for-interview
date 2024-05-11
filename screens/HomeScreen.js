import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

import EnglishSentenceCard from '../components/EnglishSentenceCard'
import SubjectCube from '../components/SubjectCube'
import { change } from '../store/slices/favoriteSlices'
import { fetchFavoriteAll } from '../sqlLite/db'
import Styles from '../constants/Styles'
import { errorHandler } from '../tools/OtherTool'
import { IUDOption } from '../awsDataOption/baseOption'

/**
 * 首頁螢幕，顯示英文句子和主題方塊
 * @param {*} props 
 * @returns 
 */
export default function HomeScreen (props) {
    const dispatch = useDispatch()

    useEffect(() => {
        //新增問題
        // IUDOption()
        //     .then((data) => {
        //         console.log(data)
        //     })
        //     .catch((err) => {
        //         errorHandler(err)
        //     })
        async function getFavoriteData () {
            await fetchFavoriteAll()
                .then((data) => {
                    if (data.length !== 0) {
                        const favAry = data.map((item) => item.questionId)
                        dispatch(change(favAry))
                    }
                })
                .catch((err) => {
                    errorHandler(err)
                })
        }
        getFavoriteData()
    }, [])

    return (
        <View style={{ ...Styles.defaultMainContainer }}>
            <EnglishSentenceCard {...props} />
            <SubjectCube {...props} />
        </View>
    )
}
