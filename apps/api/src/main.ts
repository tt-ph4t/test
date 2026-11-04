import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { URLS } from "@repo/shared/config.ts";
import { AppModule } from "./app.module.ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    routeConflictPolicy: {
      duplicate: "error",
      shadow: "warn",
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: URLS.WEB,
    credentials: true,
  });

  app.enableCsrfProtection;
  app.enableShutdownHooks();

  await app.listen(URLS.API.port);
}

await bootstrap();
