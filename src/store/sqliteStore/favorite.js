import { getAllFavorite, insertFavorite, deleteFavorite } from '../../services'

// 收藏狀態管理
export default (set) => {
  return {
    favoriteList: null,
    addFavorite: async (subtitle, questionID) => {
      await insertFavorite(subtitle, questionID)
      const result = await getAllFavorite()
      set({ favoriteList: [...result] })
    },
    deleteFavorite: async (questionID) => {
      await deleteFavorite(questionID);
      const result = await getAllFavorite()
      set({ favoriteList: [...result] })
    },
    getFavoriteList: async () => {
      const result = await getAllFavorite()
      set({ favoriteList: [...result] })
    }
  }
}
