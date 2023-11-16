import { Inject, Injectable } from '@nestjs/common';
import { Result, Session, Transaction, session } from 'neo4j-driver';
import { TransactionImpl } from 'neo4j-driver/lib';

@Injectable()
export class Neo4jService {
    constructor(
        @Inject("NEO4J_CONFIG") private readonly config,
        @Inject("NEO4J_DRIVER") private readonly driver
    ) {}

    getDriver() {
        return this.driver;
    }

    beginTransaction(database?: string): Transaction {
        const session = this.getWriteSession(database);

        return session.beginTransaction();
    }

    getReadSession(database?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.READ
        })
    }

    getWriteSession(database?: string): Session {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: session.WRITE
        })
    }

    read(cypher: string, params?: Record<string, any>, databaseOrTranscation?: string | Transaction): Result {
        if (databaseOrTranscation instanceof TransactionImpl) {
            return (<Transaction> databaseOrTranscation).run(cypher, params);
        }

        const session = this.getReadSession(<string> databaseOrTranscation);
        return session.run(cypher, params);
    }

    write(cypher: string, params?: Record<string, any>, databaseOrTranscation?: string | Transaction): Result {
        if (databaseOrTranscation instanceof TransactionImpl) {
            return (<Transaction> databaseOrTranscation).run(cypher, params);
        }

        const session = this.getWriteSession(<string> databaseOrTranscation);
        return session.run(cypher, params);
    }

    opApplicationShutdown() {
        this.driver.close();
    }
}
