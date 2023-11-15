import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    _id?: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, select: false })
    password: string;
};

export const UserSchema = SchemaFactory.createForClass(User);