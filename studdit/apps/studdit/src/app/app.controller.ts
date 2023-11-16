import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Neo4jService } from './neo4j/neo4j.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly neo4jService: Neo4jService
  ) {}

  @Get()
  async getData() {
    // return this.appService.getData();
    const res = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 1');
    return `There are ${res.records.length} nodes in the database.`
  }
}
