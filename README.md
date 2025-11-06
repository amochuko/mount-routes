# route-mounter

Utility to automatically mount Express routers from a specified routes location.

## Installation

```bash
npm i @numquid/route-mounter
```

### Usage

```javascript
// main.(js|ts) or app.(js|ts)

import express from "express";
import { mountRouters } from "route-mounter";

const app = express();

const basePath = "/api";
const myRoutesLocation = path.join(__dirname, "the-folder-that-contain-my-routes")

mountRouters(app, myRoutesLocation, { basePath });


```

### Sample folder structure expected:

```javascript

src/routes/
  home/
    homeRouter.ts
  users/
    usersRouter.ts
  EveryDayIsRouter/
    EveryDayIsRouter.ts
  demoRoutes/
    routes.ts
  about-us/
    index.ts
  GloriousDay/
    ThisDayIsGlorious.ts

```
Taking the last route from the above sample; the same would be loaded as:

```javascript
http://localhost:4000/api/this-day-is-glorious
```


### ⚠️ Important Notes on Automatic Route Path Generation

The route path that each router is mounted to is automatically derived from its file or folder name.  
This helps you keep your routes organized while maintaining a predictable, human-readable structure.

#### 1. Single-file routers (PascalCase filenames)
If your router file name is written in PascalCase (e.g. `GloriousDay/ThisDayIsGlorious.ts`),  
it will be converted to a **kebab-case** route path:

```javascript
/GloriousDay/ThisDayIsGlorious.ts  →  /this-day-is-glorious
```

#### 2. Routers defined in an index.ts file
If your router file is named index.ts, the parent folder name becomes the route path:

```javascript
/about-us/index.ts  →  /about-us
```

#### 3. Routers defined in a custom file (not index.ts)
If the router is in a folder but not named index.ts, the folder name becomes the route path (converted to kebab-case):

```javascript
/demoRoutes/routes.ts  →  /demo-routes
```

#### 4. Root-level routers
f a router file is located at the root of your routes directory (e.g. home/homeRouter.ts),
it will mount to / unless a specific prefix or folder name dictates otherwise:

```javascript
/home/homeRouter.ts  →  /
```

#### 5. General behavior
- All route paths are normalized to lowercase kebab-case.
- Folder and file names determine the route path hierarchy automatically.
- No manual route prefixing is needed unless you want to override the defaults.
