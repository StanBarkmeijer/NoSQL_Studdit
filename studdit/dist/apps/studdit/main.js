/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const users_module_1 = __webpack_require__(8);
const threads_module_1 = __webpack_require__(23);
const comments_module_1 = __webpack_require__(29);
const neo4j_module_1 = __webpack_require__(34);
const config_1 = __webpack_require__(35);
const friends_module_1 = __webpack_require__(40);
const middleware_module_1 = __webpack_require__(21);
let AppModule = exports.AppModule = class AppModule {
};
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: `mongodb+srv://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_PATH')}/${configService.get('DATABASE')}?retryWrites=true&w=majority`,
                }),
                inject: [config_1.ConfigService]
            }),
            users_module_1.UsersModule,
            threads_module_1.ThreadsModule,
            comments_module_1.CommentsModule,
            friends_module_1.FriendsModule,
            middleware_module_1.MiddlewareModule,
            neo4j_module_1.Neo4jModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    scheme: configService.get('NEO4J_SCHEME'),
                    host: configService.get('NEO4J_HOST'),
                    port: configService.get('NEO4J_PORT'),
                    username: configService.get('NEO4J_USERNAME'),
                    password: configService.get('NEO4J_PASSWORD'),
                    database: configService.get('NEO4J_DATABASE')
                })
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const app_service_1 = __webpack_require__(6);
let AppController = exports.AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    async getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
let AppService = exports.AppService = class AppService {
    getData() {
        return ({ message: 'Hello API' });
    }
};
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(9);
const users_controller_1 = __webpack_require__(10);
const users_service_1 = __webpack_require__(11);
const middleware_module_1 = __webpack_require__(21);
let UsersModule = exports.UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }]),
            middleware_module_1.MiddlewareModule.forRoot({
                exclude: [{
                        path: 'users/:id',
                        method: common_1.RequestMethod.PUT
                    }]
            })
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(7);
let User = exports.User = class User {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
exports.User = User = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], User);
;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const users_service_1 = __webpack_require__(11);
const create_user_dto_1 = __webpack_require__(16);
const update_user_dto_1 = __webpack_require__(19);
const delete_user_dto_1 = __webpack_require__(20);
const swagger_1 = __webpack_require__(17);
let UsersController = exports.UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService
            .create(createUserDto)
            .then(user => user)
            .catch(error => {
            throw new common_1.HttpException('Unable to create user', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    findAll() {
        return this.usersService
            .findAll()
            .then(users => users)
            .catch(error => {
            throw new common_1.HttpException('Users not found', common_1.HttpStatus.NOT_FOUND);
        });
    }
    ;
    findOne(id) {
        return this.usersService
            .findOne(id)
            .then(user => user)
            .catch(error => {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        });
    }
    ;
    update(updateUserDto, id) {
        return this.usersService
            .update(id, updateUserDto)
            .then(user => user)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.HttpException('Current password is incorrect', common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException('Unable to update user', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    remove(deleteUserDTO, id) {
        return this.usersService
            .delete(id, deleteUserDTO)
            .then(user => user)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.UnauthorizedException) {
                throw new common_1.HttpException('Password is incorrect', common_1.HttpStatus.UNAUTHORIZED);
            }
            throw new common_1.HttpException('Unable to delete user', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ description: 'The user has been successfully created.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to create user.' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UsersController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ description: 'The users have been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Users not found.' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], UsersController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the user to retrieve.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The user has been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UsersController.prototype, "findOne", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the user to update.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The user has been successfully updated.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Current password is incorrect' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to update user' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_f = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _f : Object, String]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], UsersController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the user to delete.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The user has been successfully deleted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to delete user' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_h = typeof delete_user_dto_1.DeleteUserDto !== "undefined" && delete_user_dto_1.DeleteUserDto) === "function" ? _h : Object, String]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(9);
const mongoose_2 = __webpack_require__(12);
const neo4j_service_1 = __webpack_require__(13);
let UsersService = exports.UsersService = class UsersService {
    constructor(userModel, neo4jService) {
        this.userModel = userModel;
        this.neo4jService = neo4jService;
    }
    async userExists(username) {
        const user = await this.userModel.findOne({ username });
        return !!user;
    }
    async create(createUserDto) {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.userModel.db.startSession();
        session.startTransaction();
        try {
            const userExists = await this.userExists(createUserDto.username);
            if (userExists) {
                const user = await this.userModel.findOne({ username: createUserDto.username });
                user.isActive = true;
                await user.save({ session });
                const neoResult = await neo.run(`MATCH (u:User {username: $username}) SET u.isActive = true RETURN u`, { username: createUserDto.username });
                await neo.commit();
                await session.commitTransaction();
                return {
                    mongoUser: user,
                    neoUser: {
                        ...neoResult.records[0].get('u').properties,
                        _id: neoResult.records[0].get('u').identity.low
                    }
                };
            }
            const createdUser = await this.userModel.create([createUserDto], { session });
            const neoResult = await neo.run(`CREATE (u:User {username: $username, isActive: $isActive}) RETURN u`, { username: createUserDto.username, isActive: true });
            await neo.commit();
            await session.commitTransaction();
            return {
                mongoUser: createdUser[0],
                neoUser: {
                    ...neoResult.records[0].get('u').properties,
                    _id: neoResult.records[0].get('u').identity.low
                }
            };
        }
        catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async findAll() {
        try {
            return this.userModel.find({ isActive: true });
        }
        catch (error) {
            throw new common_1.NotFoundException('Users not found');
        }
    }
    async findOne(id) {
        try {
            const user = await this.userModel.findOne({ _id: id, isActive: true });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async delete(id, deleteUserDTO) {
        const session = await this.userModel.startSession();
        session.startTransaction();
        const neo = this.neo4jService.beginTransaction();
        try {
            const user = await this.userModel.findOne({ _id: id }).select('+password').session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (deleteUserDTO.password !== user.password) {
                throw new common_1.UnauthorizedException('Password is incorrect');
            }
            user.isActive = false;
            await user.save({ session });
            const neoResult = await neo.run(`MATCH (u:User {username: $username}) SET u.isActive = false`, { username: user.username });
            await session.commitTransaction();
            await neo.commit();
            return {
                mongoUser: user,
                neoUser: neoResult
            };
        }
        catch (error) {
            await session.abortTransaction();
            await neo.rollback();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async update(id, updateUserDto) {
        const session = await this.userModel.startSession();
        session.startTransaction();
        try {
            const user = await this.userModel.findOne({ _id: id }).select('+password').session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (updateUserDto.currentPassword !== user.password) {
                throw new common_1.UnauthorizedException('Current password is incorrect');
            }
            user.password = updateUserDto.newPassword;
            await user.save({ session });
            await session.commitTransaction();
            return user;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
};
exports.UsersService = UsersService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _b : Object])
], UsersService);


/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const neo4j_driver_1 = __webpack_require__(14);
const lib_1 = __webpack_require__(15);
let Neo4jService = exports.Neo4jService = class Neo4jService {
    constructor(config, driver) {
        this.config = config;
        this.driver = driver;
    }
    getDriver() {
        return this.driver;
    }
    beginTransaction(database) {
        const session = this.getWriteSession(database);
        return session.beginTransaction();
    }
    getReadSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.session.READ
        });
    }
    getWriteSession(database) {
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j_driver_1.session.WRITE
        });
    }
    read(cypher, params, databaseOrTranscation) {
        if (databaseOrTranscation instanceof lib_1.TransactionImpl) {
            return databaseOrTranscation.run(cypher, params);
        }
        const session = this.getReadSession(databaseOrTranscation);
        return session.run(cypher, params);
    }
    write(cypher, params, databaseOrTranscation) {
        if (databaseOrTranscation instanceof lib_1.TransactionImpl) {
            return databaseOrTranscation.run(cypher, params);
        }
        const session = this.getWriteSession(databaseOrTranscation);
        return session.run(cypher, params);
    }
    opApplicationShutdown() {
        this.driver.close();
    }
};
exports.Neo4jService = Neo4jService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)("NEO4J_CONFIG")),
    tslib_1.__param(1, (0, common_1.Inject)("NEO4J_DRIVER")),
    tslib_1.__metadata("design:paramtypes", [Object, Object])
], Neo4jService);


/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("neo4j-driver");

/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("neo4j-driver/lib");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The password of the user",
        example: "password123"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The current password of the user",
        example: "password123"
    }),
    tslib_1.__metadata("design:type", String)
], UpdateUserDto.prototype, "currentPassword", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The new password of the user",
        example: "newPassword123"
    }),
    tslib_1.__metadata("design:type", String)
], UpdateUserDto.prototype, "newPassword", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Activity status of the user",
        example: true
    }),
    tslib_1.__metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isActive", void 0);


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteUserDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class DeleteUserDto {
}
exports.DeleteUserDto = DeleteUserDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The password of the user",
        example: "password123"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], DeleteUserDto.prototype, "password", void 0);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var MiddlewareModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MiddlewareModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const is_active_middleware_1 = __webpack_require__(22);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(9);
let MiddlewareModule = exports.MiddlewareModule = MiddlewareModule_1 = class MiddlewareModule {
    static forRoot(options) {
        return {
            module: MiddlewareModule_1,
            providers: [
                {
                    provide: 'MIDDLEWARE_OPTIONS',
                    useValue: options || {}
                }
            ]
        };
    }
    configure(consumer) {
        const options = this.getOptions();
        consumer
            .apply(is_active_middleware_1.IsActiveMiddleware)
            .exclude(...options.exclude)
            .forRoutes(options);
    }
    getOptions() {
        const defaultOptions = {
            exclude: [],
            forRoutes: []
        };
        const options = this.getMiddlewareOptions();
        return { ...defaultOptions, ...options };
    }
    getMiddlewareOptions() {
        const middlewareOptions = Reflect.getMetadata('MIDDLEWARE_OPTIONS', MiddlewareModule_1);
        return middlewareOptions ? middlewareOptions : {};
    }
};
exports.MiddlewareModule = MiddlewareModule = MiddlewareModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }]),
        ]
    })
], MiddlewareModule);


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IsActiveMiddleware = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(9);
let IsActiveMiddleware = exports.IsActiveMiddleware = class IsActiveMiddleware {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async use(req, res, next) {
        try {
            const username = req.headers['authorization'];
            if (!username) {
                return res
                    .status(401)
                    .send({ message: 'No authorization header provided' });
            }
            const user = await this.userModel.findOne({ username: username });
            if (!user) {
                return res
                    .status(404)
                    .send({ message: 'Authenticated user not found' });
            }
            if (!user.isActive) {
                return res
                    .status(401)
                    .send({ message: 'Authenticated user is not active' });
            }
            next();
        }
        catch (error) {
            return res
                .status(500)
                .send({ message: 'Internal server error' });
        }
    }
};
exports.IsActiveMiddleware = IsActiveMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], IsActiveMiddleware);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThreadsModule = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(9);
const comment_schema_1 = __webpack_require__(24);
const threads_controller_1 = __webpack_require__(25);
const threads_service_1 = __webpack_require__(26);
const threads_schema_1 = __webpack_require__(27);
const common_1 = __webpack_require__(2);
const is_active_middleware_1 = __webpack_require__(22);
const middleware_module_1 = __webpack_require__(21);
let ThreadsModule = exports.ThreadsModule = class ThreadsModule {
    configure(consumer) {
        consumer
            .apply(is_active_middleware_1.IsActiveMiddleware)
            .forRoutes(threads_controller_1.ThreadsController);
    }
};
exports.ThreadsModule = ThreadsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: threads_schema_1.Thread.name, schema: threads_schema_1.ThreadSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: comment_schema_1.Comment.name, schema: comment_schema_1.CommentSchema }
            ]),
            middleware_module_1.MiddlewareModule.forRoot()
        ],
        controllers: [threads_controller_1.ThreadsController],
        providers: [threads_service_1.ThreadsService]
    })
], ThreadsModule);


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentSchema = exports.Comment = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
let Comment = exports.Comment = class Comment {
    // Calculated field for score
    get score() {
        if (this.upvotes.some(upvote => !mongoose_2.Types.ObjectId.isValid(upvote)) ||
            this.downvotes.some(downvote => !mongoose_2.Types.ObjectId.isValid(downvote)))
            return NaN;
        return this.upvotes.length - this.downvotes.length;
    }
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }) // Index for username
    ,
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Comment.prototype, "content", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Comment', default: null }),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Comment.prototype, "parentComment", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Thread', default: null }),
    tslib_1.__metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Comment.prototype, "thread", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Comment' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "comments", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "upvotes", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Comment.prototype, "downvotes", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    tslib_1.__metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Comment.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    tslib_1.__metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Comment.prototype, "updatedAt", void 0);
exports.Comment = Comment = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Comment);
exports.CommentSchema = mongoose_1.SchemaFactory.createForClass(Comment);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThreadsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(17);
const threads_service_1 = __webpack_require__(26);
const create_thread_dto_1 = __webpack_require__(28);
let ThreadsController = exports.ThreadsController = class ThreadsController {
    constructor(threadsService) {
        this.threadsService = threadsService;
    }
    create(createThreadDto) {
        return this.threadsService
            .create(createThreadDto)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to create thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    update(createThreadDto, id) {
        return this.threadsService
            .update(id, createThreadDto)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to update thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    upvote(id, req) {
        const username = req.headers['authorization'];
        return this.threadsService
            .upvote(id, username)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread or User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException('Already upvoted this thread', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Unable to upvote thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    downvote(id, req) {
        const username = req.headers['authorization'];
        return this.threadsService
            .downvote(id, username)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread or User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Unable to downvote thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    delete(id, req) {
        const username = req.headers['authorization'];
        return this.threadsService
            .delete(id, username)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to delete thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    findAll(sort) {
        const sortMethods = {
            upvotes: () => this.threadsService.findAllSortedByUpvotes(),
            score: () => this.threadsService.findAllSortedByScore(),
            comments: () => this.threadsService.findAllSortedByComments(),
            undefined: () => this.threadsService.findAll()
        };
        const sortMethod = sortMethods[sort];
        if (!sortMethod) {
            throw new common_1.BadRequestException('Invalid sorting method');
        }
        try {
            return sortMethod();
        }
        catch (error) {
            throw new common_1.HttpException('Unable to retrieve threads', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    findOne(id) {
        return this.threadsService
            .findOne(id)
            .then(thread => thread)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to retrieve thread', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiCreatedResponse)({ description: 'The thread has been successfully created.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to create thread.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_thread_dto_1.CreateThreadDto !== "undefined" && create_thread_dto_1.CreateThreadDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], ThreadsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the thread to update.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully updated.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to update thread' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof create_thread_dto_1.CreateThreadDto !== "undefined" && create_thread_dto_1.CreateThreadDto) === "function" ? _d : Object, String]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], ThreadsController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/upvote'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the thread to upvote.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully upvoted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to upvote thread' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], ThreadsController.prototype, "upvote", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/downvote'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the thread to downvote.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully downvoted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to downvote thread' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], ThreadsController.prototype, "downvote", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the thread to delete.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully deleted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to delete thread' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], ThreadsController.prototype, "delete", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiQuery)({ name: 'sort', type: String, description: 'The sorting method: upvotes, score, comments.', required: false }),
    (0, swagger_1.ApiOkResponse)({ description: 'The threads have been successfully retrieved.' }),
    tslib_1.__param(0, (0, common_1.Query)('sort')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], ThreadsController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the thread to retrieve.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], ThreadsController.prototype, "findOne", null);
exports.ThreadsController = ThreadsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('threads'),
    (0, common_1.Controller)('threads'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof threads_service_1.ThreadsService !== "undefined" && threads_service_1.ThreadsService) === "function" ? _a : Object])
], ThreadsController);


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThreadsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const threads_schema_1 = __webpack_require__(27);
const user_schema_1 = __webpack_require__(9);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const neo4j_service_1 = __webpack_require__(13);
let ThreadsService = exports.ThreadsService = class ThreadsService {
    constructor(threadModel, userModel, neo4jService) {
        this.threadModel = threadModel;
        this.userModel = userModel;
        this.neo4jService = neo4jService;
    }
    async create(createThreadDto) {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();
        try {
            const createdThread = await this.threadModel.create([createThreadDto], { session });
            await neo.run(`CREATE (t:Thread { title: $title, content: $content, username: $username }) RETURN t`, { title: createThreadDto.title, content: createThreadDto.content, username: createThreadDto.username });
            await neo.commit();
            await session.commitTransaction();
            return createdThread[0];
        }
        catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async update(id, updateThreadDto) {
        const session = await this.threadModel.db.startSession();
        session.startTransaction();
        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            if (thread.username !== updateThreadDto.username) {
                throw new common_1.UnauthorizedException('User is not authorized to update this thread');
            }
            const updatedThread = await this.threadModel.findOneAndUpdate({ _id: id }, updateThreadDto, { new: true, session });
            await session.commitTransaction();
            return updatedThread;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async upvote(id, username) {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();
        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            const user = await this.userModel.findOne({ username: username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const hasUpvoted = thread.upvotes.includes(user._id);
            const hasDownvoted = thread.downvotes.includes(user._id);
            if (hasUpvoted) {
                throw new common_1.BadRequestException('User has already upvoted this thread');
            }
            if (hasDownvoted) {
                const idx = thread.downvotes.indexOf(user._id);
                thread.downvotes.splice(idx, 1);
            }
            thread.upvotes.push(user._id);
            await thread.save({ session });
            await neo.run(`MATCH (u:User { username: $username }), (t:Thread { id: $id }) MERGE (u)-[:UPVOTED]->(t)`, { username: username, id: thread._id });
            await neo.commit();
            await session.commitTransaction();
            return thread;
        }
        catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async downvote(id, username) {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();
        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            const user = await this.userModel.findOne({ username: username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const hasUpvoted = thread.upvotes.includes(user._id);
            const hasDownvoted = thread.downvotes.includes(user._id);
            if (hasDownvoted) {
                throw new common_1.BadRequestException('User has already downvoted this thread');
            }
            if (hasUpvoted) {
                const idx = thread.upvotes.indexOf(user._id);
                thread.upvotes.splice(idx, 1);
            }
            thread.downvotes.push(user._id);
            await thread.save({ session });
            await neo.run(`MATCH (u:User { username: $username }), (t:Thread { id: $id }) MERGE (u)-[:DOWNVOTED]->(t)`, { username: username, id: thread._id });
            await neo.commit();
            await session.commitTransaction();
            return thread;
        }
        catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async delete(id, username) {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();
        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            if (thread.username !== username) {
                throw new common_1.UnauthorizedException('User is not authorized to delete this thread');
            }
            const deletedThread = await this.threadModel.findOneAndDelete({ _id: id }, { session });
            await Promise.all([
                neo.run(`MATCH (:User)-[r:UPVOTED]->(t:Thread { id: $id }) DELETE r`, { id: thread._id }),
                neo.run(`MATCH (:User)-[r:DOWNVOTED]->(t:Thread { id: $id }) DELETE r`, { id: thread._id }),
                neo.run(`MATCH (t:Thread { id: $id }) DETACH DELETE t`, { id: thread._id })
            ]);
            await neo.commit();
            await session.commitTransaction();
            return deletedThread;
        }
        catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async findAll() {
        try {
            return this.threadModel
                .find()
                .select('-comments');
        }
        catch (error) {
            throw new common_1.NotFoundException('Threads not found');
        }
    }
    async findAllSortedByUpvotes() {
        try {
            return this.threadModel
                .find()
                .sort({ upvotes: -1 })
                .select('-comments');
        }
        catch (error) {
            throw new common_1.NotFoundException('Threads not found');
        }
    }
    async findAllSortedByScore() {
        try {
            return this.threadModel.aggregate([
                { $addFields: { voteDifference: { $subtract: [{ $size: "$upvotes" }, { $size: "$downvotes" }] } } },
                { $sort: { voteDifference: -1 } },
                { $project: { comments: 0 } }
            ]);
        }
        catch (error) {
            throw new common_1.NotFoundException('Threads not found');
        }
    }
    async findAllSortedByComments() {
        try {
            return this.threadModel.aggregate([
                { $addFields: { commentCount: { $size: "$comments" } } },
                { $sort: { commentCount: -1 } },
                { $project: { comments: 0 } }
            ]);
        }
        catch (error) {
            throw new common_1.NotFoundException('Threads not found');
        }
    }
    async findOne(id) {
        try {
            const thread = await this.threadModel.aggregate([
                { $match: { _id: new mongoose_2.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'thread',
                        as: 'comments'
                    }
                },
                {
                    $addFields: {
                        upvotesCount: { $size: "$upvotes" },
                        downvotesCount: { $size: "$downvotes" },
                        comments: {
                            $map: {
                                input: "$comments",
                                as: "comment",
                                in: {
                                    _id: "$$comment._id",
                                    content: "$$comment.content",
                                    upvotesCount: { $size: "$$comment.upvotes" },
                                    downvotesCount: { $size: "$$comment.downvotes" },
                                }
                            }
                        }
                    }
                },
                { $unset: ["upvotes", "downvotes"] }
            ]);
            if (!thread.length) {
                throw new common_1.NotFoundException('Thread not found');
            }
            return thread[0];
        }
        catch (error) {
            throw new Error('Unable to find thread');
        }
    }
};
exports.ThreadsService = ThreadsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(threads_schema_1.Thread.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _c : Object])
], ThreadsService);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThreadSchema = exports.Thread = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
let Thread = exports.Thread = class Thread {
    // Calculated field for score
    get score() {
        if (this.upvotes.some(upvote => !mongoose_2.Types.ObjectId.isValid(upvote)) ||
            this.downvotes.some(downvote => !mongoose_2.Types.ObjectId.isValid(downvote)))
            return NaN;
        return this.upvotes.length - this.downvotes.length;
    }
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }) // Index for username
    ,
    tslib_1.__metadata("design:type", String)
], Thread.prototype, "username", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Thread.prototype, "title", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], Thread.prototype, "content", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Comment' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Thread.prototype, "comments", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Thread.prototype, "upvotes", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'User' }], default: [] }),
    tslib_1.__metadata("design:type", Array)
], Thread.prototype, "downvotes", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Thread.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ index: true }),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Thread.prototype, "updatedAt", void 0);
exports.Thread = Thread = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Thread);
exports.ThreadSchema = mongoose_1.SchemaFactory.createForClass(Thread);


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateThreadDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class CreateThreadDto {
}
exports.CreateThreadDto = CreateThreadDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateThreadDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The title of the thread",
        example: "My first thread"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateThreadDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The content of the thread",
        example: "This is the content of my first thread"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateThreadDto.prototype, "content", void 0);


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const comment_schema_1 = __webpack_require__(24);
const user_schema_1 = __webpack_require__(9);
const threads_schema_1 = __webpack_require__(27);
const comments_controller_1 = __webpack_require__(30);
const comments_service_1 = __webpack_require__(31);
const is_active_middleware_1 = __webpack_require__(22);
const middleware_module_1 = __webpack_require__(21);
let CommentsModule = exports.CommentsModule = class CommentsModule {
    configure(consumer) {
        consumer
            .apply(is_active_middleware_1.IsActiveMiddleware)
            .forRoutes(comments_controller_1.CommentsController);
    }
};
exports.CommentsModule = CommentsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Comment', schema: comment_schema_1.CommentSchema },
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Thread', schema: threads_schema_1.ThreadSchema }
            ]),
            middleware_module_1.MiddlewareModule.forRoot()
        ],
        providers: [comments_service_1.CommentsService],
        controllers: [comments_controller_1.CommentsController]
    })
], CommentsModule);


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(17);
const comments_service_1 = __webpack_require__(31);
const create_comment_dto_1 = __webpack_require__(32);
const create_nested_comment_dto_1 = __webpack_require__(33);
let CommentsController = exports.CommentsController = class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService;
    }
    create(createCommentDto) {
        return this.commentsService
            .create(createCommentDto)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('User or Thread not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to create comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    createNestedComment(createNestedCommentDto, id) {
        return this.commentsService
            .createNestedComment(id, createNestedCommentDto)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('User or Parent comment not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to create nested comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    delete(id, req) {
        const username = req.headers['authorization'];
        return this.commentsService
            .delete(id, username)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to delete comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    upvote(id, username) {
        return this.commentsService
            .upvoteComment(id, username)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Comment or User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Unable to upvote comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    downvote(id, username) {
        return this.commentsService
            .downvoteComment(id, username)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Comment or User not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.BadRequestException) {
                throw new common_1.HttpException('Bad request', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Unable to downvote comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    getCommentsByThreadId(id) {
        return this.commentsService
            .getCommentsByThreadId(id)
            .then(comments => comments)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Thread not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to get comments', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    getComments() {
        return this.commentsService
            .getComments()
            .then(comments => comments)
            .catch(error => {
            throw new common_1.HttpException('Unable to get comments', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    getCommentById(id) {
        return this.commentsService
            .getCommentById(id)
            .then(comment => comment)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to get comment', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    getNestedComments(id) {
        return this.commentsService
            .getNestedComments(id)
            .then(comments => comments)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to get nested comments', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiCreatedResponse)({ description: 'The comment has been successfully created.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to create comment.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User or Thread not found' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_comment_dto_1.CreateCommentDto !== "undefined" && create_comment_dto_1.CreateCommentDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], CommentsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the parent comment.' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'The nested comment has been successfully created.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to create nested comment.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'User or Parent comment not found' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof create_nested_comment_dto_1.CreateNestedCommentDto !== "undefined" && create_nested_comment_dto_1.CreateNestedCommentDto) === "function" ? _d : Object, String]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], CommentsController.prototype, "createNestedComment", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to delete.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The comment has been successfully deleted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to delete comment' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], CommentsController.prototype, "delete", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/upvote'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to upvote.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The comment has been successfully upvoted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment or User not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to upvote comment' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)('username')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], CommentsController.prototype, "upvote", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/downvote'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to downvote.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The comment has been successfully downvoted.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment or User not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to downvote comment' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)('username')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], CommentsController.prototype, "downvote", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/thread'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to get the thread from.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The thread has been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Thread not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to get comments' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], CommentsController.prototype, "getCommentsByThreadId", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiSecurity)('username'),
    (0, swagger_1.ApiOkResponse)({ description: 'The comments have been successfully retrieved.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to get comments' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], CommentsController.prototype, "getComments", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to get.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The comment has been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to get comment' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_l = typeof Promise !== "undefined" && Promise) === "function" ? _l : Object)
], CommentsController.prototype, "getCommentById", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/nested'),
    (0, swagger_1.ApiParam)({ name: 'id', type: String, description: 'The id of the comment to get nested comments from.' }),
    (0, swagger_1.ApiOkResponse)({ description: 'The nested comments have been successfully retrieved.' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Comment not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to get nested comments' }),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_m = typeof Promise !== "undefined" && Promise) === "function" ? _m : Object)
], CommentsController.prototype, "getNestedComments", null);
exports.CommentsController = CommentsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('comments'),
    (0, common_1.Controller)('comments'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof comments_service_1.CommentsService !== "undefined" && comments_service_1.CommentsService) === "function" ? _a : Object])
], CommentsController);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __webpack_require__(12);
const user_schema_1 = __webpack_require__(9);
const threads_schema_1 = __webpack_require__(27);
const comment_schema_1 = __webpack_require__(24);
let CommentsService = exports.CommentsService = class CommentsService {
    constructor(commentModel, userModel, threadModel) {
        this.commentModel = commentModel;
        this.userModel = userModel;
        this.threadModel = threadModel;
    }
    async create(createCommentDto) {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();
        try {
            const user = await this.userModel.findOne({ username: createCommentDto.username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const thread = await this.threadModel.findOne({ _id: createCommentDto.thread }).session(session);
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            const createdComment = await this.commentModel.create([createCommentDto], { session });
            thread.comments.push(createdComment[0]._id);
            await thread.save({ session });
            await session.commitTransaction();
            return createdComment[0];
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to create comment');
        }
        finally {
            session.endSession();
        }
    }
    async createNestedComment(id, createNestedCommentDto) {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();
        try {
            const user = await this.userModel.findOne({ username: createNestedCommentDto.username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const parentComment = await this.commentModel.findOne({ _id: id }).session(session);
            if (!parentComment) {
                throw new common_1.NotFoundException('Parent comment not found');
            }
            const createdComment = await this.commentModel.create([createNestedCommentDto], { session });
            parentComment.comments.push(createdComment[0]._id);
            await parentComment.save({ session });
            await session.commitTransaction();
            return createdComment[0];
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to create nested comment');
        }
        finally {
            session.endSession();
        }
    }
    async delete(id, username) {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();
        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            if (comment.username !== username) {
                throw new common_1.UnauthorizedException('User is not author of comment');
            }
            const deletedComment = await this.commentModel.findByIdAndDelete(id, { session });
            await session.commitTransaction();
            return deletedComment;
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to delete comment');
        }
        finally {
            session.endSession();
        }
    }
    async upvoteComment(id, username) {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();
        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            const user = await this.userModel.findOne({ username: username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const hasUpvoted = comment.upvotes.includes(user._id);
            const hasDownvoted = comment.downvotes.includes(user._id);
            if (hasUpvoted) {
                throw new common_1.BadRequestException('User has already upvoted this comment');
            }
            if (hasDownvoted) {
                const idx = comment.downvotes.indexOf(user._id);
                comment.downvotes.splice(idx, 1);
            }
            comment.upvotes.push(user._id);
            await comment.save({ session });
            await session.commitTransaction();
            return comment;
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to upvote comment');
        }
        finally {
            session.endSession();
        }
    }
    async downvoteComment(id, username) {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();
        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            const user = await this.userModel.findOne({ username: username }).session(session);
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const hasUpvoted = comment.upvotes.includes(user._id);
            const hasDownvoted = comment.downvotes.includes(user._id);
            if (hasDownvoted) {
                throw new common_1.BadRequestException('User has already downvoted this comment');
            }
            if (hasUpvoted) {
                const idx = comment.upvotes.indexOf(user._id);
                comment.upvotes.splice(idx, 1);
            }
            comment.downvotes.push(user._id);
            await comment.save({ session });
            await session.commitTransaction();
            return comment;
        }
        catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to downvote comment');
        }
        finally {
            session.endSession();
        }
    }
    async getComments() {
        try {
            const comments = await this.commentModel.find();
            return comments;
        }
        catch (error) {
            throw new Error('Unable to get comments');
        }
    }
    async getCommentsByThreadId(id) {
        try {
            const thread = await this.threadModel
                .findOne({ _id: id })
                .populate('comments');
            if (!thread) {
                throw new common_1.NotFoundException('Thread not found');
            }
            const comments = await this.commentModel.find({ threadId: id });
            return comments;
        }
        catch (error) {
            throw new Error('Unable to get comments');
        }
    }
    async getCommentById(id) {
        try {
            const comment = await this.commentModel.findOne({ _id: id });
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            return comment;
        }
        catch (error) {
            throw new Error('Unable to get comment');
        }
    }
    async getNestedComments(id) {
        try {
            const comment = await this.commentModel
                .findOne({ _id: id })
                .populate('comments');
            if (!comment) {
                throw new common_1.NotFoundException('Comment not found');
            }
            const nestedComments = await this.commentModel.find({ _id: { $in: comment.comments } });
            return nestedComments;
        }
        catch (error) {
            throw new Error('Unable to get nested comments');
        }
    }
};
exports.CommentsService = CommentsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(threads_schema_1.Thread.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], CommentsService);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCommentDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommentDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The content of the comment",
        example: "This is the content of my first comment"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The id of the thread",
        example: "5f9c2b7b1c9d440000b7f1e6"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommentDto.prototype, "thread", void 0);


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateNestedCommentDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class CreateNestedCommentDto {
}
exports.CreateNestedCommentDto = CreateNestedCommentDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateNestedCommentDto.prototype, "username", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The content of the comment",
        example: "This is the content of my first comment"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateNestedCommentDto.prototype, "content", void 0);


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var Neo4jModule_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const neo4j_service_1 = __webpack_require__(13);
const config_1 = __webpack_require__(35);
const neo4j_utils_1 = __webpack_require__(36);
const neo4j_transaction_interceptor_1 = __webpack_require__(37);
const rxjs_1 = __webpack_require__(39);
const NEO4J_OPTIONS = 'NEO4J_OPTIONS';
const NEO4J_DRIVER = 'NEO4J_DRIVER';
let Neo4jModule = exports.Neo4jModule = Neo4jModule_1 = class Neo4jModule {
    static forRoot(config) {
        return {
            module: Neo4jModule_1,
            global: true,
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    useValue: config
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: [NEO4J_OPTIONS],
                    useFactory: async (config) => {
                        return await (0, neo4j_utils_1.createDriver)(config);
                    }
                },
                neo4j_service_1.Neo4jService
            ],
            exports: [neo4j_service_1.Neo4jService, neo4j_transaction_interceptor_1.Neo4jTransactionInterceptor]
        };
    }
    static forRootAsync(configProvider) {
        return {
            module: Neo4jModule_1,
            global: true,
            imports: [config_1.ConfigModule],
            providers: [
                {
                    provide: NEO4J_OPTIONS,
                    ...configProvider
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: [NEO4J_OPTIONS],
                    useFactory: async (config) => {
                        return await (0, neo4j_utils_1.createDriver)(config);
                    }
                },
                neo4j_service_1.Neo4jService
            ],
            exports: [neo4j_service_1.Neo4jService]
        };
    }
};
exports.Neo4jModule = Neo4jModule = Neo4jModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [
            {
                provide: 'NEO4J_CONFIG',
                useValue: rxjs_1.config
            }
        ]
    })
], Neo4jModule);


/***/ }),
/* 35 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createDriver = void 0;
const tslib_1 = __webpack_require__(1);
const neo4j_driver_1 = tslib_1.__importDefault(__webpack_require__(14));
const createDriver = async (config) => {
    const driver = neo4j_driver_1.default.driver(`${config.scheme}://${config.host}:${config.port}`, neo4j_driver_1.default.auth.basic(config.username, config.password));
    await driver.verifyConnectivity();
    return driver;
};
exports.createDriver = createDriver;


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Neo4jTransactionInterceptor = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const neo4j_service_1 = __webpack_require__(13);
const operators_1 = __webpack_require__(38);
let Neo4jTransactionInterceptor = exports.Neo4jTransactionInterceptor = class Neo4jTransactionInterceptor {
    constructor(neo4jService) {
        this.neo4jService = neo4jService;
    }
    intercept(context, next) {
        const transaction = this.neo4jService.beginTransaction();
        context.switchToHttp().getRequest().transaction = transaction;
        return next.handle()
            .pipe((0, operators_1.tap)(() => {
            transaction.commit();
        }), (0, operators_1.catchError)(e => {
            transaction.rollback();
            throw e;
        }));
    }
};
exports.Neo4jTransactionInterceptor = Neo4jTransactionInterceptor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _a : Object])
], Neo4jTransactionInterceptor);


/***/ }),
/* 38 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FriendsModule = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const friends_controller_1 = __webpack_require__(41);
const friends_service_1 = __webpack_require__(42);
const mongoose_1 = __webpack_require__(7);
const user_schema_1 = __webpack_require__(9);
const is_active_middleware_1 = __webpack_require__(22);
const middleware_module_1 = __webpack_require__(21);
let FriendsModule = exports.FriendsModule = class FriendsModule {
    configure(consumer) {
        consumer
            .apply(is_active_middleware_1.IsActiveMiddleware)
            .forRoutes(friends_controller_1.FriendsController);
    }
};
exports.FriendsModule = FriendsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'User', schema: user_schema_1.UserSchema }]),
            middleware_module_1.MiddlewareModule.forRoot()
        ],
        controllers: [friends_controller_1.FriendsController],
        providers: [friends_service_1.FriendsService]
    })
], FriendsModule);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FriendsController = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const swagger_1 = __webpack_require__(17);
const friends_service_1 = __webpack_require__(42);
const create_friendship_dto_1 = __webpack_require__(43);
const delete_friendship_dto_1 = __webpack_require__(44);
let FriendsController = exports.FriendsController = class FriendsController {
    constructor(friendsService) {
        this.friendsService = friendsService;
    }
    create(createFriendshipDto) {
        return this.friendsService
            .makeFriend(createFriendshipDto.user, createFriendshipDto.friend)
            .then(result => result)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to create friendship', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
    remove(deleteFriendshipDTO) {
        return this.friendsService
            .removeFriend(deleteFriendshipDTO.user, deleteFriendshipDTO.friend)
            .then(result => result)
            .catch(error => {
            if (error instanceof common_1.NotFoundException) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException('Unable to delete friendship', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        });
    }
    ;
};
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Friendship has been successfully created.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to create friendship.' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof create_friendship_dto_1.CreateFriendshipDto !== "undefined" && create_friendship_dto_1.CreateFriendshipDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], FriendsController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Friendship has been successfully deleted.' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({ description: 'Unable to delete friendship.' }),
    tslib_1.__param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof delete_friendship_dto_1.DeleteFriendshipDto !== "undefined" && delete_friendship_dto_1.DeleteFriendshipDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], FriendsController.prototype, "remove", null);
exports.FriendsController = FriendsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('friends'),
    (0, common_1.Controller)('friends'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof friends_service_1.FriendsService !== "undefined" && friends_service_1.FriendsService) === "function" ? _a : Object])
], FriendsController);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FriendsService = void 0;
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const mongoose_1 = __webpack_require__(7);
const neo4j_service_1 = __webpack_require__(13);
let FriendsService = exports.FriendsService = class FriendsService {
    constructor(userModel, neo4jService) {
        this.userModel = userModel;
        this.neo4jService = neo4jService;
    }
    async userExists(username) {
        const user = await this.userModel.findOne({ username });
        return !!user;
    }
    /**
     * Befriends two users
     * @param user A username
     * @param friend A username
     */
    async makeFriend(user, friend) {
        const [userExists, friendExists] = await Promise.all([
            this.userExists(user),
            this.userExists(friend)
        ]);
        if (!userExists || !friendExists) {
            throw new common_1.NotFoundException(`User ${!userExists ? user : friend} not found`);
        }
        const [mongoUser, mongoFried] = await Promise.all([
            this.userModel.findOne({ username: user }),
            this.userModel.findOne({ username: friend })
        ]);
        if (!mongoUser.isActive || !mongoFried.isActive) {
            throw new common_1.NotFoundException(`User ${!mongoUser.isActive ? user : friend} is not active`);
        }
        const neo = this.neo4jService.beginTransaction();
        try {
            const existingFriendship = await neo.run(`MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) RETURN r`, { user, friend });
            if (existingFriendship.records.length > 0) {
                return existingFriendship.records;
            }
            else {
                const result = await neo.run(`MERGE (u:User {username: $user})-[:FRIENDS_WITH]-(f:User {username: $friend})`, { user, friend });
                await neo.commit();
                return result.records;
            }
        }
        catch (error) {
            await neo.rollback();
            throw new Error('Could not make friend');
        }
    }
    /**
     * Unfriends two users
     * @param user A username
     * @param friend A username
     */
    async removeFriend(user, friend) {
        const [userExists, friendExists] = await Promise.all([
            this.userExists(user),
            this.userExists(friend)
        ]);
        if (!userExists || !friendExists) {
            throw new common_1.NotFoundException(`User ${!userExists ? user : friend} not found`);
        }
        const neo = this.neo4jService.beginTransaction();
        try {
            const existingFriendship = await neo.run(`MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) RETURN r`, { user, friend });
            if (existingFriendship.records.length > 0) {
                const result = await neo.run(`MATCH (u:User {username: $user})-[r:FRIENDS_WITH]-(f:User {username: $friend}) DELETE r`, { user, friend });
                await neo.commit();
                return result.records;
            }
            else {
                return existingFriendship.records;
            }
        }
        catch (error) {
            await neo.rollback();
            throw new Error('Could not remove friend');
        }
    }
};
exports.FriendsService = FriendsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)('User')),
    tslib_1.__metadata("design:paramtypes", [Object, typeof (_a = typeof neo4j_service_1.Neo4jService !== "undefined" && neo4j_service_1.Neo4jService) === "function" ? _a : Object])
], FriendsService);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateFriendshipDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class CreateFriendshipDto {
}
exports.CreateFriendshipDto = CreateFriendshipDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateFriendshipDto.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the friend",
        example: "jane.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateFriendshipDto.prototype, "friend", void 0);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeleteFriendshipDto = void 0;
const tslib_1 = __webpack_require__(1);
const swagger_1 = __webpack_require__(17);
const class_validator_1 = __webpack_require__(18);
class DeleteFriendshipDto {
}
exports.DeleteFriendshipDto = DeleteFriendshipDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the user",
        example: "john.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], DeleteFriendshipDto.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The username of the friend",
        example: "jane.doe"
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], DeleteFriendshipDto.prototype, "friend", void 0);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("dotenv");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const common_1 = __webpack_require__(2);
const core_1 = __webpack_require__(3);
const app_module_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(17);
const dotenv = tslib_1.__importStar(__webpack_require__(45));
async function bootstrap() {
    dotenv.config({
        path: "../.env"
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Studdit')
        .setDescription('The Studdit API description. Built for the NoSQL course, provided by Avans Hogeschool.')
        .setVersion('1.0')
        .addServer(`http://localhost:${process.env.PORT}/api`)
        .addServer(`https://studdit-api.herokuapp.com`)
        .addSecurity('username', {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
        description: 'Your username (bad security, just for POC).'
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(globalPrefix, app, document);
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3003;
    await app.listen(port);
    common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map