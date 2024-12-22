import { create } from "zustand";
import { default as useSettingStore } from "./settingStore/settingStore";

const useStore = create((...set) => {
  return {
    ...useSettingStore(...set),
  };
});

export default useStore;
