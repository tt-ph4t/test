import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

const Email = () => applyDecorators(IsEmail());

const Password = (min = 1, max = 100) =>
  applyDecorators(IsString(), MinLength(min), MaxLength(max));

const OptionalNullable = () =>
  applyDecorators(
    IsOptional(),
    Transform(({ value }) => value || null),
  );

export class SignUpDto {
  @Email()
  email: string;

  @Password()
  password: string;
}

export class SignInDto {
  @Email()
  email: string;

  @Password(1, Infinity)
  password: string;
}

export class UpdateUserDto {
  @OptionalNullable()
  @Email()
  email?: string;

  @OptionalNullable()
  @Password()
  password?: string;
}
