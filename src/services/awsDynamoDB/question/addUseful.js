import { generateClient } from 'aws-amplify/api';
import { getQuestion } from '../../../graphql/queries'
import { updateQuestion } from '../../../graphql/mutations'

/**
 * 更新 question 的 useful 計數（按讚 / 取消讚）
 * @param {string} id - 題目 ID
 * @param {'add'|'minus'} option - 操作類型
 */
const addUseful = async (id, option = null) => {
	try {
		const client = generateClient()
		const question = await client.graphql({
			query: getQuestion,
			variables: { id }
		})

		const currentUseful = question?.data?.getQuestion?.useful
		if (currentUseful == null) return

		let newUseful
		if (option === 'add') {
			newUseful = currentUseful + 1
		} else if (option === 'minus') {
			newUseful = Math.max(0, currentUseful - 1)
		} else {
			return
		}

		await client.graphql({
			query: updateQuestion,
			variables: {
				input: { id, useful: newUseful }
			}
		})
	} catch (error) {
		console.error('addUseful error:', error)
	}
}

export default addUseful
