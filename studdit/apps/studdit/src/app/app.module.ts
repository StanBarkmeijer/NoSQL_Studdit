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
import { FriendsModule } from './friends/friends.module';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_PATH')}/${configService.get('DATABASE')}?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService]
    }),
    UsersModule, 
    ThreadsModule, 
    CommentsModule, 
    FriendsModule, 
    MiddlewareModule,
    Neo4jModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE')
      })
    }), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
