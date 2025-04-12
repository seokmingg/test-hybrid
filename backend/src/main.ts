import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // ⚠️ winston 설정 제거

  app.enableCors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  // 기본 Nest Logger 사용 (별도 설정 없이도 자동 작동)
  const logger = new Logger('Bootstrap');
  await app.listen(process.env.PORT || 3000);
  logger.log(`🚀 서버 실행 중: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();