type UserLevel = {
  level_id: number;
  level_name: "Admin" | "User" | "Guest";
};

type User = {
  user_id: number;
  username: string;
  password: string;
  email: string;
  user_level_id: number;
  created_at: Date | string;
};

type UserStats = {
  user_exp: number;
  user_level: number;
  user_points: number;
  user_int: number;
  user_str: number;
  user_dex: number;
};

type QuestItem = {
  quest_id: number;
  user_id: number;
  title: string;
  quest_text: string;
  reward_type: string;
  reward_count: number;
  reset_time: number;
  is_done: number;
  is_public: number;
  created_at: Date | string;
};

type UploadResult = {
  message: string;
  data?: {
    image: string;
  };
};

type UserWithLevel = Omit<User, "user_level_id"> &
  Pick<UserLevel, "level_name">;

type UserWithNoPassword = Omit<UserWithLevel, "password">;

type TokenContent = Pick<User, "user_id"> & Pick<UserLevel, "level_name">;

export type {
  UserLevel,
  User,
  UserStats,
  QuestItem,
  UploadResult,
  UserWithLevel,
  UserWithNoPassword,
  TokenContent,
};
