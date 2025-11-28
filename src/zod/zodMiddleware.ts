import { Request, Response, NextFunction, RequestHandler } from 'express';
import { z, ZodObject, ZodError, ZodType } from "zod";
import { preprocessBodyConvertion, preprocessConvertion } from "./zodMiddlewareHelper.js";

// Extend Express Request to include validatedQuery
declare module 'express-serve-static-core' {
    interface Request {
        validatedQuery?: Record<string, unknown>;
    }
}

interface ValidationError {
    type: string;
    errors: ZodError;
}

function sendErrors(errors: ValidationError[], res: Response): Response {
    const issue = errors[0].errors.issues[0];
    const message = issue.message;
    return res.status(400).send({ error: message });
}

export const zodSchema_Id = z.object({ id: z.number() });
export const zodSchema_IdString = z.object({ id: z.string() });
export const zodSchema_Name = z.object({ name: z.string() });

export function validateBody<T extends Record<string, ZodType>>(schema: ZodObject<T>): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        preprocessBodyConvertion(req.body as Record<string, unknown>, schema.shape as Record<string, ZodType>);
        const parsed = schema.safeParse(req.body);
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Body', errors: parsed.error }], res);
        }
    };
}

export function validateParams<T extends Record<string, ZodType>>(schema: ZodObject<T>): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        preprocessConvertion(req.params as Record<string, unknown>, schema.shape as Record<string, ZodType>);
        const parsed = schema.safeParse(req.params);
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Params', errors: parsed.error }], res);
        }
    };
}

export function validateQuery<T extends Record<string, ZodType>>(schema: ZodObject<T>): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction): void {
        const copy = { ...req.query } as Record<string, unknown>;
        preprocessConvertion(copy, schema.shape as Record<string, ZodType>); //We can't change req.query directly
        const parsed = schema.safeParse(copy);
        req.validatedQuery = copy;
        if (parsed.success) {
            next();
        }
        else {
            sendErrors([{ type: 'Query', errors: parsed.error }], res);
        }
    };
}
