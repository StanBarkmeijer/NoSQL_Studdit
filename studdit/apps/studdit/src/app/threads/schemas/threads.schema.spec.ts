import { getModelToken } from "@nestjs/mongoose";
import { TestingModule, Test } from "@nestjs/testing";
import { Model, Types } from "mongoose";
import { Thread, ThreadDocument } from "./threads.schema";

describe('Threads Model', () => { 
    let threadModel: Model<ThreadDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(Thread.name),
                    useValue: Model
                }
            ],
        }).compile();

        threadModel = module.get<Model<ThreadDocument>>(getModelToken(Thread.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Happy Flow", () => {
        it("should create a thread", async () => {
            const threadData = {
                username: "testuser",
                title: "Test Thread",
                content: "This is a test thread content."
            };
        
            jest.spyOn(threadModel, 'create').mockResolvedValueOnce(threadData as any);
        
            const createdThread = await threadModel.create(threadData);
        
            expect(createdThread).toEqual(threadData);
            expect(threadModel.create).toHaveBeenCalledWith(threadData);
        });

        it("should calculate the correct score for the thread", () => {
            const thread = new Thread();
            thread.upvotes = [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()]; // Simulating upvotes
            thread.downvotes = [new Types.ObjectId()]; // Simulating downvote
        
            const expectedScore = thread.upvotes.length - thread.downvotes.length;
        
            expect(thread.score).toEqual(expectedScore);
        });
        
        it("should update a thread's title", async () => {
            const initialThreadData = {
                username: "testuser",
                title: "Initial Thread Title",
                content: "This is the initial content."
            };
        
            const updatedThreadData = {
                username: "testuser",
                title: "Updated Thread Title",
                content: "This is the updated content."
            };

            jest.spyOn(threadModel, 'create').mockResolvedValueOnce(initialThreadData as any);
        
            const thread = await threadModel.create(initialThreadData);
            jest.spyOn(threadModel, 'findByIdAndUpdate').mockResolvedValueOnce(updatedThreadData as any);
        
            const updatedThread = await threadModel.findByIdAndUpdate(thread._id, { title: "Updated Thread Title" }, { new: true });
        
            expect(updatedThread).toEqual(updatedThreadData);
            expect(threadModel.findByIdAndUpdate).toHaveBeenCalledWith(thread._id, { title: "Updated Thread Title" }, { new: true });
        });

        it("should have timestamps when creating and updating a thread", async () => {
            const threadData = {
                username: "testuser",
                title: "Test Thread",
                content: "This is a test thread content."
            };
        
            jest.spyOn(threadModel, 'create').mockResolvedValueOnce({
                ...threadData,
                createdAt: new Date(-1000),
                updatedAt: new Date(+1000) // Simulating an update
            } as any);

            const createdThread = await threadModel.create(threadData);
        
            expect(createdThread.createdAt).toBeInstanceOf(Date);
            expect(createdThread.updatedAt).toBeInstanceOf(Date);
            expect(createdThread.createdAt).toEqual(createdThread.createdAt);
        
            // Simulate an update
            jest.spyOn(threadModel, 'findByIdAndUpdate').mockResolvedValueOnce({ ...createdThread, updatedAt: new Date() } as any);
            const updatedThread = await threadModel.findByIdAndUpdate(createdThread._id, { content: "Updated content" }, { new: true });
        
            expect(updatedThread.createdAt).toEqual(createdThread.createdAt);
            expect(updatedThread.updatedAt.valueOf()).toBeGreaterThan(createdThread.updatedAt.valueOf());
        });

        it("should calculate a negative score for the thread", () => {
            const thread = new Thread();
            thread.upvotes = [new Types.ObjectId()];
            thread.downvotes = [new Types.ObjectId(), new Types.ObjectId(), new Types.ObjectId()]; // Simulating more downvotes than upvotes
        
            const calculatedScore = thread.score;
        
            expect(calculatedScore).toBeLessThanOrEqual(0);
        });
    });

    describe("Unhappy Flow", () => {
        it("should not create a thread with missing required fields", async () => {
            const incompleteThreadData = {
                username: "testuser",
                title: "Test Thread"
                // Missing 'content' field
            };
        
            jest.spyOn(threadModel, 'create').mockRejectedValueOnce(new Error('Content is required'));
        
            await expect(threadModel.create(incompleteThreadData)).rejects.toThrow('Content is required');
            expect(threadModel.create).toHaveBeenCalledWith(incompleteThreadData);
        });

        it("should handle malformed score calculation", () => {
            const thread = new Thread();
            thread.upvotes = ["invalidId", "anotherInvalidId"] as any[]; // Invalid ObjectIDs
            thread.downvotes = ["yetAnotherInvalidId"] as any[]; // Invalid ObjectID
        
            const calculatedScore = thread.score;

            expect(calculatedScore).toBeNaN();
        });
        
    });
});