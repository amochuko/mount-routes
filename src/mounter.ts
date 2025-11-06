import { Application, Router } from "express";
import fs from "node:fs";
import path from "node:path";
import * as utils from "./utils/toKebabCase";

export interface MountRouterOptions {
  /** Base URL path to mount all routers under, e.g. '/api' */
  basePath?: string;
}

/**
 * Automatically mounts all routers in a given directory.
 * This looks for directories under routes/ and mounts the first .ts/.js file inside each directory (an index file or *Router file). It supports default export, named router, or the module object itself (common patterns).
 *
 * Expected structure:
 * src/routes/
 *   home/
 *     homeRouter.ts   (or index.ts exporting router)
 *   users/
 *     usersRouter.ts
 *   AboutUs/
 *     index.ts
 *
 * @param app - Express application instance.
 * @param routesDir - Absolute path to the directory containing route folders.
 * @param options - Optional basePath for mounting (defaults to '/api').
 */
export function mountRouters(
  app: Application,
  routesDir: string,
  options: MountRouterOptions = {}
) {
  const { basePath = "/api" } = options;

  if (!fs.existsSync(routesDir)) {
    throw new Error(`Routes directory not found: ${routesDir}`);
  }

  const folders = fs.readdirSync(routesDir);
  let routeCounter = 0;

  for (const folder of folders) {
    const folderPath = path.join(routesDir, folder);
    const stat = fs.statSync(folderPath);

    if (!stat.isDirectory()) continue;

    const subFiles = fs.readdirSync(folderPath);

    for (const subFile of subFiles) {
      const subFilePath = path.join(folderPath, subFile);

      const ext = path.extname(subFile).toLowerCase();
      if (![".js", ".ts"].includes(ext)) continue;

      if (fs.statSync(subFilePath).isFile()) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const routeModule = require(subFilePath);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routerCandidate: any =
          routeModule.default || routeModule.router || routeModule;

        const isRouter =
          typeof routerCandidate == "function" ||
          (routerCandidate && typeof routerCandidate.use === "function");

        if (!isRouter) {
          console.warn(
            `\nSkipping ${folderPath}: not an express router export\n`
          );
          continue;
        }

        const router = routerCandidate as Router;

        // prefer filename without extension, or index -> folderName
        let routePathCandidate = path.parse(subFile).name; // e.g., homeRouter or index

        if (
          routePathCandidate.toLowerCase() === "index" ||
          routePathCandidate.toLowerCase() === "routers" ||
          routePathCandidate.toLowerCase() === "routes"
        ) {
          routePathCandidate = folder;
        }

        // remove trailing 'Router' in a case-insensitive way
        if (
          routePathCandidate.endsWith("Router") ||
          routePathCandidate.endsWith("Routers")
        ) {
          routePathCandidate = routePathCandidate.replace(/router$/i, "");
        }

        const routeName = utils.toKebabCase(routePathCandidate);

        if (routeName === "home" || routeName === "") {
          // mount at root
          app.use(basePath, router);
          console.info(`[mount-router]: Mounted routes at / from /${folder}/${subFile}`);
        } else {
          app.use(`${basePath}/${routeName}`, router);
          console.info(
            `[mount-router]: Mounted routes at /${routeName} from /${folder}/${subFile}`
          );
        }

        routeCounter++;
        break;
      }
    }
  }

  console.log(
    `🚀 ${routeCounter} route(s) mounted under basePath '${basePath}'`
  );
}
