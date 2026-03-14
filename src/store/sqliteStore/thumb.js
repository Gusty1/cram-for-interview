import { getAllThumb, insertThumb, deleteThumb, addUseful } from '../../services'

// 按讚狀態管理
export default (set) => {
	return {
		thumbList: null,
		addThumb: async (questionID) => {
			await insertThumb(questionID)
			addUseful(questionID, 'add').catch(e => console.error('addUseful error:', e))
			const result = await getAllThumb()
			set({ thumbList: [...result] })
		},
		deleteThumb: async (questionID) => {
			await deleteThumb(questionID)
			addUseful(questionID, 'minus').catch(e => console.error('addUseful error:', e))
			const result = await getAllThumb()
			set({ thumbList: [...result] })
		},
		getThumbList: async () => {
			const result = await getAllThumb()
			set({ thumbList: [...result] })
		}
	}
}
