import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ParsedQs } from 'qs';
import { z, ZodObject, ZodError, ZodType, ZodSchema, infer as ZodInfer } from "zod";
import { preprocessBodyConversion, preprocessConversion } from "./zodMiddlewareHelper.js";
import 'express'

// declare global {
// 	namespace Express {
// 		interface Request<ReqQuery extends { query?: any } = { query?: any }> {
// 			validatedQuery?: ReqQuery['query'];
// 			test: string;
// 		}
// 	}
// }

// declare module 'express-serve-static-core' {
//     export interface Request {
//         validatedQuery?: Request['query'];
// 		test: number;
//     }
// }

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

export function validateParams<TParams>(schema: ZodSchema<TParams>) {
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
export function validateQuery<TQuery extends ParsedQs>(schema: ZodSchema<TQuery>) {
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