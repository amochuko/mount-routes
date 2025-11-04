import express from "express";
import path from "node:path";
import request from "supertest";
import { mountRouters } from "../../mounter";

// describe("mountRouters", () => {
//   let app: express.Application;

//   beforeEach(() => {
//     app = express();
//   });

//   test("mounts home router at /", async () => {
//     const mounted = mountRouters(app, path.resolve("src", "dev-routes"));

//     // at least 1 route is mounted
//     expect(mounted).toBeGreaterThanOrEqual(1);

//     // health-like route on the demo home router
//     const resRoot = await request(app).get("/");
//     expect([200, 404]).toContain(resRoot.status);

//     if (resRoot.status === 200) {
//       expect(resRoot.body).toHaveProperty("data");
//       expect(resRoot.body.date).toMatch(/Welcome/i);
//     }

//     // ensures /home exists if not mounted at root
//     const resHome = await request(app).get("/home");
//     if (resHome.status === 200) {
//       expect(resHome.body).toHaveProperty("data");
//     }
//   });
// });


 

describe("mountRouters", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
  });

  test("mounts home router at root with custom basePath", async () => {
    // set basePath to '/' so homeRouter mounts at '/'
    mountRouters(app, path.resolve("src", "dev-routes"), {
      basePath: "/",
    });

    // test root route (homeRouter)
    const resRoot = await request(app).get("/");

    expect(resRoot.status).toBe(200);
    expect(resRoot.body).toHaveProperty("data");
    expect(resRoot.body.data).toMatch(/Welcome/i);

    // If you had other routes like users or aboutUs, test them too
    // e.g., /about-us
    const resAbout = await request(app).get("/about-us");
    expect([200, 404]).toContain(resAbout.status); // 404 if about-us doesn't exist in test routes
  });
});
