import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './user.schema';
import { Model } from 'mongoose';

describe('User Model', () => { 
    let userModel: Model<UserDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getModelToken(User.name),
                    useValue: Model
                }
            ],
        }).compile();

        userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Happy Flow", () => {
        it("should create a user", async () => {
            const userData: User = {
                username: "testuser",
                password: "testpassword",
                isActive: true
            };

            jest.spyOn(userModel, 'create').mockResolvedValueOnce(userData as any);

            const createdUser = await userModel.create(userData);

            expect(createdUser).toEqual(userData);
            expect(userModel.create).toHaveBeenCalledWith(userData);
        });

        it("should create a user with default isActive status", async () => {
            const userData: User = {
                username: "testuser",
                password: "testpassword"
            };

            jest.spyOn(userModel, 'create').mockResolvedValueOnce(userData as any);

            const createdUser = await userModel.create(userData);

            expect(createdUser).toEqual(userData);
            expect(userModel.create).toHaveBeenCalledWith(userData);
        });

        it("should update user isActive status", async () => {
            const userData: User = {
                username: "testuser",
                password: "testpassword",
                isActive: true
            };

            jest.spyOn(userModel, 'updateOne').mockResolvedValueOnce(userData as any);

            const updatedUser = await userModel.updateOne(userData);

            expect(updatedUser).toEqual(userData);
            expect(userModel.updateOne).toHaveBeenCalledWith(userData);
        });
    });

    describe("Unhappy Flow", () => {
        it("should throw an error when missing username", async () => {	
            const userData = {
                password: "testpassword",
                isActive: true
            };

            jest.spyOn(userModel, 'create').mockRejectedValueOnce(new Error("Username is required"));

            await expect(userModel.create(userData)).rejects.toThrow("Username is required");
            expect(userModel.create).toHaveBeenCalledWith(userData);
        });

        it("should throw an error when missing password", async () => {	
            const userData = {
                username: "testuser",
                isActive: true
            };

            jest.spyOn(userModel, 'create').mockRejectedValueOnce(new Error("Password is required"));

            await expect(userModel.create(userData)).rejects.toThrow("Password is required");
            expect(userModel.create).toHaveBeenCalledWith(userData);
        });

        it("should throw an error when creating a user with an existing username", async () => {
            const user1: User = {
                username: "testuser",
                password: "testpassword",
                isActive: true
            };
            
            const user2: User = {
                username: "testuser",
                password: "testpassword2",
                isActive: true
            };

            jest.spyOn(userModel, 'create').mockResolvedValueOnce(user1 as any);
            jest.spyOn(userModel, 'create').mockRejectedValueOnce(new Error("Username already exists"));

            await userModel.create(user1);
            await expect(userModel.create(user2)).rejects.toThrow("Username already exists");
            expect(userModel.create).toHaveBeenCalledWith(user1);
            expect(userModel.create).toHaveBeenCalledWith(user2);
        });
    });
});