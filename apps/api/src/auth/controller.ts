import {
  CurrentUser,
  PasswordHasher,
  Public,
  SignInService,
} from "@nestjs/authentication";
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { APIResponse, User } from "@repo/shared/types.ts";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { POOL_INJECTION_TOKEN } from "../database.module.ts";
import { SignInDto, SignUpDto, UpdateUserDto } from "./dto.ts";

const addPepper = (password: string, pepper = "gay") => `${pepper}_${password}`;

@Controller("auth")
@UseInterceptors(FileInterceptor(""))
export default class {
  constructor(
    @Inject(POOL_INJECTION_TOKEN)
    private readonly pool: Pool,

    private readonly passwordHasher: PasswordHasher,
    private readonly signInService: SignInService,
  ) {}

  @Public()
  @Post("sign-in")
  @HttpCode(200)
  async signIn(@Body() signInDto: SignInDto): Promise<APIResponse> {
    const [user] = (
      await this.pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [signInDto.email],
      )
    ).rows;

    if (user) {
      const password = addPepper(signInDto.password);

      if (await this.passwordHasher.verify(password, user.password_hash)) {
        if (this.passwordHasher.needsRehash(user.password_hash))
          await this.pool.query(
            `
            UPDATE users
            SET password_hash = $1
            WHERE id = $2
            `,
            [await this.passwordHasher.hash(password), user.id],
          );

        await this.signInService.signIn(user.id);

        return {
          message: "ok",
        };
      }
    }

    return {
      message: "Invalid email or password",
    };
  }

  @Public()
  @Post("sign-up")
  async signUp(@Body() signUpDto: SignUpDto): Promise<APIResponse> {
    try {
      const [user] = (
        await this.pool.query(
          `
          INSERT INTO users (id, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, email
          `,
          [
            randomUUID(),
            signUpDto.email,
            await this.passwordHasher.hash(addPepper(signUpDto.password)),
          ],
        )
      ).rows;

      await this.signInService.signIn(user.id);

      return {
        message: "Account created successfully",
      };
    } catch (error: any) {
      throw new HttpException(
        {
          message: error.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch("update")
  async update(
    @CurrentUser("id") userId: User["id"],
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<APIResponse> {
    const _email = updateUserDto.email || null;
    const _password = updateUserDto.password || null;

    await this.pool.query(
      `
      UPDATE users
      SET email = COALESCE($2, email),
          password_hash = COALESCE($3, password_hash)
      WHERE id = $1
      `,
      [
        userId,
        _email,
        _password
          ? await this.passwordHasher.hash(addPepper(_password))
          : _password,
      ],
    );

    if (_email || _password) await this.signInService.signOutEverywhere(userId);

    return {
      message: "Updated successfully",
    };
  }

  @Post("sign-out")
  async signOut(): Promise<APIResponse | void> {
    if (await this.signInService.signOut())
      return {
        message: "Signed out successfully",
      };
  }
}

// signOutAll
