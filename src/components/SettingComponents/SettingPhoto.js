import { memo, useCallback } from 'react'
import { Image, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

/** 新增問題時顯示的圖片預覽 */
const SettingPhoto = memo(({ imageObj, deleteImages }) => {
	const handleDelete = useCallback(
		() => deleteImages(imageObj.id),
		[deleteImages, imageObj.id]
	)

	return (
		<>
			<Image style={styles.image} source={{ uri: imageObj.uri }} />
			<IconButton
				icon="close"
				mode='contained'
				size={18}
				iconColor='red'
				onPress={handleDelete}
				style={styles.deleteBtn}
			/>
		</>
	)
})

const styles = StyleSheet.create({
	image: {
		width: 110,
		height: 150,
		borderRadius: 5,
		borderWidth: 1,
	},
	deleteBtn: {
		position: 'absolute',
		right: 0,
		top: 0,
	},
})

export default SettingPhoto
