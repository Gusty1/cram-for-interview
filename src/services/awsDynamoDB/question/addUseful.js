import { generateClient } from "aws-amplify/api";
import { getQuestion } from "../../../graphql/queries";
import { updateQuestion } from "../../../graphql/mutations";

/**
 * 更新 question 的 useful 計數（按讚 / 取消讚）
 *
 * 已知限制：此操作為 Read-Modify-Write，在高並發下仍有極低機率的計數遺失。
 * 根本解法需在 AppSync 啟用 conflict resolution 或改用自訂 Lambda resolver
 * 以使用 DynamoDB 原子 ADD 操作。在目前 Amplify 自動生成 schema 架構下，
 * 此為最低成本的折衷方案（失敗時自動重試一次）。
 *
 * @param {string} id - 題目 ID
 * @param {'add'|'minus'} option - 操作類型
 * @param {number} retries - 剩餘重試次數（內部遞迴使用）
 */
const addUseful = async (id, option = null, retries = 1) => {
  try {
    const client = generateClient();
    const question = await client.graphql({
      query: getQuestion,
      variables: { id },
    });

    const currentUseful = question?.data?.getQuestion?.useful;
    if (currentUseful == null) return;

    let newUseful;
    if (option === "add") {
      newUseful = currentUseful + 1;
    } else if (option === "minus") {
      newUseful = Math.max(0, currentUseful - 1);
    } else {
      return;
    }

    await client.graphql({
      query: updateQuestion,
      variables: {
        input: { id, useful: newUseful },
      },
    });
  } catch (error) {
    // ConditionalCheckFailedException 代表並發衝突，嘗試重試一次
    if (retries > 0) {
      await addUseful(id, option, retries - 1);
    } else {
      console.error("addUseful error:", error);
    }
  }
};

export default addUseful;
