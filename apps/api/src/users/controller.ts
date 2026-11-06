import { CurrentUser, type SessionRecord } from "@nestjs/authentication";
import { Controller, Get, Inject, Session, Sse } from "@nestjs/common";
import type { UserResponse } from "@repo/shared/types.js";
import { Pool } from "pg";
import { exhaustMap, from, map, takeUntil, timer } from "rxjs";
import { POOL_INJECTION_TOKEN } from "../database.module.ts";
import { SessionEvents } from "../session-events.module.ts";

@Controller("users")
export default class {
  constructor(
    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,

    private readonly sessionEvents: SessionEvents,
  ) {}

  @Sse("unstable_sse_me")
  unstable_sse_me(
    @CurrentUser() user: UserResponse["data"]["user"],
    @Session() session: SessionRecord,
  ) {
    return timer(0, 1000).pipe(
      takeUntil(this.sessionEvents.onRevoked(session)),
      exhaustMap(() =>
        from(
          this.pool.query(
            `
            SELECT id, email
            FROM users
            WHERE id = $1
            `,
            [user.id],
          ),
        ),
      ),
      map(({ rows: [user] }) => ({
        data: {
          user,
        },
      })),
    );
  }

  @Get("me")
  me(@CurrentUser() user: UserResponse["data"]["user"]): UserResponse {
    return {
      data: {
        user,
      },
      message: "User found",
    };
  }
}
