import { Public } from "@nestjs/authentication";
import { Controller, Inject, Query, Sse } from "@nestjs/common";
import type { PingMessageEvent } from "@repo/shared/types.ts";
import { Pool } from "pg";
import type { Observable } from "rxjs";
import { catchError, exhaustMap, from, map, of, timer } from "rxjs";
import { POOL_INJECTION_TOKEN } from "../database.module.ts";

const minMs = 1000;

@Public()
@Controller("ping")
export default class {
  constructor(
    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,
  ) {}

  @Sse()
  ping(@Query("ms") ms: number): Observable<PingMessageEvent["data"]> {
    return timer(0, Math.max(minMs, ms ?? minMs)).pipe(
      exhaustMap(() =>
        from(this.pool.query("SELECT 1")).pipe(
          map(() => 1 as const),
          catchError(() => of(0 as const)),
        ),
      ),
    );
  }
}
