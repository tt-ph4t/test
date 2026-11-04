export type APIResponse<d = any> = {
  data?: d;
  message: string | string[];
};

export type PingMessageEvent = MessageEvent<0 | 1>;

export type UserResponse = Required<
  APIResponse<{
    user: {
      id: string;
      email: string;
    };
  }>
>;
