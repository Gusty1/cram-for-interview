import { useEffect } from 'react';
import { Image, BackHandler } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import MyText from './MyText';

const ErrorModal = ({ resetErrorBoundary }) => {
	useEffect(() => {
		// 當返回鍵按下時，重設 error boundary
		const back = BackHandler.addEventListener('hardwareBackPress', () => {
			resetErrorBoundary();
			return true;
		});
		return () => back.remove();
	}, [resetErrorBoundary]);

	return (
		<Portal>
			<Modal
				visible={true}
				onDismiss={resetErrorBoundary}
				contentContainerStyle={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: 'rgba(153, 149, 149, 0.65)',
					elevation: 4,
				}}
				style={{ paddingHorizontal: 20, paddingVertical: 100 }}
			>
				<MyText variant="titleLarge">很抱歉，發生了一些問題</MyText>
				<Image
					style={{
						height: 300,
						width: 300,
						resizeMode: 'contain',
					}}
					source={require('../../assets/images/sorry.png')}
				/>
			</Modal>
		</Portal>
	);
};

export default ErrorModal;
