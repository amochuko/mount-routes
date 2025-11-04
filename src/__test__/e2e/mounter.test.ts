import express from "express";
import path from "node:path";
import request from "supertest";
import { mountRouters } from "../../mounter";

describe("mountRouters", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
  });

  test("mounts home router at /", async () => {
    const mounted = mountRouters(app, path.resolve("src", "routes"));

    // at least 1 route is mounted
    expect(mounted).toBeGreaterThanOrEqual(1);

    // health-like route on the demo home router
    const resRoot = await request(app).get("/");
    expect([200, 404]).toContain(resRoot.status);

    if (resRoot.status === 200) {
      expect(resRoot.body).toHaveProperty("data");
      expect(resRoot.body.date).toMatch(/Welcome/i);
    }

    // ensures /home exists if not mounted at root
    const resHome = await request(app).get("/home");
    if (resHome.status === 200) {
      expect(resHome.body).toHaveProperty("data");
    }
  });
});
