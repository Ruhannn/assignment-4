import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.routes";
import usersRouter from "./modules/user/user.routes";
import carRouter from "./modules/car/car.routes";
import bookingRouter from "./modules/booking/booking.routes";
import paymentRouter from "./modules/payment/payment.routes";
import { webhook } from "./modules/payment/payment.controller";
import { notFoundHandler } from "./middleware/not-found";
import { globalErrorHandler } from "./middleware/global-error";

const app: Application = express();

app.post("/payments/webhook", express.raw({ type: "application/json" }), webhook);

app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Server is running");
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/cars", carRouter);
app.use("/bookings", bookingRouter);
app.use("/payments", paymentRouter);

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
