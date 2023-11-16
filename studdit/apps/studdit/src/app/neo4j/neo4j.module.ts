import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { ConfigModule } from '@nestjs/config';
import { createDriver } from './neo4j.utils';
import { Neo4jConfig } from './neo4j-config.interface';
import { Neo4jTransactionInterceptor } from './neo4j-transaction.interceptor';
import { config } from 'rxjs';

const NEO4J_OPTIONS = 'NEO4J_OPTIONS';
const NEO4J_DRIVER = 'NEO4J_DRIVER';

@Module({
  imports: [ ConfigModule ],
  providers: [
    {
      provide: 'NEO4J_CONFIG',
      useValue: config
    }
  ]
})
export class Neo4jModule {

  static forRoot(config: object): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        {
          provide: NEO4J_OPTIONS,
          useValue: config
        },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_OPTIONS],
          useFactory: async (config: Neo4jConfig) => {
            return await createDriver(config);
          }
        },
        Neo4jService
      ],
      exports: [ Neo4jService, Neo4jTransactionInterceptor ]
    }
  }

  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ ConfigModule ],
      providers: [
        {
          provide: NEO4J_OPTIONS,
          ...configProvider
        } as Provider<any>,
        {
          provide: NEO4J_DRIVER,
          inject: [ NEO4J_OPTIONS ],
          useFactory: async (config: Neo4jConfig) => {
            return await createDriver(config);
          }
        },
        Neo4jService
      ],
      exports: [ Neo4jService ]
    }
  }

}
