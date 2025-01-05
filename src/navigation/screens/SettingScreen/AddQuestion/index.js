import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native'
import { TextInput, Button, HelperText, Modal, Portal, ActivityIndicator } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import uuid from 'react-native-uuid'
import * as ImagePicker from 'expo-image-picker'
import { settingStyle, commonStyle } from '../../../../styles'
import { addNewQuestion, apiClient } from '../../../../services'
import { MyText, SettingPhoto } from '../../../../components'
import { defaultSetting } from '../../../../constants'
import useStore from '../../../../store'

//新增問題的頁面
const AddQuestion = ({ navigation }) => {
	const { control, handleSubmit, formState: { errors } } = useForm()
	const [imageAry, setImageAry] = useState([])
	const [showModal, setShowModal] = useState(false)
	const { setting } = useStore()

	//上傳圖片到imgur，由於aws dynamoDB 單次上傳不能超過400kb，轉成base64一定會超過...
	const uploadImages = async (data) => {
		const uploadPromises = imageAry.map((item, index) => {
			const formData = new FormData();
			formData.append('image', {
				uri: item.uri,
				type: 'image/jpeg',
				name: data.subject + '-' + data.subtitle + '-' + index + '.jpg'
			})

			return apiClient.post(defaultSetting.imgurUrl, formData, {
				headers: {
					'Authorization': 'Client-ID ' + defaultSetting.clientID,
					'Content-Type': 'multipart/form-data',
				}
			})
		})

		// 等待所有圖片上傳完成
		const responses = await Promise.all(uploadPromises);
		const returnImgUrl = responses.map((item) => {
			return {
				link: item.data.link
			}
		})

		return returnImgUrl
	}

	// 表單提交時的處理函數
	const sendNewQuestion = async (data) => {
		try {
			setShowModal(true)
			if (imageAry.length > 0) {
				const imagesUrlAry = await uploadImages(data)
				data = { ...data, images: JSON.stringify(imagesUrlAry), result: '', status: '' }
			} else {
				data = { ...data, images: '', result: '', status: '' }
			}
			await addNewQuestion(data)
			navigation.navigate('SettingScreen', {
				send: true
			})
		} catch (e) {
			Alert(defaultSetting.errMsg)
			console.error('sendNewQuestion error: ', e)
		} finally {
			setShowModal(false)
		}
	}

	//刪除圖片
	const deleteImages = (id) => {
		const temp = imageAry.filter(item => item.id !== id)
		setImageAry(temp)
	}

	// 選擇圖片的函數
	const pickImage = async () => {
		// 請求權限
		let libraryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (libraryPermissionResult.granted === false) {
			alert('使用權限遭拒絕!')
			return
		}

		// 開啟圖片選擇器
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'images',
			allowsEditing: false,
			allowsMultipleSelection: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled) {
			const finalImagAry = result.assets.map((item) => {
				return {
					id: uuid.v4(),
					uri: item.uri,
				}
			})
			setImageAry([...imageAry, ...finalImagAry])
		}
	}
	//使用相機
	const useCamera = async () => {
		// 請求權限
		let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		let libraryPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false || libraryPermissionResult.granted === false) {
			alert('使用權限遭拒絕!')
			return
		}

		// 使用相機的設定
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: 'images',
			// allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		})

		if (!result.canceled) {
			setImageAry([...imageAry, {
				id: uuid.v4(),
				uri: result.assets[0].uri
			}])
		}
	}

	//開啟鍵盤時都會enter變成送出，目前只能想到multiline={true}來解決
	return (
		<View style={commonStyle.mainContainer}>
			<ScrollView contentContainerStyle={{ gap: 10 }}>
				{/* 表單輸入欄位 */}
				<View>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								label={<MyText>暱稱</MyText>}
								mode="outlined"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								multiline={true}
							/>
						)}
						name="username"
					/>
					<HelperText type="info" visible={true}>
						<MyText style={{ color: 'gray' }}>可以留個名稱，會列在感謝名單上</MyText>
					</HelperText>
				</View>
				<View>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								label={<MyText>電子郵件</MyText>}
								mode="outlined"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								multiline={true}
							/>
						)}
						name="email"
					/>
					<HelperText type="info" visible={true}>
						<MyText style={{ color: 'gray' }}>可以留個電子郵件，方便我跟你確認</MyText>
					</HelperText>
				</View>

				<Controller
					control={control}
					rules={{
						required: '主題必須輸入',
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>主題</MyText>}
							mode="outlined"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							placeholder='ex: 程式、機械...'
							multiline={true}
						/>
					)}
					name="subject"
				/>
				{errors.subject && <HelperText type="error" visible={true}>{errors.subject.message}</HelperText>}

				<Controller
					control={control}
					rules={{
						required: '子項目必須輸入',
					}}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>子項目</MyText>}
							mode="outlined"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							placeholder='ex: 像是程式的話有java、C#...'
							multiline={true}
						/>
					)}
					name="subtitle"
				/>
				{errors.subtitle && <HelperText type="error" visible={true}>{errors.subtitle.message}</HelperText>}

				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>問題</MyText>}
							mode="outlined"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							multiline={true}
							placeholder='如果圖片有包含問題和題目，可以不輸入'
						/>
					)}
					name="question"
				/>
				{errors.question && <HelperText type="error" visible={true}>{errors.question.message}</HelperText>}

				<Controller
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>回答</MyText>}
							mode="outlined"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							multiline={true}
							placeholder='如果圖片有包含問題和題目，可以不輸入'
							style={{ height: 150 }}
						/>
					)}
					name="answer"
				/>
				{errors.answer && <HelperText type="error" visible={true}>{errors.answer.message}</HelperText>}

				{/* 顯示選擇的圖片 */}
				<View style={settingStyle.imageContainer}>
					{imageAry.map((item) => (
						<SettingPhoto key={item.id} imageObj={item} deleteImages={deleteImages} />
					))}
				</View>

				{/* 圖片選擇按鈕 */}
				<HelperText visible={true} type='info'>
					<MyText style={settingStyle.tipText}>請不要上傳有關公司、個人資訊的圖片</MyText>
				</HelperText>
				<View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
					<HelperText type='info'></HelperText>
					<Button icon="camera" mode="contained-tonal" onPress={useCamera}>
						<MyText>拍照</MyText>
					</Button>
					<Button icon="image" mode="contained-tonal" onPress={pickImage}>
						<MyText>選擇圖片</MyText>
					</Button>
				</View>

				{/* 表單提交按鈕 */}
				<Button icon="send" mode="contained" onPress={handleSubmit(sendNewQuestion)}>
					<MyText>送出</MyText>
				</Button>
				<Portal>
					<Modal
						visible={showModal}
						dismissable={false}
						dismissableBackButton={false}
						contentContainerStyle={{
							...settingStyle.sendModal,
							backgroundColor: setting.darkMode ? '#3d3a27' : '#ffebcd'
						}}>
						<ActivityIndicator size='large' />
						<MyText style={{ textAlign: 'center', marginTop: 20 }}>送出中...</MyText>
					</Modal>
				</Portal>
			</ScrollView>
		</View>
	)
}

export default AddQuestion;
