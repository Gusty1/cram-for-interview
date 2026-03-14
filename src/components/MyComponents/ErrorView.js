import { useEffect } from 'react';
import { Image, BackHandler, View, Dimensions, Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as MailComposer from 'expo-mail-composer';
import { emailInfo, defaultSetting } from '../../constants'
import MyText from './MyText';

const { width, height } = Dimensions.get('window');

const ErrorView = ({ error, resetError }) => {
	useEffect(() => {
		const back = BackHandler.addEventListener('hardwareBackPress', () => {
			resetError();
			return true;
		});
		return () => back.remove();
	}, [resetError]);

	const sendEmail = async () => {
		const isAvailable = await MailComposer.isAvailableAsync()
		if (!isAvailable) {
			Alert.alert('無法發送郵件', '此裝置不支持郵件撰寫功能。')
			return
		}
		try {
			const result = await MailComposer.composeAsync(emailInfo)
			if (result.status === MailComposer?.Status?.SENT) {
				Alert.alert('送出成功')
			}
		} catch (error) {
			Alert.alert(defaultSetting.errMsg)
			console.error(error)
		}
	}

	return (
		<View style={styles.container}>
			<MyText variant="titleLarge">很抱歉，發生了一些問題...</MyText>
			<MyText variant="bodyLarge" style={styles.subtitle}>
				如果願意動動手指幫忙回報一下問題，我會很感謝的
			</MyText>
			<View style={styles.center}>
				<View style={styles.buttonRow}>
					<Button icon="home" mode="contained" onPress={() => resetError()}>
						回首頁
					</Button>
					<Button icon="email" mode="contained" onPress={() => sendEmail()}>
						問題回報
					</Button>
				</View>
				<Image
					style={styles.image}
					source={require('../../assets/images/sorry.png')}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'rgba(153, 149, 149, 0.65)',
		paddingHorizontal: 20,
	},
	subtitle: {
		paddingVertical: 10,
	},
	center: {
		alignItems: 'center',
	},
	buttonRow: {
		paddingVertical: 20,
		flexDirection: 'row',
		gap: 10,
	},
	image: {
		height: height * 0.4,
		width: width * 0.8,
		resizeMode: 'contain',
	},
});

export default ErrorView;
