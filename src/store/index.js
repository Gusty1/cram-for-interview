import { create } from "zustand";
import { default as useSettingStore } from "./settingStore/settingStore";
import { default as useNetStore } from "./netStore/netStore";

const useStore = create((...set) => {
  return {
    ...useSettingStore(...set),
    ...useNetStore(...set),
  };
});

export default useStore;
