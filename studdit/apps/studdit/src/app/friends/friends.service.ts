import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Neo4jService } from '../neo4j/neo4j.service';
import { Types } from 'mongoose';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel('User') private readonly userModel,
        private readonly neo4jService: Neo4jService
    ) {}

    private async userExists(username: string) {
        const user = await this.userModel.findOne({ username });
        return !!user;
    }

    /**
     * Befriends two users
     * @param user A username
     * @param friend A username
     */
    async makeFriend(user: string, friend: string): Promise<Record<string, any>> {
        const [userExists, friendExists] = await Promise.all([
            this.userExists(user),
            this.userExists(friend)
        ]);

        if (!userExists || !friendExists) {
            throw new NotFoundException(`User ${!userExists ? user : friend} not found`);
        }

        const neo = this.neo4jService.beginTransaction();

        try {
            const existingFriendship = await neo.run(
                `MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) RETURN r`,
                { user, friend }
            );

            if (existingFriendship.records.length > 0) {
                return existingFriendship.records;
            } else {
                const result = await neo.run(
                    `MERGE (u:User {username: $user})-[:FRIENDS_WITH]-(f:User {username: $friend})`,
                    { user, friend }
                );

                await neo.commit();

                return result.records;
            }
        } catch (error) {
            await neo.rollback();
            throw new Error('Could not make friend')
        }
    }

    /**
     * Unfriends two users
     * @param user A username
     * @param friend A username
     */
    async removeFriend(user: string, friend: string): Promise<Record<string, any>> {
        const [userExists, friendExists] = await Promise.all([
            this.userExists(user),
            this.userExists(friend)
        ]);

        if (!userExists || !friendExists) {
            throw new NotFoundException(`User ${!userExists ? user : friend} not found`);
        }

        const neo = this.neo4jService.beginTransaction();

        try {
            const existingFriendship = await neo.run(
                `MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) RETURN r`,
                { user, friend }
            );

            if (existingFriendship.records.length > 0) {
                const result = await neo.run(
                    `MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) DELETE r`,
                    { user, friend }
                );

                await neo.commit();

                return result.records;
            } else {
                return existingFriendship.records;
            }
        } catch (error) {
            await neo.rollback();
            throw new Error('Could not remove friend')
        }
    }
}
