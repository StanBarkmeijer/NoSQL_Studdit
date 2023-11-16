import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IsActiveMiddleware } from './is-active.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ]
})
export class MiddlewareModule implements NestModule {
    static forRoot(options?: any) {
        return {
            module: MiddlewareModule,
            providers: [
                {
                    provide: 'MIDDLEWARE_OPTIONS',
                    useValue: options || {}
                }
            ]
        }
    } 
    
    configure(consumer: MiddlewareConsumer) {
        const options = this.getOptions();

        consumer
            .apply(IsActiveMiddleware)
            .exclude(...options.exclude)
            .forRoutes(options)
    }

    getOptions(): any {
        const defaultOptions = {
            exclude: [],
            forRoutes: []
        }

        const options = this.getMiddlewareOptions();
        return { ...defaultOptions, ...options };
    }

    getMiddlewareOptions(): any {
        const middlewareOptions = Reflect.getMetadata('MIDDLEWARE_OPTIONS', MiddlewareModule);

        return middlewareOptions ? middlewareOptions : {};
    }
}
