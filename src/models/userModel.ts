import { RowDataPacket } from "mysql2";
import promisePool from "@/lib/db";
import { UserWithLevel, UserWithNoPassword } from "@/types/DBTypes";
import CustomError from "@/classes/CustomError";

const getUserById = async (
  id: number
): Promise<UserWithNoPassword | unknown> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(
    `SELECT Users.user_id, Users.username, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.user_id = ?`,
    [id]
  );
  if (rows.length === 0) {
    throw new CustomError("User not found", 404);
  }
  return rows[0];
};

const getUserByUsername = async (
  username: string
): Promise<UserWithLevel | null> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT Users.user_id, Users.username, Users.password, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.username = ?`,
    [username]
  );
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

export { getUserById, getUserByUsername };
