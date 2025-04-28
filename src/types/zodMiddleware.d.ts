import { Request, RequestHandler, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { z, ZodEffects, ZodError, ZodSchema, ZodType, ZodTypeDef, ZodNumber, ZodOptional } from 'zod';

declare module '@devlocore/apipack/zod' {
    export declare function validateBody<TBody>(zodSchema: ZodSchema<TBody>): RequestHandler<ParamsDictionary, any, TBody, any>;
    export declare function validateParams<TParams>(zodSchema: ZodSchema<TParams>): RequestHandler<TParams, any, any, any>;
    export declare function validateQuery<TQuery>(zodSchema: ZodSchema<TQuery>): RequestHandler<ParamsDictionary, any, any, TQuery>;
}

declare module 'express-serve-static-core' {
    interface Request<ReqQuery> {
        validatedQuery: ReqQuery;
    }
}