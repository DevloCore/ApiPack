function extractBaseType(zodType) {
    let current = zodType;
    while (current._def.typeName === "ZodOptional" || current._def.typeName === "ZodNullable") {
        current = current._def.innerType;
    }
    return current._def.typeName;
}

export function preprocessConvertion(data, shape) {
    for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                // case "ZodString":
                //     data[key] = decodeURIComponent(data[key]);
                //     break;
                case "ZodNumber":
                    data[key] = Number(data[key]);
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