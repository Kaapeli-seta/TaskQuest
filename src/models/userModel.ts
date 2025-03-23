import { ResultSetHeader, RowDataPacket } from "mysql2";
import promisePool from "@/lib/db";
import { User, UserWithLevel, UserWithNoPassword } from "@/types/DBTypes";
import CustomError from "@/classes/CustomError";

const getUserById = async (id: number): Promise<UserWithNoPassword> => {
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

const createUser = async (
  user: Pick<User, "username" | "password" | "email">,
  userLevelId = 2
): Promise<UserWithNoPassword> => {
  const sql = `INSERT INTO Users (username, password, email, user_level_id)
       VALUES (?, ?, ?, ?)`;
  const stmt = promisePool.format(sql, [
    user.username,
    user.password,
    user.email,
    userLevelId,
  ]);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);

  if (result.affectedRows === 0) {
    throw new CustomError("Failed to create user", 500);
  }

  await createUserStats(result.insertId);

  return await getUserById(result.insertId);
};

const createUserStats = async (id: number) => {
  const sql = `INSERT INTO UserStats (user_id, user_exp, user_level, user_points, user_int, user_str, user_dex) VALUES
  (?, 0, 1, 0, 0, 0, 0);`;
  const stmt = promisePool.format(sql, [id]);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);
  if (result.affectedRows === 0) {
    throw new CustomError("Failed to create stats", 500);
  }
  return;
};

export { getUserById, getUserByUsername, createUser };
