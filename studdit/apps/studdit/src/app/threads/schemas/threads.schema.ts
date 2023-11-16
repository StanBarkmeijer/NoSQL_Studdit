import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Document, Types } from "mongoose";

export type ThreadDocument = HydratedDocument<Thread>;

@Schema({ timestamps: true })
export class Thread {
    @Prop({ required: true, index: true }) // Index for username
    username: string;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    // Consideration: Referencing related data (User and Comment) for scalability
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
        return this.upvotes.length - this.downvotes.length;
    }
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);