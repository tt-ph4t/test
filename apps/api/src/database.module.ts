import { Inject, Module, OnModuleDestroy } from "@nestjs/common";
import { POOL_CONFIG } from "@repo/shared/config.ts";
import { Pool } from "pg";

export const POOL_INJECTION_TOKEN: Parameters<typeof Inject>[0] = Symbol();

class Shutdown implements OnModuleDestroy {
  constructor(
    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,
  ) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}

@Module({
  providers: [
    {
      provide: POOL_INJECTION_TOKEN,
      useFactory: () => new Pool(POOL_CONFIG),
    },
    Shutdown,
  ],
  exports: [POOL_INJECTION_TOKEN],
})
export class DatabaseModule {}
