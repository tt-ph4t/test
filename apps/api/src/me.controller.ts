import { CurrentUser } from "@nestjs/authentication";
import { Controller, Get } from "@nestjs/common";
import type { APIResponse } from "@repo/shared/types.ts";

@Controller("me")
export class MeController {
  @Get()
  me(@CurrentUser() user: any): APIResponse {
    return {
      data: {
        user,
      },
      message: "User found",
    };
  }
}
