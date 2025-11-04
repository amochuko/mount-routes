# route-mounter

Utility to automatically mount Express routers from `src/routes/*`.

## Installation

```bash
npm i @numquid/route-mounter
```

### Usage

```javascript
import express from "express";
import { mountRouters } from "route-mounter";

const app = express();
mountRouters(app);
```

### Folder structure expected:

```bash
src/routes/
  home/
    homeRouter.ts
  users/
    usersRouter.ts
```

If a folder contains an index.ts or a file named *Router.ts, the first router found will be mounted. A folder named home will be mounted at /, others will be kebab-cased and mounted under /<name>.
