import { QuestItem, UserStats, UserWithNoPassword } from "./DBTypes";

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

// for auth server
type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: UserWithNoPassword;
};

type UserResponse = MessageResponse & {
  user: UserWithNoPassword;
};

type UserStatsResponse = MessageResponse & {
  user: UserStats;
};

type UserDeleteResponse = MessageResponse & {
  user: { user_id: number };
};

type AvailableResponse = Partial<MessageResponse> & {
  available?: boolean;
};

type BooleanResponse = MessageResponse & {
  success: boolean;
};

// for upload server
type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

type MediaResponse = MessageResponse & {
  media: QuestItem;
};

export type {
  MessageResponse,
  ErrorResponse,
  LoginResponse,
  UploadResponse,
  UserResponse,
  UserStatsResponse,
  UserDeleteResponse,
  AvailableResponse,
  BooleanResponse,
  MediaResponse,
};
