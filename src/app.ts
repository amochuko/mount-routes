import express from "express";
import { mountRouters } from "./routes/mounter";
const app = express();

mountRouters(app);

export default app;
