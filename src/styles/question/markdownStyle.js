

const markdownStyle = (setting) => {
	return {
		//一般文字的調整
		body: {
			fontSize: setting.answerTextSize,
			color: setting.darkMode ? '#FCFCFC' : '#272727',
			fontFamily: 'LXGWWenKaiTC-Regular'
		},

		//list 前面的icon顏色調整
		bullet_list_icon: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			color: setting.darkMode ? '#FCFCFC' : '#272727'
		},
		ordered_list_icon: {
			color: setting.darkMode ? '#FCFCFC' : '#272727'
		},

		//換bold完全看不出差別，就還是先不換了，但bold字體保留
		//粗體字要把預設的bold取消，把字體換成bold
		// strong: {
		// 	fontWeight: '',
		// 	fontFamily: 'LXGWWenKaiTC-Bold',
		// },

		//``區塊裡面的設定
		code_inline: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			backgroundColor: setting.darkMode ? '#5B5B5B' : '#f5f5f5',
		},
		//程式區塊裡面的設定
		fence: {
			backgroundColor: setting.darkMode ? '#5B5B5B' : '#f5f5f5',
		},

		//各種標題的設定
		heading1: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			fontSize: setting.answerTextSize + 10,
		},
		heading2: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			fontSize: setting.answerTextSize + 8,
		},
		heading3: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			fontSize: setting.answerTextSize + 4,
		},
		heading4: {
			fontFamily: 'LXGWWenKaiTC-Regular',
			fontSize: setting.answerTextSize + 2,
		}
	}
}

export default markdownStyle