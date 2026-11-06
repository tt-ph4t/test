import { Public } from "@nestjs/authentication";
import { Controller, Inject, Sse } from "@nestjs/common";
import type { PingMessageEvent } from "@repo/shared/types.ts";
import { Pool } from "pg";
import type { Observable } from "rxjs";
import { catchError, exhaustMap, from, map, of, timer } from "rxjs";
import { POOL_INJECTION_TOKEN } from "../database.module.ts";

@Public()
@Controller("ping")
export default class {
  constructor(
    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,
  ) {}

  @Sse()
  ping(): Observable<PingMessageEvent["data"]> {
    return timer(0, 1000).pipe(
      exhaustMap(() =>
        from(this.pool.query("SELECT 1")).pipe(
          map(() => 1 as const),
          catchError(() => of(0 as const)),
        ),
      ),
    );
  }
}
