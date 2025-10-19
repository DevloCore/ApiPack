function extractBaseType(zodType) {
    let current = zodType;
    while (current.def.type === "optional" || current.def.type === "nullable") {
        current = current.def.innerType;
    }
    return current.def.type;
}

export const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime())

export function preprocessBodyConvertion(data, shape) {
	for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "date":
					const parsedDate = new Date(data[key]);
					if(!isValidDate(parsedDate)) data[key] = undefined;
					else data[key] = parsedDate;
					break;
                default:
                    break;
            }
        }
    }
}

export function preprocessConvertion(data, shape) {
    for(const key in shape) {
        if(typeof data[key] === "string") {
            switch(extractBaseType(shape[key])) {
                case "date":
					const parsedDate = new Date(data[key]);
					if(!isValidDate(parsedDate)) data[key] = undefined;
					else data[key] = parsedDate;
					break;
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