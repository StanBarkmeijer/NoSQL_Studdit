import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
    @Prop({ required: true, index: true }) // Index for username
    username: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
    parentComment: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Thread', default: null })
    thread: Types.ObjectId;

    // Similar consideration: Referencing related data (User and nested Comment)
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }], default: [] })
    comments: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    upvotes: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    downvotes: Types.ObjectId[];

    // Index for timestamps if common queries involve time-based filtering/sorting
    @Prop({ index: true })
    createdAt: Date;

    @Prop({ index: true })
    updatedAt: Date;

    // Calculated field for score
    get score(): number {
        if (
            this.upvotes.some(upvote => !Types.ObjectId.isValid(upvote)) || 
            this.downvotes.some(downvote => !Types.ObjectId.isValid(downvote))
        ) return NaN;

        return this.upvotes.length - this.downvotes.length;
    }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);