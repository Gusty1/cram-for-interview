import { create } from "zustand"
import { default as useSettingStore } from "./settingStore/settingStore"
import { default as useNetStore } from "./netStore/netStore"
import { default as useFavoriteStore } from "./sqliteStore/favorite"
import { default as useThumbStore } from "./sqliteStore/thumb"
import { default as answerShowStore } from "./answerShowStore/answerShowStore"

const useStore = create((...set) => {
  return {
    ...useSettingStore(...set),
    ...useNetStore(...set),
    ...useFavoriteStore(...set),
    ...useThumbStore(...set),
    ...answerShowStore(...set)
  }
})

export default useStore
