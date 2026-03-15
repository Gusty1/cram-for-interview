import { memo, useCallback } from 'react'
import { Image, View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

/** 新增問題時顯示的圖片預覽，X 按鈕浮在圖片右上角 */
const SettingPhoto = memo(({ imageObj, deleteImages }) => {
	const handleDelete = useCallback(
		() => deleteImages(imageObj.id),
		[deleteImages, imageObj.id]
	)

	return (
		<View style={styles.wrapper}>
			<Image style={styles.image} source={{ uri: imageObj.uri }} />
			<IconButton
				icon="close-circle"
				size={22}
				iconColor='#fff'
				containerColor='rgba(0,0,0,0.55)'
				onPress={handleDelete}
				style={styles.deleteBtn}
			/>
		</View>
	)
})

const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
	},
	image: {
		width: 110,
		height: 150,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	deleteBtn: {
		position: 'absolute',
		right: -8,
		top: -8,
		margin: 0,
	},
})

export default SettingPhoto
