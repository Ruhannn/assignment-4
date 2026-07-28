import { Router } from "express";
import { getMe, getUsers,  } from "./user.controller";
import auth from "../../middleware/auth";

const userRouter = Router();

userRouter.get("/me", auth(), getMe);
userRouter.get("/", auth("ADMIN"), getUsers);

export default userRouter;
