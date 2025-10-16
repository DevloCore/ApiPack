function extractBaseType(zodType) {
    let current = zodType;
    while (current.def.type === "optional" || current.def.type === "nullable") {
        current = current.def.innerType;
    }
    return current.def.type;
}

export function preprocessConvertion(data, shape) {
    for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                // case "ZodString":
                //     data[key] = decodeURIComponent(data[key]);
                //     break;
                case "number":
                    const parsed = Number(data[key]);
                    if(isNaN(data[key])) data[key] = undefined;
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