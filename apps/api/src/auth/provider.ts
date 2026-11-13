import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from "@nestjs/authentication";
import { Inject, Injectable } from "@nestjs/common";
import type { User } from "@repo/shared/types.ts";
import { Pool } from "pg";
import { POOL_INJECTION_TOKEN } from "../database.module.ts";

@Injectable()
export default class extends SessionCookieProvider<{}> {
  constructor(
    authenticationRegistry: AuthenticationRegistry,

    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,
  ) {
    super();

    authenticationRegistry.registerProvider(this);
  }

  async validate(session: SessionRecord): Promise<User> {
    return (
      await this.pool.query(
        `
        SELECT id, email
        FROM users
        WHERE id = $1
        `,
        [session.userId],
      )
    ).rows[0];
  }
}
