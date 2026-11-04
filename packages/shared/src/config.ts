import type { PoolConfig } from "pg";

export const URLS: Record<PropertyKey, URL> = {
  API: new URL("http://localhost:3333"),
  WEB: new URL("http://localhost:3000"),
};

export const POOL_CONFIG: PoolConfig = {
  user: "postgres",
  password: "postgres",
  database: "test",
};
