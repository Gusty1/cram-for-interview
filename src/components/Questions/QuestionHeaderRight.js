
import { IconButton } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'
import useStore from '../../store'

const QuestionHeaderRight = () => {
	const { answerShow, answerShowChange } = useStore()

	return (
		<IconButton
			icon={({ size, color }) => (
				<MaterialIcons
					name='hide-source'
					size={size}
					color={color}
				/>
			)}
			mode={answerShow ? 'contained' : 'contained-tonal'}
			selected
			//不知道為什麼觸發很遲緩，有時候沒有反應，有時候又要點2下才會有反應，所以用pressIn取代
			onPressIn={() => answerShowChange(!answerShow)}
		/>
	)
}

export default QuestionHeaderRight