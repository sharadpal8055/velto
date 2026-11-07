import crypto from "crypto";
import mongoose from "mongoose";
import Payment from "../model/payment.model.js";
import User from "../model/user.model.js";
import {
  getPaymentPlan,
  getRazorpayClient,
  getRazorpayKeyId,
} from "../service/razorpay.service.js";

export const createPaymentOrder = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Please login before purchasing credits.",
      });
    }

    const plan = getPaymentPlan(req.body?.planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid credit package.",
      });
    }

    const user = await User.findById(req.userId).select("name email");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: plan.currency,
      receipt: `velto_${req.userId}_${Date.now()}`,
      notes: {
        userId: String(req.userId),
        planId: plan.id,
      },
    });

    await Payment.create({
      userId: req.userId,
      planId: plan.id,
      orderId: order.id,
      amount: plan.amount,
      currency: plan.currency,
      credits: plan.credits,
      status: "created",
    });

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        amount: plan.amount,
        currency: plan.currency,
        planId: plan.id,
        planName: plan.name,
        credits: plan.credits,
        keyId: getRazorpayKeyId(),
        prefill: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to start checkout.",
    });
  }
};

const isValidSignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || typeof signature !== "string") return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest();

  let actual;
  try {
    actual = Buffer.from(signature, "hex");
  } catch {
    return false;
  }

  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(actual, expected)
  );
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body || {};

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message: "Payment order, payment ID, and signature are required.",
    });
  }

  if (!isValidSignature({ orderId, paymentId, signature })) {
    return res.status(400).json({
      success: false,
      message: "Payment signature verification failed.",
    });
  }

  const session = await mongoose.startSession();
  try {
    const payment = await Payment.findOne({ orderId, userId: req.userId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found for this account.",
      });
    }

    if (payment.status === "paid") {
      if (payment.paymentId !== paymentId) {
        return res.status(409).json({
          success: false,
          message: "This order has already been fulfilled by another payment.",
        });
      }

      const currentUser = await User.findById(req.userId).select("credit");
      return res.status(200).json({
        success: true,
        message: "Payment was already verified.",
        data: {
          creditsAdded: payment.credits,
          credits: currentUser?.credit ?? 0,
          planId: payment.planId,
        },
      });
    }

    const razorpayPayment = await getRazorpayClient().payments.fetch(paymentId);
    if (
      razorpayPayment.order_id !== orderId ||
      razorpayPayment.amount !== payment.amount ||
      razorpayPayment.currency !== payment.currency ||
      razorpayPayment.status !== "captured"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment has not been captured for this order.",
      });
    }

    let updatedCredit;
    await session.withTransaction(async () => {
      const currentPayment = await Payment.findOne({ orderId, userId: req.userId })
        .session(session);

      if (!currentPayment) {
        throw new Error("Payment order no longer exists.");
      }

      if (currentPayment.status === "paid") {
        if (currentPayment.paymentId !== paymentId) {
          throw new Error("This order was fulfilled by another payment.");
        }
        const currentUser = await User.findById(req.userId)
          .select("credit")
          .session(session);
        updatedCredit = currentUser?.credit ?? 0;
        return;
      }

      currentPayment.status = "paid";
      currentPayment.paymentId = paymentId;
      await currentPayment.save({ session });

      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { $inc: { credit: currentPayment.credits } },
        { new: true, session, select: "credit" }
      );

      if (!updatedUser) {
        throw new Error("User account not found while applying credits.");
      }
      updatedCredit = updatedUser.credit;
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added successfully.",
      data: {
        creditsAdded: payment.credits,
        credits: updatedCredit,
        planId: payment.planId,
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Unable to verify payment.",
    });
  } finally {
    await session.endSession();
  }
};