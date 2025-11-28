import { projectRoot } from "./helper.js";
import moment from "moment";
import fs from "node:fs";
import path from 'node:path';


function getTimestamp(): string {
    return new Date().toLocaleString();
}

function withDatePrefix(logFn: (...args: unknown[]) => void): (...args: unknown[]) => void {
    return (...args: unknown[]) => {
        logFn(`[${getTimestamp()}]`, ...args);
    };
}

export function logWithDatePrefix(): void {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;

    console.log = withDatePrefix(originalLog);
    console.error = withDatePrefix(originalError);
    console.warn = withDatePrefix(originalWarn);
    console.info = withDatePrefix(originalInfo);
}

export function redirectLogs(): void {
    const timeStr = moment().format("DD-MM-YYYY HH-mm-ss");
    //    const __dirname = dirname(fileURLToPath(import.meta.url));

    const logDir = path.join(projectRoot, 'logs');
    if(!fs.existsSync(logDir))
        fs.mkdirSync(logDir);

    const accessPath = path.join(logDir, `${timeStr}.out`);
    const errorPath = path.join(logDir, `${timeStr}.err`);

    const access = fs.createWriteStream(accessPath, { flags: 'a' });
    const error = fs.createWriteStream(errorPath, { flags: 'a' });

    // process.stdout.write = access.write.bind(access);
    // process.stderr.write = error.write.bind(error);
    process.stdout.write = access.write.bind(access) as typeof process.stdout.write;
    process.stderr.write = error.write.bind(error) as typeof process.stderr.write;
}
