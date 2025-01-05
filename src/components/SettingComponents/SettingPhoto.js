import { Image, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { settingStyle } from '../../styles'

//設定新增問題時顯示的圖片預覽
const SettingPhoto = ({ imageObj, deleteImages }) => {
	return (
		<View style={settingStyle.imageItem}>
			<Image style={{ flex: 1, borderRadius: 5 }}
				source={{ uri: imageObj.uri }} />
			<IconButton
				icon="close"
				mode='contained'
				size={18}
				iconColor='red'
				onPress={() => deleteImages(imageObj.id)}
				style={{ position: 'absolute', right: 0, top: 0 }}
			/>
		</View>
	)
}

export default SettingPhoto