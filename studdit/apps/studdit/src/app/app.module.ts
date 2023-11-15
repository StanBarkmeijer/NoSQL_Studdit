import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jConfig } from './neo4j/neo4j-config.interface';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://administrator:PC8u9kW6@studdit.thvtbws.mongodb.net/?retryWrites=true&w=majority"),
    UsersModule, 
    ThreadsModule, 
    CommentsModule, 
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService): Neo4jConfig => ({
        scheme: config.get('NEO4J_SCHEME'),
        host: config.get('NEO4J_HOST'),
        port: config.get('NEO4J_PORT'),
        username: config.get('NEO4J_USERNAME'),
        password: config.get('NEO4J_PASSWORD'),
        database: config.get('NEO4J_DATABASE')
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
