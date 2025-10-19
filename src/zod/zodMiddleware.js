/// <reference path="../types/zodMiddleware.d.ts" />

import { z } from "zod";
import { preprocessBodyConvertion, preprocessConvertion } from "./zodMiddlewareHelper.js";

function sendErrors(errors, res) {
    const issue = errors[0].errors.issues[0];
    let message = issue.message;
    // if(issue.path.length > 0) {
    //     message = `Invalid ${issue.path.join('.')} value. ${issue.message}`;
    // }
    // else {
    //     message = `Invalid ${issue.message} value`;
    // }
    return res.status(400).send({ error: message });
};

export const zodSchema_Id = z.object({ id: z.number() });
export const zodSchema_IdString = z.object({ id: z.string() });
export const zodSchema_Name = z.object({ name: z.string() });

export function validateBody(schema) {
    return function (req, res, next) {
		preprocessBodyConvertion(req.body, schema.shape);
        var parsed = schema.safeParse(req.body);
        if (parsed.success) {
            return next();
        }
        else {
            return sendErrors([{ type: 'Body', errors: parsed.error }], res);
        }
    };
};

export function validateParams(schema) {
    return function (req, res, next) {
        preprocessConvertion(req.params, schema.shape);
        var parsed = schema.safeParse(req.params);
        if (parsed.success) {
            return next();
        }
        else {
            return sendErrors([{ type: 'Params', errors: parsed.error }], res);
        }
    };
};

export function validateQuery(schema) {
    return function (req, res, next) {
        const copy = { ...req.query };
        preprocessConvertion(copy, schema.shape) //We can't change req.query directly
        var parsed = schema.safeParse(copy);
        req.validatedQuery = copy;
        if (parsed.success) {
            return next();
        }
        else {
            return sendErrors([{ type: 'Query', errors: parsed.error }], res);
        }
    }
};