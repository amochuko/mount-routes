import { Application, Router } from "express";
import fs from "node:fs";
import path from "node:path";

/**
 * Mounts routers found under the folder path passed as arguement.
 * This looks for directories under routes/ and mounts the first .ts/.js file inside each directory (an index file or *Router file). It supports default export, named router, or the module object itself (common patterns).
 *
 * Expected structure:
 * src/routes/
 *   home/
 *     homeRouter.ts   (or index.ts exporting router)
 *   users/
 *     usersRouter.ts
 */

export function mountRouters(app: Application, routesDir: string) {
  const baseDir = routesDir; // path to directory containing the routes
 
  const items = fs.readdirSync(baseDir, { withFileTypes: true });
  let mountedCount = 0;

  for (const item of items) {
    if (!item.isDirectory()) continue;

    const folderName = item.name;
    const folderPath = path.join(baseDir, folderName);

    // Look for router files inside the directory (index, *Router)
    const subFiles = fs.readdirSync(folderPath);

    for (const subFile of subFiles) {
      // ignore hidden files
      if (subFile.startsWith(".")) continue;

      const ext = path.extname(subFile).toLowerCase();
      if (![".js", ".ts"].includes(ext)) continue;

      const subFilePath = path.join(folderPath, subFile);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let routeModule: any;

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        routeModule = require(subFilePath);
      } catch (err) {
        console.warn(`Failed to require route file ${subFilePath}: `, err);
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const routerCandidate: any =
        routeModule.default || routeModule.router || routeModule;

      const isRouter =
        typeof routerCandidate == "function" ||
        (routerCandidate && typeof routerCandidate.use === "function");

      if (!isRouter) {
        console.warn(`Skipping ${folderPath}: not an express router export`);
      }

      const router = routerCandidate as Router;

      // prefer filename without extension, or index -> folderName
      let routePathCandidate = path.parse(subFile).name; // e.g., homeRouter or index
      if (routePathCandidate.toLowerCase() === "index") {
        routePathCandidate = folderName;
      }

      // remove trailing 'Router' in a case-insensitive way
      routePathCandidate = routePathCandidate.replace(/router$/i, "");

      // convert camelCase/PascalCase to kebab-case
      const routeName = routePathCandidate
        .replace(/([a-z0-9])(A-Z)/g, "$1-$2")
        .replace(/[_\s]+/g, "-")
        .toLowerCase();

      if (routeName === "home" || routeName === "") {
        // mount at root
        app.use(`/api`, router);
        console.info(`\nMounted router at / from ${folderName}/${subFile}`);
      } else {
        app.use(`/api/${routeName}`, router);
        console.info(
          `Mounted router at /${routeName} from ${folderName}/${subFile}`
        );
      }

      mountedCount++;
      break;
    }
  }

  console.log(`A total of ${mountedCount} was mounted.\n`);
  return mountedCount;
}
