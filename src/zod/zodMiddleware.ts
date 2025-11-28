import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodObject, ZodError, ZodType, ZodSchema, infer as ZodInfer } from "zod";
import { preprocessBodyConversion, preprocessConversion } from "./zodMiddlewareHelper.js";
import "express";
import QueryString from 'qs';

interface ValidationError {
    type: string;
    errors: ZodError;
}

export function sendErrors(errors: ValidationError[], res: Response): Response {
    const issue = errors[0].errors.issues[0];
    const message = issue.message;
    return res.status(400).send({ error: message });
}

export const zodSchema_Id = z.object({ id: z.number() });
export const zodSchema_IdString = z.object({ id: z.string() });
export const zodSchema_Name = z.object({ name: z.string() });
/*
declare module '@devlocore/apipack/zod' {
    export declare function validateBody<TBody>(zodSchema: ZodSchema<TBody>): RequestHandler<ParamsDictionary, any, TBody, any>;
    export declare function validateParams<TParams>(zodSchema: ZodSchema<TParams>): RequestHandler<TParams, any, any, any>;
    export declare function validateQuery<TQuery>(zodSchema: ZodSchema<TQuery>): RequestHandler<ParamsDictionary, any, any, TQuery>;
}*/

export function validateBody<TBody>(schema: ZodSchema<TBody>) {
    return function (req: Request<Request['params'], unknown, TBody, Request['query']>, res: Response, next: NextFunction): void {
        if (schema instanceof ZodObject) {
            preprocessBodyConversion(req.body as Record<string, unknown>, (schema as ZodObject<Record<string, ZodType>>).shape as Record<string, ZodType>);
        }
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Body', errors: parsed.error }], res);
        }
    };
}

export function validateParams<TParams extends Request['params']>(schema: ZodSchema<TParams>) {
    return function (req: Request<TParams, unknown, unknown, Request['query']>, res: Response, next: NextFunction): void {
        if (schema instanceof ZodObject) {
            preprocessConversion(req.params as Record<string, unknown>, (schema as ZodObject<Record<string, ZodType>>).shape as Record<string, ZodType>);
        }
        const parsed = schema.safeParse(req.params);
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Params', errors: parsed.error }], res);
        }
    };
}

export function validateQuery<TQuery extends QueryString.ParsedQs>(schema: ZodSchema<TQuery>) {
    return function (req: Request<Request['params'], unknown, unknown, TQuery>, res: Response, next: NextFunction): void {
        const copy = { ...req.query } as Record<string, unknown>;
        if (schema instanceof ZodObject) {
            preprocessConversion(copy, (schema as ZodObject<Record<string, ZodType>>).shape as Record<string, ZodType>); //We can't change req.query directly
        }
        const parsed = schema.safeParse(copy);
        req.validatedQuery = copy as TQuery;
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Query', errors: parsed.error }], res);
        }
    };
}

export {}