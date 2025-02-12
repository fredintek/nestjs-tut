import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GLOBAL VALIDATION PIPES
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // SWAGGER CONFIGURATION
  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('Nest Js Blog App API')
    .setDescription('Use the base API url as http://localhost:5050')
    .setTermsOfService('http://localhost:5050/terms-of-service')
    .setLicense(
      'MIT license',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:5050')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('nest-js-api', app, documentFactory);

  await app.listen(process.env.PORT ?? 5050);
}
bootstrap();
