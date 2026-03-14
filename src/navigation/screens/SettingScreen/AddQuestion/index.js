import { useState, useCallback } from 'react';
import { View, ScrollView, Alert, StyleSheet } from 'react-native'
import { TextInput, Button, HelperText, Modal, Portal, ActivityIndicator, Divider } from 'react-native-paper'
import { useForm, Controller } from 'react-hook-form'
import uuid from 'react-native-uuid'
import * as ImagePicker from 'expo-image-picker'
import { commonStyle } from '../../../../styles'
import { addNewQuestion, apiClient } from '../../../../services'
import { MyText, SettingPhoto } from '../../../../components'
import { defaultSetting } from '../../../../constants'
import useStore from '../../../../store'

/**
 * 選擇圖片來源（相機或相簿），統一處理權限與結果
 * @param {'camera'|'library'} source - 圖片來源
 */
const launchPicker = async (source) => {
	// 請求對應權限
	if (source === 'camera') {
		const camPerm = await ImagePicker.requestCameraPermissionsAsync()
		if (!camPerm.granted) {
			Alert.alert('提示', '相機權限遭拒絕，請至設定中開啟')
			return null
		}
	}
	const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync()
	if (!libPerm.granted) {
		Alert.alert('提示', '相簿權限遭拒絕，請至設定中開啟')
		return null
	}

	const options = {
		mediaTypes: ['images'],
		quality: 1,
		aspect: [4, 3],
	}

	const result = source === 'camera'
		? await ImagePicker.launchCameraAsync(options)
		: await ImagePicker.launchImageLibraryAsync({
			...options,
			allowsMultipleSelection: true,
		})

	if (result.canceled) return null
	return result.assets.map((item) => ({
		id: uuid.v4(),
		uri: item.uri,
	}))
}

/** 新增問題的頁面 */
const AddQuestion = ({ navigation }) => {
	const { control, handleSubmit, formState: { errors } } = useForm()
	const [imageAry, setImageAry] = useState([])
	const [showModal, setShowModal] = useState(false)
	const { setting } = useStore()

	// 上傳圖片到 imgur
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

		const responses = await Promise.all(uploadPromises)
		return responses.map((item) => ({ link: item.data.link }))
	}

	// 表單提交
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
			navigation.navigate('SettingScreen', { send: true })
		} catch (e) {
			Alert.alert(defaultSetting.errMsg)
			console.error('sendNewQuestion error: ', e)
		} finally {
			setShowModal(false)
		}
	}

	const deleteImages = useCallback((id) => {
		setImageAry(prev => prev.filter(item => item.id !== id))
	}, [])

	// 統一的圖片選擇入口
	const handlePickMedia = useCallback(async (source) => {
		const assets = await launchPicker(source)
		if (assets) setImageAry(prev => [...prev, ...assets])
	}, [])

	const handleCamera = useCallback(() => handlePickMedia('camera'), [handlePickMedia])
	const handleLibrary = useCallback(() => handlePickMedia('library'), [handlePickMedia])

	const modalStyle = {
		...styles.sendModal,
		backgroundColor: setting?.darkMode ? '#3d3a27' : '#ffebcd'
	}

	return (
		<View style={commonStyle.mainContainer}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* -- 個人資訊（選填）-- */}
				<MyText style={styles.sectionTitle}>個人資訊（選填）</MyText>
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
							placeholder='會列在感謝名單上'
						/>
					)}
					name="username"
				/>
				<HelperText type="info" visible={true}>
					<MyText style={{ color: 'gray' }}>可以留個名稱，會列在感謝名單上</MyText>
				</HelperText>
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
							placeholder='方便確認問題時聯繫'
						/>
					)}
					name="email"
				/>
				<HelperText type="info" visible={true}>
					<MyText style={{ color: 'gray' }}>可以留個電子郵件，方便我跟你確認</MyText>
				</HelperText>

				<Divider style={styles.divider} />

				{/* -- 題目資訊（必填）-- */}
				<MyText style={styles.sectionTitle}>題目資訊</MyText>
				<Controller
					control={control}
					rules={{ required: '主題必須輸入' }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>主題 *</MyText>}
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
					rules={{ required: '子項目必須輸入' }}
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label={<MyText>子項目 *</MyText>}
							mode="outlined"
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							placeholder='ex: 像是程式的話有 Java、C#...'
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
							placeholder='如果圖片已包含問題，可以不輸入'
						/>
					)}
					name="question"
				/>

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
							placeholder='如果圖片已包含答案，可以不輸入'
							style={styles.answerInput}
						/>
					)}
					name="answer"
				/>

				<Divider style={styles.divider} />

				{/* -- 圖片附件 -- */}
				<MyText style={styles.sectionTitle}>圖片附件（選填）</MyText>
				<HelperText visible={true} type='info'>
					<MyText style={styles.tipText}>請不要上傳有關公司、個人資訊的圖片</MyText>
				</HelperText>

				{imageAry.length > 0 && (
					<View style={styles.imageContainer}>
						{imageAry.map((item) => (
							<SettingPhoto key={item.id} imageObj={item} deleteImages={deleteImages} />
						))}
					</View>
				)}

				<View style={styles.imageButtonRow}>
					<Button icon="camera" mode="contained-tonal" onPress={handleCamera}>
						<MyText>拍照</MyText>
					</Button>
					<Button icon="image" mode="contained-tonal" onPress={handleLibrary}>
						<MyText>選擇圖片</MyText>
					</Button>
				</View>

				<Divider style={styles.divider} />

				{/* -- 送出 -- */}
				<Button icon="send" mode="contained" onPress={handleSubmit(sendNewQuestion)}
					style={styles.submitBtn}>
					<MyText>送出</MyText>
				</Button>

				<Portal>
					<Modal
						visible={showModal}
						dismissable={false}
						dismissableBackButton={false}
						contentContainerStyle={modalStyle}>
						<ActivityIndicator size='large' />
						<MyText style={styles.modalText}>送出中...</MyText>
					</Modal>
				</Portal>
			</ScrollView>
		</View>
	)
}

const styles = StyleSheet.create({
	scrollContent: {
		gap: 8,
		paddingBottom: 30,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 4,
	},
	divider: {
		marginVertical: 10,
	},
	answerInput: {
		height: 150,
	},
	tipText: {
		color: 'gray',
		textAlign: 'center',
	},
	imageContainer: {
		flexDirection: 'row',
		gap: 12,
		justifyContent: 'flex-start',
		flexWrap: 'wrap',
	},
	imageButtonRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10,
	},
	submitBtn: {
		marginBottom: 10,
	},
	sendModal: {
		padding: 20,
		marginHorizontal: 80,
		borderRadius: 10,
	},
	modalText: {
		textAlign: 'center',
		marginTop: 20,
	},
})

export default AddQuestion;
