import { Router, type IRouter } from "express";
import auth from "../../middleware/auth";
import { addBooking, getBookings, getMyBookings } from "./booking.controller";

const bookingRouter: IRouter = Router();

bookingRouter.post("/", auth("RENTER"), addBooking);
bookingRouter.get("/my", auth("RENTER"), getMyBookings);
bookingRouter.get("/", auth("ADMIN"), getBookings);

export default bookingRouter;
