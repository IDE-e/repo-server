import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import {
  ApiResponseInterceptor,
  ApiExceptionFilter,
} from "./common/http/api-response";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 허용
  // client 3000
  // server 4000
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new ApiExceptionFilter());

  // Next랑 3000 포트 겹치기 때문에 4000 포트로 변경
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
