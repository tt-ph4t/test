import { Module } from "@nestjs/common";
import { DatabaseModule } from ".././database.module.ts";
import { SessionEventsModule } from "../session-events.module.ts";
import Controller from "./controller.ts";

@Module({
  imports: [DatabaseModule, SessionEventsModule],
  controllers: [Controller],
})
export class UsersModule {}
