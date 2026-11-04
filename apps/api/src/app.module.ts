import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { URLS } from "@repo/shared/config.ts";
import { AuthModule } from "./auth/module.ts";
import { MeController } from "./me.controller.ts";
import { PingModule } from "./ping/module.ts";

@Module({
  imports: [
    AuthenticationModule.forRoot({
      session: {
        trustedOrigins: [URLS.WEB.origin],
      },
    }),
    AuthModule,
    PingModule,
  ],
  controllers: [MeController],
})
export class AppModule {}
