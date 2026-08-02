import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import { checkout, getMyPayments } from "./payment.controller";

const paymentRouter: IRouter = Router();

paymentRouter.post("/checkout/:bookingId", auth("RENTER"), checkout);
paymentRouter.get("/my", auth("RENTER"), getMyPayments);

export default paymentRouter;
