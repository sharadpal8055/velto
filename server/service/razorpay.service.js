import Razorpay from "razorpay";

const paymentPlans = Object.freeze({
  starter: Object.freeze({
    id: "starter",
    name: "Starter",
    amount: 10000,
    currency: "INR",
    credits: 150,
  }),
  pro: Object.freeze({
    id: "pro",
    name: "Pro",
    amount: 50000,
    currency: "INR",
    credits: 650,
  }),
});

let razorpayClient;

export const getPaymentPlan = (planId) => paymentPlans[planId] || null;

export const getPaymentPlans = () =>
  Object.values(paymentPlans).map(({ id, name, amount, currency, credits }) => ({
    id,
    name,
    amount,
    currency,
    credits,
  }));

export const getRazorpayKeyId = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }

  return keyId;
};

export const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured on the server.");
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  return razorpayClient;
};