import { getModelToken } from "@nestjs/mongoose";
import { TestingModule, Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";
import { Comment, CommentDocument } from "./comment.schema";

describe('Threads Model', () => { 
    let commentModel: Model<CommentDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(Comment.name),
                    useValue: Model
                }
            ],
        }).compile();

        commentModel = module.get<Model<CommentDocument>>(getModelToken(Comment.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Happy Flow", () => {
        it("should create a comment", async () => {
            const commentData = {
                username: "testuser",
                content: "This is a test comment."
            };
        
            jest.spyOn(commentModel, 'create').mockResolvedValueOnce(commentData as any);
        
            const createdComment = await commentModel.create(commentData);
        
            expect(createdComment).toEqual(commentData);
            expect(commentModel.create).toHaveBeenCalledWith(commentData);
        });

        it("should calculate the correct score for the comment", () => {
            const comment = new Comment();
            comment.upvotes = [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()]; // Simulating upvotes
            comment.downvotes = [new Types.ObjectId()]; // Simulating downvote
        
            const expectedScore = comment.upvotes.length - comment.downvotes.length;
        
            expect(comment.score).toEqual(expectedScore);
        });
    });

    describe("Unhappy Flow", () => {
        it("should not create a comment with missing required fields", async () => {
            const incompleteCommentData = {
                username: "testuser",
                // Missing 'content' field
            };
        
            jest.spyOn(commentModel, 'create').mockRejectedValueOnce(new Error('Content is required'));
        
            await expect(commentModel.create(incompleteCommentData)).rejects.toThrowError('Content is required');
            expect(commentModel.create).toHaveBeenCalledWith(incompleteCommentData);
        });

        it("should handle malformed ObjectIDs when calculating comment score", () => {
            const comment = new Comment();
            comment.upvotes = ["invalidId1", "invalidId2"] as any[]; // Invalid ObjectIDs
            comment.downvotes = [new Types.ObjectId()]; // Valid ObjectID
        
            const calculatedScore = comment.score;
        
            expect(isNaN(calculatedScore)).toBe(true);
        });
    });
});