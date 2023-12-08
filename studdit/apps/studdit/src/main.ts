/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config({
    path: "../.env"
  });

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  const config = new DocumentBuilder()
    .setTitle('Studdit')
    .setDescription('The Studdit API description. Built for the NoSQL course, provided by Avans Hogeschool.')
    .setVersion('1.0')
    .addServer(`http://localhost:${process.env.PORT}/api`)
    .addServer(`https://studdit-api.herokuapp.com`)
    .addSecurity('username', {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Your username (bad security, just for POC).'
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup(globalPrefix, app, document);
  app.setGlobalPrefix(globalPrefix);
  
  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
