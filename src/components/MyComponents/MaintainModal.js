import { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useVideoPlayer, VideoView } from 'expo-video'
import { Modal, Portal } from 'react-native-paper'
import dayjs from 'dayjs'
import MyText from './MyText'
import { commonStyle } from '../../styles'

//維護中的modal
const MaintainModal = ({ maintainInfo }) => {
	const [thisMaintainInfo, setThisMaintainInfo] = useState(null)

	useEffect(() => {
		const newMaintainInfo = {
			...maintainInfo,
			endDate: dayjs(maintainInfo.endDate).endOf('day').format('YYYY/MM/DD HH:mm'),
		}
		setThisMaintainInfo(newMaintainInfo)
	}, [maintainInfo])

	//安卓+expo要讓gif動起來只能轉成影片，並用expo-video才可以
	const player = useVideoPlayer(require('../../assets/videos/fix.mp4'), player => {
		player.loop = true;
		player.play();
	})

	const showInfo = () => {
		if (thisMaintainInfo) {
			return (
				<View>
					<MyText style={{ color: '#007500' }}>
						維護時間: now ~ {thisMaintainInfo.endDate}
					</MyText>
					<MyText style={{ color: '#007500' }}>
						{thisMaintainInfo.showText}
					</MyText>
					<MyText style={{ color: '#007500' }}>
						{thisMaintainInfo.remark}
					</MyText>
				</View>
			)
		} else {
			return null
		}
	}

	return (
		<Portal>
			<Modal
				visible={true}
				dismissable={false}
				contentContainerStyle={commonStyle.noErrModalContainer}
			>
				<MyText style={{ textAlign: 'center', fontSize: 32, fontWeight: 'bold', color: '#FF5809' }}>
					維護中
				</MyText>
				{showInfo()}
				<VideoView player={player} style={{ width: 290, height: 300 }} />
			</Modal>
		</Portal>
	)
}

export default MaintainModal
