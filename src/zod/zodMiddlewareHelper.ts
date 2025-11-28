import type { ZodType } from "zod";

function extractBaseType(zodType: ZodType): string {
    let current = zodType as any;
    while (current._zod?.def?.type === "optional" || current._zod?.def?.type === "nullable") {
        current = current._zod.def.innerType;
    }
    return current._zod?.def?.type ?? "";
}

export const isValidDate = (d: Date): boolean => d instanceof Date && !isNaN(d.getTime());

export function preprocessBodyConvertion(data: Record<string, unknown> | undefined, shape: Record<string, ZodType>): void {
	if(!data) return;
	for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "ZodDate":
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

export function preprocessConvertion(data: Record<string, unknown> | undefined, shape: Record<string, ZodType>): void {
	if(!data) return;
    for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "ZodDate":
					const parsedDate = new Date(data[key] as string);
					if(!isValidDate(parsedDate)) data[key] = undefined;
					else data[key] = parsedDate;
					break;
                case "ZodNumber":
                    const parsed = Number(data[key]);
                    if(isNaN(parsed)) data[key] = undefined;
                    else data[key] = parsed;
                    break;
                case "ZodBoolean":
                    data[key] = data[key] === "true";
                    break;
                default:
                    break;
            }
        }
    }
}
