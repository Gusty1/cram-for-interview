import { getSubjects } from "../../services";
import { getSubtitles, getQuestions } from "../../services";

/**
 * 快取狀態管理
 * 透過 TTL 機制避免重複呼叫 API，資料在有效期內直接從 store 取用
 */
const CACHE_TTL = 5 * 60 * 1000; // 5 分鐘

const isCacheValid = (timestamp) => {
  return timestamp && Date.now() - timestamp < CACHE_TTL;
};

export default (set, get) => {
  return {
    // 快取資料結構
    cachedSubjects: { data: null, timestamp: null },
    cachedSubtitles: {}, // { [subjectEN]: { data, timestamp } }
    cachedQuestions: {}, // { [subtitleEN]: { data, timestamp } }

    /**
     * 取得主題列表（帶快取）
     * @param {boolean} forceRefresh - 是否強制重新拉取
     */
    getCachedSubjects: async (forceRefresh = false) => {
      const { cachedSubjects } = get();
      if (!forceRefresh && isCacheValid(cachedSubjects.timestamp)) {
        return cachedSubjects.data;
      }
      const data = await getSubjects();
      data.sort((a, b) => a.en_name.localeCompare(b.en_name));
      set({ cachedSubjects: { data, timestamp: Date.now() } });
      return data;
    },

    /**
     * 取得子項目列表（帶快取）
     * @param {string} subjectEN - 主題英文名
     * @param {boolean} forceRefresh - 是否強制重新拉取
     */
    getCachedSubtitles: async (subjectEN, forceRefresh = false) => {
      const { cachedSubtitles } = get();
      const cached = cachedSubtitles[subjectEN];
      if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }
      const data = await getSubtitles(subjectEN);
      set((state) => ({
        cachedSubtitles: {
          ...state.cachedSubtitles,
          [subjectEN]: { data, timestamp: Date.now() },
        },
      }));
      return data;
    },

    /**
     * 取得問題列表（帶快取）
     * @param {string} subtitleEN - 子項目英文名
     * @param {boolean} forceRefresh - 是否強制重新拉取
     */
    getCachedQuestions: async (subtitleEN, forceRefresh = false) => {
      const { cachedQuestions } = get();
      const cached = cachedQuestions[subtitleEN];
      if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
        return cached.data;
      }
      const data = await getQuestions(subtitleEN);
      data.sort((a, b) => b.useful - a.useful);
      set((state) => ({
        cachedQuestions: {
          ...state.cachedQuestions,
          [subtitleEN]: { data, timestamp: Date.now() },
        },
      }));
      return data;
    },

    /**
     * 批次取得多個 subtitle 的問題（解決 N+1 問題）
     * 先檢查快取，只對未快取的 subtitle 發送請求
     * @param {Array} subtitleENList - 子項目英文名陣列
     * @param {boolean} forceRefresh - 是否強制重新拉取
     * @returns {Object} { [subtitleEN]: questions[] }
     */
    getCachedQuestionsBatch: async (subtitleENList, forceRefresh = false) => {
      const { cachedQuestions } = get();
      const result = {};
      const toFetch = [];

      // 先從快取取，未命中的加入待拉取清單
      for (const subtitleEN of subtitleENList) {
        const cached = cachedQuestions[subtitleEN];
        if (!forceRefresh && cached && isCacheValid(cached.timestamp)) {
          result[subtitleEN] = cached.data;
        } else {
          toFetch.push(subtitleEN);
        }
      }

      // 並行拉取未快取的資料
      if (toFetch.length > 0) {
        const fetched = await Promise.all(
          toFetch.map(async (subtitleEN) => {
            const data = await getQuestions(subtitleEN);
            data.sort((a, b) => b.useful - a.useful);
            return { subtitleEN, data };
          }),
        );
        const updates = {};
        for (const { subtitleEN, data } of fetched) {
          result[subtitleEN] = data;
          updates[subtitleEN] = { data, timestamp: Date.now() };
        }
        set((state) => ({
          cachedQuestions: { ...state.cachedQuestions, ...updates },
        }));
      }

      return result;
    },

    /** 清除所有快取 */
    clearCache: () => {
      set({
        cachedSubjects: { data: null, timestamp: null },
        cachedSubtitles: {},
        cachedQuestions: {},
      });
    },
  };
};
