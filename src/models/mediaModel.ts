import { ERROR_MESSAGES } from "@/utils/errorMessages";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TokenContent, QuestItem, UserStats } from "@/types/DBTypes";
import promisePool from "@/lib/db";

import CustomError from "@/classes/CustomError";

const fetchOwnerMedia = async (
  userToken: TokenContent
): Promise<QuestItem[]> => {
  const sql = `SELECT quest_id, title, quest_text, reward_type, reward_count, reset_time, is_done, is_public, created_at FROM Quests WHERE user_id = ?`;
  const params = userToken.user_id;
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & QuestItem[]>(stmt);
  return rows;
};

const fetchOwnerUncompleteMedia = async (
  userToken: TokenContent
): Promise<QuestItem[]> => {
  const sql = `SELECT quest_id, title, quest_text, reward_type, reward_count, reset_time, is_done, is_public, created_at FROM Quests WHERE user_id = ? AND is_done=0 AND selected=0`;
  const params = userToken.user_id;
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & QuestItem[]>(stmt);
  return rows;
};
const fetchOwnerSelectedMedia = async (
  userToken: TokenContent
): Promise<QuestItem[]> => {
  const sql = `SELECT quest_id, title, quest_text, reward_type, reward_count, reset_time, is_done, is_public, created_at FROM Quests WHERE user_id = ? AND is_done=0 AND selected=1`;
  const params = userToken.user_id;
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & QuestItem[]>(stmt);
  return rows;
};

const updateCardSelect = async (item: QuestItem): Promise<void> => {
  console.log(
    `UPDATE Quests SET selected = 1 WHERE quest_id = ${item.quest_id}`
  );
  const sql = `UPDATE Quests SET selected = 1 WHERE quest_id = ?`;
  const stmt = promisePool.format(sql, item.quest_id);
  await promisePool.execute<RowDataPacket[] & QuestItem[]>(stmt);
};

const fetchPublicMedia = async (): Promise<
  (QuestItem & { username: string })[]
> => {
  const stmt = promisePool.format(
    `SELECT Users.username, Quests.quest_id, Quests.title, Quests.quest_text, Quests.reward_type, Quests.reward_count, Quests.reset_time, Quests.is_done, Quests.is_public, Quests.created_at FROM Quests 
    JOIN Users ON Quests.user_id = Users.user_id
    WHERE is_public = 1`
  );
  const [rows] = await promisePool.execute<
    RowDataPacket[] & (QuestItem & { username: string })[]
  >(stmt);
  return rows;
};

const fetchUserStats = async (userToken: TokenContent): Promise<UserStats> => {
  const sql = `SELECT user_exp, user_level, user_points, user_int, user_str, user_dex FROM UserStats WHERE user_id = ?`;
  const params = userToken.user_id;
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & UserStats[]>(stmt);
  if (!rows.length)
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_FOUND_LIKED, 404);
  return rows[0];
};

const updateUserLevel = async (userToken: TokenContent) => {
  const sql = `UPDATE UserStats SET user_exp = user_exp - 100 , user_level= user_level + 1, user_points = user_points + 1 WHERE user_id = ?`;
  const params = userToken.user_id;
  const stmt = promisePool.format(sql, params);
  await promisePool.execute<RowDataPacket[] & UserStats[]>(stmt);
  return await fetchUserStats(userToken);
};

const postCard = async (
  card: FormData,
  userToken: TokenContent
): Promise<QuestItem> => {
  const user_id = userToken.user_id;
  const title = card.get("title");
  const quest_text = card.get("description");
  const reward_count = card.get("exp");
  const shared = card.get("public")?.toString();
  let is_public;
  if (shared == "on") {
    is_public = 1;
  } else {
    is_public = 0;
  }

  const sql = `INSERT INTO Quests (user_id, title, quest_text, reward_type, reward_count, is_public)
               VALUES (?, ?, ?, "exp", ?, ?)`;
  const params = [user_id, title, quest_text, reward_count, is_public];
  const stmt = promisePool.format(sql, params);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);
  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_CREATED, 500);
  }
  return await fetchQuestById(result.insertId);
};

const fetchQuestById = async (id: number): Promise<QuestItem> => {
  const sql = `SELECT quest_id, title, quest_text, reward_type, reward_count, reset_time, is_done, is_public, created_at FROM Quests WHERE quest_id = ?`;
  const params = id;
  const stmt = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<RowDataPacket[] & QuestItem[]>(stmt);
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_FOUND, 404);
  }
  return rows[0];
};

export {
  fetchOwnerMedia,
  fetchOwnerUncompleteMedia,
  fetchOwnerSelectedMedia,
  updateCardSelect,
  fetchPublicMedia,
  fetchUserStats,
  updateUserLevel,
  postCard,
  fetchQuestById,
};
