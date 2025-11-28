import type { ZodType } from "zod";

function extractBaseType(zodType: ZodType): string {
    let current = zodType as { def?: { type?: string; innerType?: unknown } };
    while (current.def?.type === "optional" || current.def?.type === "nullable") {
        current = current.def.innerType as typeof current;
    }
    return current.def?.type ?? "";
}

export const isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.getTime());

export function preprocessBodyConversion(data: Record<string, unknown> | undefined, shape: Record<string, ZodType>): void {
	if(!data) return;
	for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "date":
					const parsedDate = new Date(data[key] as string);
					if(!isValidDate(parsedDate)) data[key] = undefined;
					else data[key] = parsedDate;
					break;
                default:
                    break;
            }
        }
    }
}

export function preprocessConversion(data: Record<string, unknown> | undefined, shape: Record<string, ZodType>): void {
	if(!data) return;
    for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "date":
					const parsedDate = new Date(data[key] as string);
					if(!isValidDate(parsedDate)) data[key] = undefined;
					else data[key] = parsedDate;
					break;
                case "number":
                    const parsed = Number(data[key]);
                    if(isNaN(parsed)) data[key] = undefined;
                    else data[key] = parsed;
                    break;
                case "boolean":
                    data[key] = data[key] === "true";
                    break;
                default:
                    break;
            }
        }
    }
}
