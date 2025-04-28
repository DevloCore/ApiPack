import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

function findProjectRoot(startDir) {
  let currentDir = dirname(dirname(startDir));

  // Cherche le fichier 'package.json' dans le répertoire actuel ou ses parents
  while (!fs.existsSync(join(currentDir, 'package.json'))) {
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) throw new Error("Project root not found: 'package.json' not found in any parent directory.");
    currentDir = parentDir;
  }
  
  return currentDir;
}

export const projectRoot = findProjectRoot(dirname(fileURLToPath(import.meta.url)));

export function workingDirectory() {
  return process.cwd();
}

export function isProductionEnvironment() {
    return process.env.NODE_ENV === "production";
}