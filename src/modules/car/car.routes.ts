import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import { addCar, editCar, getCar, getCars, removeCar } from "./car.controller";

const carRouter: IRouter = Router();

carRouter.get("/", getCars);
carRouter.get("/:id", getCar);

carRouter.post("/", auth("OWNER"), addCar);
carRouter.patch("/:id", auth("OWNER", "ADMIN"), editCar);
carRouter.delete("/:id", auth("OWNER", "ADMIN"), removeCar);

export default carRouter;
