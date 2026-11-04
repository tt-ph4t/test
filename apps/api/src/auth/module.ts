import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module.ts";
import Controller from "./controller.ts";
import Provider from "./provider.ts";

@Module({
  imports: [DatabaseModule],
  controllers: [Controller],
  providers: [Provider],
})
export class AuthModule {}
