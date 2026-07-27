import express, { type Application } from "express";
import prisma from "./lib/prisma";
import config from "./config";

const app: Application = express();

app.get("/", (req, res) => {
  res.send("Server is running (changed)");
});

export default app;
