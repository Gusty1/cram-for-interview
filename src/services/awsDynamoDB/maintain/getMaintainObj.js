import { API, graphqlOperation } from 'aws-amplify'
import { getMaintain } from '../../../graphql/queries'
import { defaultSetting } from '../../../constants'

const getMaintainObj = async () => {
	try {
		const result = await API.graphql(
			graphqlOperation(getMaintain, {
				id: defaultSetting.maintainID
			})
		)
		return result.data.getMaintain
	} catch (error) {
		console.error('getQuestions error:　', error)
		return null
	}
}

export default getMaintainObj
