import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    _id?: string;

    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment'}], default: [] })
    comments: Comment[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    upvotes: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    downvotes: Types.ObjectId[];

    get score(): number {
        return this.upvotes.length - this.downvotes.length;
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);