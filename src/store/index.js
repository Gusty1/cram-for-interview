import { create } from "zustand"
import { default as useSettingStore } from "./settingStore/settingStore"
import { default as useNetStore } from "./netStore/netStore"
import { default as useFavoriteStore } from "./sqliteStore/favorite"
import { default as useThumbStore } from "./sqliteStore/thumb"

const useStore = create((...set) => {
  return {
    ...useSettingStore(...set),
    ...useNetStore(...set),
    ...useFavoriteStore(...set),
    ...useThumbStore(...set)
  }
})

export default useStore
