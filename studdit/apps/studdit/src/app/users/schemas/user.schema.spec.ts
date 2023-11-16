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
});