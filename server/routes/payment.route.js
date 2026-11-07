import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controller/payment.controller.js";
import isAuth from "../middleware/isauth.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-order", isAuth, createPaymentOrder);
paymentRouter.post("/verify", isAuth, verifyPayment);

export default paymentRouter;