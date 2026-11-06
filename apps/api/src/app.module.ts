import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { URLS } from "@repo/shared/config.ts";
import { AuthModule } from "./auth/module.ts";
import { PingModule } from "./ping/module.ts";
import { UsersModule } from "./users/module.ts";

@Module({
  imports: [
    AuthenticationModule.forRoot({
      session: {
        trustedOrigins: [URLS.WEB.origin],
      },
    }),
    AuthModule,
    PingModule,
    UsersModule,
  ],
})
export class AppModule {}
