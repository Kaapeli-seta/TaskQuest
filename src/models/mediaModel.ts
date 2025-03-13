import { ERROR_MESSAGES } from "@/utils/errorMessages";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import {
  MediaItem,
  UserLevel,
  TokenContent,
  QuestItem,
  UserStats,
} from "@/types/DBTypes";
import promisePool from "@/lib/db";
import { MessageResponse } from "@/types/MessageTypes";
import { fetchData } from "@/lib/functions";
import CustomError from "@/classes/CustomError";

const uploadPath = process.env.UPLOAD_URL;

// Common SQL fragments
// if mediaItem is an image add '-thumb.png' to filename
// if mediaItem is not image add screenshots property with 5 thumbnails
// uploadPath needs to be passed to the query
// Example usage:
// ....execute(BASE_MEDIA_QUERY, [uploadPath, otherParams]);
const BASE_MEDIA_QUERY = `
  SELECT
    media_id,
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    created_at,
    CONCAT(base_url, filename) AS filename,
    CASE
      WHEN media_type LIKE '%image%'
      THEN CONCAT(base_url, filename, '-thumb.png')
      ELSE CONCAT(base_url, filename, '-animation.gif')
    END AS thumbnail,
    CASE
      WHEN media_type NOT LIKE '%image%'
      THEN (
        SELECT JSON_ARRAY(
          CONCAT(base_url, filename, '-thumb-1.png'),
          CONCAT(base_url, filename, '-thumb-2.png'),
          CONCAT(base_url, filename, '-thumb-3.png'),
          CONCAT(base_url, filename, '-thumb-4.png'),
          CONCAT(base_url, filename, '-thumb-5.png')
        )
      )
      ELSE NULL
    END AS screenshots
  FROM MediaItems,
       (SELECT ? AS base_url) AS vars
`;

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

///
///
///
///
///
///
/// Unused Functions
///

const fetchAllMedia = async (
  page: number | undefined = undefined,
  limit: number | undefined = undefined
): Promise<MediaItem[]> => {
  const offset = ((page || 1) - 1) * (limit || 10);
  const sql = `${BASE_MEDIA_QUERY}
    ${limit ? "LIMIT ? OFFSET ?" : ""}`;
  const params = limit ? [uploadPath, limit, offset] : [uploadPath];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(stmt);
  return rows;
};

const fetchMediaById = async (id: number): Promise<MediaItem> => {
  const sql = `${BASE_MEDIA_QUERY}
              WHERE media_id=?`;
  const params = [uploadPath, id];
  const stmt = promisePool.format(sql, params);
  const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(stmt);
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_FOUND, 404);
  }
  return rows[0];
};

const postMedia = async (
  media: Omit<
    MediaItem,
    "media_id" | "created_at" | "thumbnail" | "screenshots"
  >
): Promise<MediaItem> => {
  const { user_id, filename, filesize, media_type, title, description } = media;
  const sql = `INSERT INTO MediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, filename, filesize, media_type, title, description];
  const stmt = promisePool.format(sql, params);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);
  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_CREATED, 500);
  }
  return await fetchMediaById(result.insertId);
};

const putMedia = async (
  media: Pick<MediaItem, "title" | "description">,
  id: number,
  user_id: number,
  user_level: UserLevel["level_name"]
): Promise<MediaItem> => {
  const sql =
    user_level === "Admin"
      ? "UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?"
      : "UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ? AND user_id = ?";

  const params =
    user_level === "Admin"
      ? [media.title, media.description, id]
      : [media.title, media.description, id, user_id];

  const stmt = promisePool.format(sql, params);

  const [result] = await promisePool.execute<ResultSetHeader>(stmt);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_UPDATED, 404);
  }

  return await fetchMediaById(id);
};

const checkOwnership = async (
  media_id: number,
  user_id: number
): Promise<boolean> => {
  const sql = "SELECT * FROM MediaItems WHERE media_id = ? AND user_id = ?";
  const params = [media_id, user_id];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[]>(stmt);
  return rows.length > 0;
};

const deleteMedia = async (
  media_id: number,
  user_id: number,
  token: string,
  level_name: UserLevel["level_name"]
): Promise<MessageResponse> => {
  const media = await fetchMediaById(media_id);

  if (!media) {
    return { message: "Media not found" };
  }

  const isOwner = await checkOwnership(media_id, user_id);
  if (!isOwner && level_name !== "Admin") {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_DELETED, 403);
  }

  media.filename = media?.filename.replace(
    process.env.UPLOAD_URL as string,
    ""
  );

  const connection = await promisePool.getConnection();

  await connection.beginTransaction();

  await connection.execute("DELETE FROM Likes WHERE media_id = ?;", [media_id]);

  await connection.execute("DELETE FROM Comments WHERE media_id = ?;", [
    media_id,
  ]);

  await connection.execute("DELETE FROM Ratings WHERE media_id = ?;", [
    media_id,
  ]);

  await connection.execute("DELETE FROM MediaItemTags WHERE media_id = ?;", [
    media_id,
  ]);

  const sql =
    level_name === "Admin"
      ? connection.format("DELETE FROM MediaItems WHERE media_id = ?", [
          media_id,
        ])
      : connection.format(
          "DELETE FROM MediaItems WHERE media_id = ? AND user_id = ?",
          [media_id, user_id]
        );

  const [result] = await connection.execute<ResultSetHeader>(sql);

  if (result.affectedRows === 0) {
    return { message: "Media not deleted" };
  }

  const options = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  try {
    const deleteResult = await fetchData<MessageResponse>(
      `${process.env.UPLOAD_SERVER}/delete/${media.filename}`,
      options
    );

    console.log("deleteResult", deleteResult);
  } catch (e) {
    console.error("deleteMedia file delete error:", (e as Error).message);
  }

  await connection.commit();

  return {
    message: "Media item deleted",
  };
};

const fetchMediaByUserId = async (user_id: number): Promise<MediaItem[]> => {
  const sql = `${BASE_MEDIA_QUERY} WHERE user_id = ?`;
  const params = [uploadPath, user_id];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<RowDataPacket[] & MediaItem[]>(stmt);
  return rows;
};

const fetchMostLikedMedia = async (): Promise<MediaItem> => {
  // you could also use a view for this
  const sql = `${BASE_MEDIA_QUERY}
     WHERE media_id = (
       SELECT media_id FROM Likes
       GROUP BY media_id
       ORDER BY COUNT(*) DESC
       LIMIT 1
     )`;
  const params = [uploadPath];
  const stmt = promisePool.format(sql, params);

  const [rows] = await promisePool.execute<
    RowDataPacket[] & MediaItem[] & { likes_count: number }
  >(stmt);

  if (!rows.length) {
    throw new CustomError(ERROR_MESSAGES.MEDIA.NOT_FOUND_LIKED, 404);
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
  //not Used
  fetchAllMedia,
  fetchMediaById,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMediaByUserId,
  putMedia,
};
