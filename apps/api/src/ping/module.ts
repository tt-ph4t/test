import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module.ts";
import Controller from "./controller.ts";

@Module({
  imports: [DatabaseModule],
  controllers: [Controller],
})
export class PingModule {}
