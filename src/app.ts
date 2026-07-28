import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/user/user.routes";
import { notFoundHandler } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);


app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
