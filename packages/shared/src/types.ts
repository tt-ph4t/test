export type APIResponse<d = any> = {
  data?: d;
  message: string | string[];
};

export type PingMessageEvent = MessageEvent<0 | 1>;

export type User = {
  id: string;
  email: string;
};

export type UserResponse = Required<
  APIResponse<{
    user: User;
  }>
>;

export type FetchParameters = Parameters<typeof fetch>;
