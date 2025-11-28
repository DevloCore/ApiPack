import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

function findProjectRootFrom(startDir) {
  let currentDir = dirname(dirname(startDir));

  // Cherche le fichier 'package.json' dans le répertoire actuel ou ses parents
  while (!fs.existsSync(join(currentDir, 'package.json'))) {
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) throw new Error("Project root not found: 'package.json' not found in any parent directory. " + startDir);
    currentDir = parentDir;
  }
  
  return currentDir;
}

function findProjectRoot() {
  // 1) Essaye d'abord depuis le working directory (projet qui exécute)
  try {
    const cwdReal = fs.realpathSync(process.cwd());
	return cwdReal;
  } catch (e) {
    // 2) Fallback : cas où process.cwd() n'est pas ce qu'on attend (rare)
    const pkgDir = dirname(fileURLToPath(import.meta.url));
    // si tu veux commencer un niveau au-dessus comme avant :
    const start = dirname(pkgDir);
    return findProjectRootFrom(start);
  }
}

export const projectRoot = findProjectRoot();

export function workingDirectory() {
  return process.cwd();
}

export function isProductionEnvironment() {
    return process.env.NODE_ENV === "production";
}