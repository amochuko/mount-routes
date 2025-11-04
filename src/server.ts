import express from "express";
import http from "node:http";
import path from "node:path";
import { debug } from "node:util";
import { mountRouters } from "./mounter";

const app = express();
const PORT = process.env.PORT || 4000;

const basePath = "/my-shop";
mountRouters(app, path.join(__dirname, "dev-routes"), { basePath });

const server = http.createServer(app);

server.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server.");

  server.close(() => {
    debug("HTTP server closed");
  });
});
