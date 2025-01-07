
//答案要不要顯示的狀態(面試模式)
export default (set) => {
	return {
		answerShow: false,
		answerShowChange: (state) => {
			set({ answerShow: state })
		}
	}
}
